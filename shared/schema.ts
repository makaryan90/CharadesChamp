import { z } from "zod";

export const categorySchema = z.object({
  id: z.string(),
  name: z.string(),
  icon: z.string(),
  color: z.string(),
  words: z.array(z.string()),
});

export const gameSettingsSchema = z.object({
  timerLength: z.enum(["30", "60", "90"]),
  selectedCategories: z.array(z.string()),
  soundEnabled: z.boolean(),
});

export const gameStateSchema = z.object({
  status: z.enum(["welcome", "category-select", "playing", "paused", "ended"]),
  score: z.number(),
  currentWord: z.string().nullable(),
  currentCategory: z.string().nullable(),
  timeRemaining: z.number(),
  wordsGuessed: z.array(z.string()),
});

export type Category = z.infer<typeof categorySchema>;
export type GameSettings = z.infer<typeof gameSettingsSchema>;
export type GameState = z.infer<typeof gameStateSchema>;
