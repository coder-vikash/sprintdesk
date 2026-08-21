import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ThemeState {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

function applyThemeToDocument(theme: "light" | "dark") {
  document.documentElement.classList.toggle("dark", theme === "dark");
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: "light",
      toggleTheme: () => {
        const next = get().theme === "light" ? "dark" : "light";
        applyThemeToDocument(next);
        set({ theme: next });
      },
    }),
    {
      name: "sprintdesk-theme",
      // when the page reloads and zustand restores the saved theme, apply it to the DOM too
      onRehydrateStorage: () => (state) => {
        if (state) applyThemeToDocument(state.theme);
      },
    }
  )
);