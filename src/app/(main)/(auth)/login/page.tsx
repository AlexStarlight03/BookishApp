// src/app/(auth)/login/page.tsx
import { SignIn } from "@stackframe/stack";

export default function LoginPage() {
  return (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <SignIn />
        </div>
  );
}