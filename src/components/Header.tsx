"use client";

import { Dumbbell } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

export function Header({ theme, onToggleTheme }: { theme: "light" | "dark"; onToggleTheme: () => void }) {
  return (
    <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-graphite text-white">
            <Dumbbell className="h-4 w-4" />
          </div>
          <span className="font-semibold tracking-tight">Fitness Dashboard</span>
        </div>
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      </div>
    </header>
  );
}
