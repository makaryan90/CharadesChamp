import { useState, useEffect } from "react";
import { type GameSettings } from "@shared/schema";
import { categories } from "@/lib/categories";

const DEFAULT_SETTINGS: GameSettings = {
  timerLength: "60",
  selectedCategories: categories.map((c) => c.id),
  soundEnabled: true,
  numberOfRounds: "5",
  gameMode: "solo",
};

export function useGameSettings() {
  const [settings, setSettings] = useState<GameSettings>(() => {
    const stored = localStorage.getItem("charades-settings");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Merge with defaults to handle missing fields from legacy settings
        return { ...DEFAULT_SETTINGS, ...parsed };
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

  const applySettings = (
    updater: Partial<GameSettings> | ((prev: GameSettings) => GameSettings)
  ): GameSettings => {
    let computed: GameSettings | null = null;
    
    setSettings((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };
      computed = next;
      return next;
    });
    
    return computed ?? settings;
  };

  return {
    settings,
    updateSettings,
    applySettings,
  };
}
