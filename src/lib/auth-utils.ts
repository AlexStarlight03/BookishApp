// src/lib/auth-utils.ts
import  prisma  from "./prisma";
import { stackServerApp } from "./stack";
import { redirect } from "next/navigation";

export async function requireAuth() {
  const stackUser = await stackServerApp.getUser();
  
  if (!stackUser) {
    redirect("/handler/sign-in");
  }

  const user = await prisma.user.findUnique({
    where: { stackAuthId: stackUser.id },
  });

  if (!user) {
    redirect("/handler/sign-in");
  }

  return user;
}