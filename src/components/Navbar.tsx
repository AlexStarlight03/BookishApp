"use client";

import Link from "next/link";
import { useUser } from "@stackframe/stack";
import { LoginButton } from "@/components/auth/LoginButton";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { UserMenu } from "@/components/auth/UserMenu";

export function Navbar() {
  const user = useUser();

  return (
    <header className="bg-gray-900 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-3 h-16">
        <nav className="flex gap-6">
          <Link href="/" className="text-white font-bold text-lg hover:text-purple-400 transition">Accueil</Link>
          <Link href="/dashboard" className="text-white font-medium hover:text-purple-400 transition">Dashboard</Link>
          <Link href="/explore" className="text-white font-medium hover:text-purple-400 transition">Explorer</Link>
          <Link href="/profil" className="text-white font-medium hover:text-purple-400 transition">Profil</Link>
        </nav>
        <div className="flex items-center gap-4">
          {/* Show UserMenu if logged in, else show login/signup */}
          {user ? <UserMenu /> : (
            <>
              <LoginButton />
              <Link
                href="/handler/sign-up"
                className="bg-purple-600 text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer hover:bg-purple-700 transition"
              >
                Inscription
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}