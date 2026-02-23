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
    where: { idUser: stackUser.id },
    update: {
      email: stackUser.primaryEmail || "",
      username: stackUser.displayName || "",
      avatar: stackUser.profileImageUrl || null,
    },
    create: {
      idUser: stackUser.id,
      email: stackUser.primaryEmail || "",
      username: stackUser.displayName || "",
      avatar: stackUser.profileImageUrl || null,
    },
  });

  // Créer les bookshelves par défaut si l'utilisateur vient d'être créé
  if (user.createdAt.getTime() === user.updatedAt.getTime()) {
    const defaultBookshelves = [
      { name: "À lire", description: "Livres que je souhaite lire" },
      { name: "En cours", description: "Livres que je suis en train de lire" },
      { name: "Terminés", description: "Livres que j'ai terminés" },
    ];
    await Promise.all(
      defaultBookshelves.map((shelf) =>
        prisma.bookshelf.create({
          data: {
            idUser: user.idUser,
            name: shelf.name,
            description: shelf.description,
          },
        })
      )
    );
  }

  return user;
}