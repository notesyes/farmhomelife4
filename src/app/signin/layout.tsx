import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | Farm Home Life",
  description: "Sign in to your Farm Home Life account to manage your farm.",
};

export default function SignInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
