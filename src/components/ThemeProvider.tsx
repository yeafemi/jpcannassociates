import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "gray";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  reducedMotion: boolean;
  setReducedMotion: (active: boolean) => void;
  compactMode: boolean;
  setCompactMode: (active: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem("ui-theme") as Theme) || "light";
  });

  const [reducedMotion, setReducedMotion] = useState<boolean>(() => {
    return localStorage.getItem("ui-reduced-motion") === "true";
  });

  const [compactMode, setCompactMode] = useState<boolean>(() => {
    return localStorage.getItem("ui-compact-mode") === "true";
  });

  useEffect(() => {
    const root = window.document.documentElement;

    // Remove old themes
    root.classList.remove("light", "dark", "gray");
    root.classList.add(theme);
    localStorage.setItem("ui-theme", theme);
  }, [theme]);

  useEffect(() => {
    const root = window.document.documentElement;
    if (reducedMotion) {
      root.classList.add("reduced-motion");
    } else {
      root.classList.remove("reduced-motion");
    }
    localStorage.setItem("ui-reduced-motion", reducedMotion.toString());
  }, [reducedMotion]);

  useEffect(() => {
    const root = window.document.documentElement;
    if (compactMode) {
      root.classList.add("compact");
    } else {
      root.classList.remove("compact");
    }
    localStorage.setItem("ui-compact-mode", compactMode.toString());
  }, [compactMode]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        reducedMotion,
        setReducedMotion,
        compactMode,
        setCompactMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
