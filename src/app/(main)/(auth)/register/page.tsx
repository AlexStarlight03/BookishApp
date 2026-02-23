// src/app/(auth)/register/page.tsx
"use client";

import { SignUp, useUser } from "@stackframe/stack";
import { useEffect, useRef } from "react";
import { createUser } from "@/app/actions/user";

export default function RegisterPage() {
  const user = useUser();
  const synced = useRef(false);

  useEffect(() => {
    if (user && !synced.current) {
      synced.current = true;
      createUser({
        username: user.displayName || user.primaryEmail?.split("@")[0] || "user",
        email: user.primaryEmail || "",
        stackAuthId: user.id,
      })
        .then((data) => {
          console.log("Sync user response:", data);
        })
        .catch((err) => {
          console.error("Error syncing user:", err);
        });
    }
  }, [user]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <SignUp />
    </div>
  );
}