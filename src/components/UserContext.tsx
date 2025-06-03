"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type UserContextType = {
  profileImage: string;
  userName: string;
  userInitials: string;
  setProfileImage: (url: string) => void;
  setUserName: (name: string) => void;
};

const defaultProfileImage = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80";
const defaultUserName = "John Doe";

const UserContext = createContext<UserContextType>({
  profileImage: defaultProfileImage,
  userName: defaultUserName,
  userInitials: "JD",
  setProfileImage: () => {},
  setUserName: () => {},
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [profileImage, setProfileImage] = useState<string>(defaultProfileImage);
  const [userName, setUserName] = useState<string>(defaultUserName);
  const [userInitials, setUserInitials] = useState<string>("JD");

  // Load user data from localStorage on initial render
  useEffect(() => {
    const savedProfileImage = localStorage.getItem('userProfileImage');
    const savedUserName = localStorage.getItem('userName');
    
    if (savedProfileImage) {
      setProfileImage(savedProfileImage);
    }
    
    if (savedUserName) {
      setUserName(savedUserName);
      
      // Generate initials from name
      const nameParts = savedUserName.split(' ');
      if (nameParts.length >= 2) {
        setUserInitials(`${nameParts[0][0]}${nameParts[1][0]}`);
      } else if (nameParts.length === 1) {
        setUserInitials(nameParts[0].substring(0, 2));
      }
    }
  }, []);

  // Save user data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('userProfileImage', profileImage);
    localStorage.setItem('userName', userName);
    
    // Generate initials from name
    const nameParts = userName.split(' ');
    if (nameParts.length >= 2) {
      setUserInitials(`${nameParts[0][0]}${nameParts[1][0]}`);
    } else if (nameParts.length === 1) {
      setUserInitials(nameParts[0].substring(0, 2));
    }
  }, [profileImage, userName]);

  return (
    <UserContext.Provider value={{ 
      profileImage, 
      userName, 
      userInitials,
      setProfileImage, 
      setUserName 
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
