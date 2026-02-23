// src/components/auth/LoginButton.tsx
"use client";

import { useUser } from "@stackframe/stack";
import Link from "next/link";

export function LoginButton() {
  const user = useUser();

  if (user) {
    return (
      <Link 
        href="/dashboard"
        className="book-button bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-bold px-6 py-2 rounded-full shadow-lg hover:scale-105 transition-all"
      >
        Dashboard
      </Link>
    );
  }

  return (
    <Link 
      href="/handler/sign-in"
      className="book-button bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-bold px-6 py-2 rounded-full shadow-lg hover:scale-105 transition-all"
    >
      Se connecter
    </Link>
  );
}