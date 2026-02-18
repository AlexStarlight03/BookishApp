// src/lib/sync-user.ts
import  prisma  from "./prisma";
import { stackServerApp } from "./stack";

export async function syncUserWithDatabase() {
  const stackUser = await stackServerApp.getUser();
  
  if (!stackUser) {
    return null;
  }

  // Upsert: créer ou mettre à jour l'utilisateur
  const user = await prisma.user.upsert({
    where: { stackAuthId: stackUser.id },
    update: {
      email: stackUser.primaryEmail || "",
      username: stackUser.displayName || "",
      avatar: stackUser.profileImageUrl || null,
    },
    create: {
      stackAuthId: stackUser.id,
      email: stackUser.primaryEmail || "",
      username: stackUser.displayName || "",
      avatar: stackUser.profileImageUrl || null,
    },
  });

  return user;
}