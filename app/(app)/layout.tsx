import React from "react";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <div style={{ flex: 1, marginLeft: 228, display: "flex", flexDirection: "column" }}>
        <Header />
        <main style={{ flex: 1, padding: "32px 36px", overflowY: "auto" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
