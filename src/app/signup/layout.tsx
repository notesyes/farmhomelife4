import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up | Farm Home Life",
  description: "Create your Farm Home Life account to start managing your farm efficiently.",
};

export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
