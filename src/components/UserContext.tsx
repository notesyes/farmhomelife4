"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

type UserContextType = {
  profileImage: string;
  userName: string;
  userInitials: string;
  userEmail: string;
  isLoading: boolean;
  setProfileImage: (url: string) => void;
  setUserName: (name: string) => void;
};

const defaultProfileImage =
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80";

const UserContext = createContext<UserContextType>({
  profileImage: defaultProfileImage,
  userName: "",
  userInitials: "",
  userEmail: "",
  isLoading: true,
  setProfileImage: () => {},
  setUserName: () => {},
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [profileImage, setProfileImage] = useState<string>(defaultProfileImage);
  const [userName, setUserName] = useState<string>("");
  const [userInitials, setUserInitials] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const supabase = createClientComponentClient();

  // Generate initials from name
  const generateInitials = (name: string) => {
    if (!name) return "";
    const nameParts = name.split(" ");
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
    } else if (nameParts.length === 1) {
      return nameParts[0].substring(0, 2).toUpperCase();
    }
    return "";
  };

  // Load user data from Supabase auth
  useEffect(() => {
    const getUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          // Get user email
          setUserEmail(user.email || "");

          // Try to get name from user metadata or email
          let displayName = "";
          if (user.user_metadata?.full_name) {
            displayName = user.user_metadata.full_name;
          } else if (user.user_metadata?.name) {
            displayName = user.user_metadata.name;
          } else if (user.email) {
            // Extract name from email (before @)
            displayName = user.email.split("@")[0].replace(/[._]/g, " ");
            // Capitalize each word
            displayName = displayName
              .split(" ")
              .map(
                (word) =>
                  word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
              )
              .join(" ");
          }

          setUserName(displayName);
          setUserInitials(generateInitials(displayName));

          // Check for custom profile image
          if (user.user_metadata?.avatar_url) {
            setProfileImage(user.user_metadata.avatar_url);
          }
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getUser();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        const user = session.user;
        setUserEmail(user.email || "");

        let displayName = "";
        if (user.user_metadata?.full_name) {
          displayName = user.user_metadata.full_name;
        } else if (user.user_metadata?.name) {
          displayName = user.user_metadata.name;
        } else if (user.email) {
          displayName = user.email.split("@")[0].replace(/[._]/g, " ");
          displayName = displayName
            .split(" ")
            .map(
              (word) =>
                word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            )
            .join(" ");
        }

        setUserName(displayName);
        setUserInitials(generateInitials(displayName));

        if (user.user_metadata?.avatar_url) {
          setProfileImage(user.user_metadata.avatar_url);
        }
      } else if (event === "SIGNED_OUT") {
        setUserName("");
        setUserEmail("");
        setUserInitials("");
        setProfileImage(defaultProfileImage);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  // Update initials when userName changes
  useEffect(() => {
    setUserInitials(generateInitials(userName));
  }, [userName]);

  return (
    <UserContext.Provider
      value={{
        profileImage,
        userName,
        userInitials,
        userEmail,
        isLoading,
        setProfileImage,
        setUserName,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
