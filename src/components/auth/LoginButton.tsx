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
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Dashboard
      </Link>
    );
  }

  return (
    <Link 
      href="/handler/sign-in"
      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
    >
      Se connecter
    </Link>
  );
}