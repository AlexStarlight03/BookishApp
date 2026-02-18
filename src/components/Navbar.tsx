"use client";

import Link from "next/link";
import { useUser } from "@stackframe/stack";
import { LoginButton } from "@/components/auth/LoginButton";
import { LogoutButton } from "@/components/auth/LogoutButton";

export function Navbar() {
  const user = useUser();

  return (
    <header className="flex justify-between items-center p-4 gap-4 h-16">
      <nav className="flex gap-4">
        <Link href="/" className="text-white font-medium hover:text-purple-400 transition">Home</Link>
        <Link href="/dashboard" className="text-white font-medium hover:text-purple-400 transition">Dashboard</Link>
        <Link href="/explore" className="text-white font-medium hover:text-purple-400 transition">Explore</Link>
      </nav>
      <div className="flex items-center gap-4">
        {!user && (
          <>
            <LoginButton />
            <Link
              href="/handler/sign-up"
              className="bg-[#6c47ff] text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer"
            >
              Sign Up
            </Link>
          </>
        )}
        {user && (
          <>
            <span className="text-white font-medium">{user.displayName}</span>
            <LogoutButton />
          </>
        )}
      </div>
    </header>
  );
}