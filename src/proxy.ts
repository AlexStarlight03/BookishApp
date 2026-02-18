// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes qui nécessitent une authentification
const protectedRoutes = ["/dashboard", "/profile", "/settings"];

// Routes réservées aux non-authentifiés
const authRoutes = ["/login", "/register"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Vérifier si c'est une route protégée
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  const isAuthRoute = authRoutes.some(route => 
    pathname.startsWith(route)
  );

  // Stack Auth gère les sessions via cookies
  // Le middleware peut rediriger si nécessaire
  // La vérification réelle se fait côté serveur
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};