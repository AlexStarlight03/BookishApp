// src/components/UserInfo.tsx
// FIXED: Added "use client" - useUser() is a client-only hook
"use client";

import { useUser } from "@stackframe/stack";

export function UserInfo() {
  const user = useUser();

  if (!user) {
    return <p>Chargement...</p>;
  }

  return (
    <div className="bg-card rounded-xl shadow-md p-4 flex items-center gap-4 max-w-md mx-auto mt-4">
      {user.profileImageUrl ? (
        <img src={user.profileImageUrl} alt="Avatar" className="w-12 h-12 rounded-full border border-gray-300" />
      ) : (
        <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl font-bold border border-gray-300">
          {user.displayName?.[0] || user.primaryEmail?.[0] || "U"}
        </div>
      )}
      <div className="flex flex-col">
        <span className="font-semibold text-lg text-primary">{user.displayName || user.primaryEmail}</span>
        <span className="text-xs text-gray-500">{user.primaryEmail}</span>
      </div>
    </div>
  );
}