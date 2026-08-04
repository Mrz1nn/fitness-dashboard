"use client";

import { useEffect, useState } from "react";
import { loadPreferences, savePreferences } from "@/lib/storage";
import type { Preferences } from "@/lib/types";

export function useTheme() {
  const [theme, setTheme] = useState<Preferences["theme"]>("light");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const prefs = loadPreferences();
    const initial = document.documentElement.classList.contains("dark") ? "dark" : prefs.theme;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time sync with the pre-hydration theme script
    setTheme(initial);
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady) return;
    document.documentElement.classList.toggle("dark", theme === "dark");
    savePreferences({ theme });
  }, [theme, isReady]);

  function toggleTheme() {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }

  return { theme, toggleTheme, isReady };
}
