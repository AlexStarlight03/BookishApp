"use client";

import Link from "next/link";
import { useUser } from "@stackframe/stack";
import { LoginButton } from "@/components/auth/LoginButton";
import { UserMenu } from "@/components/auth/UserMenu";

export function Navbar() {
  const user = useUser();

  return (
    <header className="bg-[var(--accent-dark)] shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-3 h-16">
        <nav className="flex gap-8">
          <Link href="/" className="font-bold text-lg text-[var(--accent)] hover:underline underline-offset-4 hover:text-[var(--highlight)] transition">Accueil</Link>
          <Link href="/dashboard" className="font-medium text-[var(--accent)] hover:underline underline-offset-4 hover:text-[var(--highlight)] transition">Dashboard</Link>
          <Link href="/explore" className="font-medium text-[var(--accent)] hover:underline underline-offset-4 hover:text-[var(--highlight)] transition">Explorer</Link>
          {user && (
            <>
              <Link href="/reviews" className="font-medium text-[var(--accent)] hover:underline underline-offset-4 hover:text-[var(--highlight)] transition">Critiques</Link>
              <Link href="/bookshelves" className="font-medium text-[var(--accent)] hover:underline underline-offset-4 hover:text-[var(--highlight)] transition">Étagères</Link>
            </>
          )}
        </nav>
        <div className="flex items-center gap-4">
          {user ? <UserMenu /> : (
            <>
              <LoginButton />
              <Link
                href="/handler/sign-up"
                className="book-button bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 text-white font-bold px-6 py-2 rounded-full shadow-lg hover:scale-105 transition-all"
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