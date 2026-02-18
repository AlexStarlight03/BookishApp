import { StackProvider, StackTheme } from "@stackframe/stack";
import { stackServerApp } from "@/lib/stack";
import { Navbar } from "@/components/Navbar";
import "../globals.css";

export default function AppShellLayout({ children }: { children: React.ReactNode }) {
  return (
    <StackProvider app={stackServerApp}>
      <StackTheme>
        <Navbar />
        {children}
      </StackTheme>
    </StackProvider>
  );
}