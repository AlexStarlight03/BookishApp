// src/components/UserInfo.tsx
"use client";

import { useUser } from "@stackframe/stack";

export function UserInfo() {
  const user = useUser();

  if (!user) {
    return <p>Chargement...</p>;
  }

  return (
    <div>
      <p>Connecté en tant que : {user.primaryEmail}</p>
    </div>
  );
}