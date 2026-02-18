
// src/components/auth/UserMenu.tsx
"use client";

import { useUser } from "@stackframe/stack";
import { useState } from "react";
import Link from "next/link";

export function UserMenu() {
  const user = useUser();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) {
    return (
      <div className="flex gap-2">
        <Link href="/handler/sign-in" className="btn-secondary">
          Connexion
        </Link>
        <Link href="/handler/sign-up" className="btn-primary">
          Inscription
        </Link>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-100"
      >
        {user.profileImageUrl ? (
          <img
            src={user.profileImageUrl}
            alt="Avatar"
            className="w-8 h-8 rounded-full"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
            {user.displayName?.[0] || user.primaryEmail?.[0] || "U"}
          </div>
        )}
        <span className="hidden md:block">
          {user.displayName || user.primaryEmail}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-1">
          <Link
            href="/dashboard"
            className="block px-4 py-2 hover:bg-gray-100"
            onClick={() => setIsOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            href="/handler/account-settings"
            className="block px-4 py-2 hover:bg-gray-100"
            onClick={() => setIsOpen(false)}
          >
            Paramètres
          </Link>
          <hr className="my-1" />
          <button
            onClick={() => {
              user.signOut();
              setIsOpen(false);
            }}
            className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
          >
            Déconnexion
          </button>
        </div>
      )}
    </div>
  );
}