// src/components/auth/LogoutButton.tsx
"use client";

import { useUser } from "@stackframe/stack";

export function LogoutButton() {
  const user = useUser();

  if (!user) return null;

  return (
    <button
      onClick={() => user.signOut()}
      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
    >
      Se déconnecter
    </button>
  );
}