// src/app/(protected)/layout.tsx
import { redirect } from "next/navigation";
import { stackServerApp } from "@/lib/stack";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await stackServerApp.getUser();

  if (!user) {
    redirect("/handler/sign-in");
  }

  return <>{children}</>;
}