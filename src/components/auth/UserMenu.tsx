
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
        <Link href="/handler/sign-in" className="book-button bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-bold px-6 py-2 rounded-full shadow-lg hover:scale-105 transition-all">
          Connexion
        </Link>
        <Link href="/handler/sign-up" className="book-button bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 text-white font-bold px-6 py-2 rounded-full shadow-lg hover:scale-105 transition-all">
          Inscription
        </Link>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-bold shadow-lg hover:scale-105 transition-all"
      >
        {user.profileImageUrl ? (
          <img
            src={user.profileImageUrl}
            alt="Avatar"
            className="w-8 h-8 rounded-full border-2 border-white shadow-md"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg border-2 border-white shadow-md">
            {user.displayName?.[0] || user.primaryEmail?.[0] || "U"}
          </div>
        )}
        <span className="hidden md:block">
          {user.displayName || user.primaryEmail}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50">
          <Link
            href="/dashboard"
            className="block px-4 py-2 font-semibold text-gray-700 hover:bg-gray-100 transition"
            onClick={() => setIsOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            href="/handler/account-settings"
            className="block px-4 py-2 font-semibold text-gray-700 hover:bg-gray-100 transition"
            onClick={() => setIsOpen(false)}
          >
            Paramètres
          </Link>
          <hr className="my-2 border-gray-200" />
          <button
            onClick={() => {
              user.signOut();
              setIsOpen(false);
            }}
            className="block w-full text-left px-4 py-2 font-semibold hover:bg-red-100 text-red-600 transition"
          >
            Déconnexion
          </button>
        </div>
      )}
    </div>
  );
}