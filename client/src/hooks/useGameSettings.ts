import { useState, useEffect } from "react";
import { type GameSettings } from "@shared/schema";
import { categories } from "@/lib/categories";

const DEFAULT_SETTINGS: GameSettings = {
  timerLength: "60",
  selectedCategories: categories.map((c) => c.id),
  soundEnabled: true,
  gameMode: "solo",
};

export function useGameSettings() {
  const [settings, setSettings] = useState<GameSettings>(() => {
    const stored = localStorage.getItem("charades-settings");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return DEFAULT_SETTINGS;
      }
    }
    return DEFAULT_SETTINGS;
  });

  useEffect(() => {
    localStorage.setItem("charades-settings", JSON.stringify(settings));
    localStorage.setItem("timerLength", settings.timerLength);
  }, [settings]);

  const updateSettings = (newSettings: Partial<GameSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  return {
    settings,
    updateSettings,
  };
}
