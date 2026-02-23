// src/components/auth/LogoutButton.tsx
"use client";

import { useUser } from "@stackframe/stack";

export function LogoutButton() {
  const user = useUser();

  if (!user) return null;

  return (
    <button
      onClick={() => user.signOut()}
      className="book-button bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white font-bold px-6 py-2 rounded-full shadow-lg hover:scale-105 transition-all"
    >
      Se déconnecter
    </button>
  );
}