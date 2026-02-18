// src/app/dashboard/page.tsx
import { stackServerApp } from "@/lib/stack";

export default async function DashboardPage() {
  const user = await stackServerApp.getUser();
  
  if (!user) {
    return <div>Non authentifié</div>;
  }

  return (
    <div>
      <h1>Bienvenue, {user.displayName || user.primaryEmail}</h1>
      <p>ID: {user.id}</p>
      <p>Email: {user.primaryEmail}</p>
    </div>
  );
}