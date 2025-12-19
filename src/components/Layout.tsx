import type { ReactNode } from "react";
import { Header } from "@/components/Header";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl p-6">{children}</main>
    </>
  );
}