import { pgTable, serial, varchar, integer, text, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const games = pgTable("games", {
  id: serial("id").primaryKey(),
  mode: varchar("mode", { length: 20 }).notNull().default("solo"),
  teamCount: integer("team_count"),
  finalScore: integer("final_score").notNull(),
  duration: integer("duration").notNull(),
  categories: text("categories").array().notNull(),
  difficulty: varchar("difficulty", { length: 20 }),
  wordsGuessed: integer("words_guessed").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const teams = pgTable("teams", {
  id: serial("id").primaryKey(),
  gameId: integer("game_id").notNull().references(() => games.id),
  name: varchar("name", { length: 50 }).notNull(),
  score: integer("score").notNull().default(0),
  color: varchar("color", { length: 20 }).notNull(),
  orderIndex: integer("order_index").notNull(),
});

export const customCategories = pgTable("custom_categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 50 }).notNull(),
  words: text("words").array().notNull(),
  icon: varchar("icon", { length: 50 }).default("Sparkles"),
  color: varchar("color", { length: 20 }).default("purple"),
  deviceId: varchar("device_id", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertGameSchema = createInsertSchema(games).omit({ id: true, createdAt: true });
export const insertTeamSchema = createInsertSchema(teams).omit({ id: true });
export const insertCustomCategorySchema = createInsertSchema(customCategories).omit({ id: true, createdAt: true });

export type Game = typeof games.$inferSelect;
export type InsertGame = z.infer<typeof insertGameSchema>;
export type Team = typeof teams.$inferSelect;
export type InsertTeam = z.infer<typeof insertTeamSchema>;
export type CustomCategory = typeof customCategories.$inferSelect;
export type InsertCustomCategory = z.infer<typeof insertCustomCategorySchema>;

export type GameHistory = Game;

export const categorySchema = z.object({
  id: z.string(),
  name: z.string(),
  icon: z.string(),
  color: z.string(),
  words: z.array(z.string()),
  premium: z.boolean().optional(),
});

export const gameSettingsSchema = z.object({
  timerLength: z.enum(["30", "60", "90"]),
  selectedCategories: z.array(z.string()),
  soundEnabled: z.boolean(),
  numberOfRounds: z.enum(["3", "5", "10", "infinite"]).default("5"),
  difficulty: z.enum(["easy", "medium", "hard"]).optional(),
  gameMode: z.enum(["solo", "team"]).optional(),
});

export const gameStateSchema = z.object({
  status: z.enum(["welcome", "category-select", "team-setup", "playing", "paused", "ended", "round-end"]),
  score: z.number(),
  currentWord: z.string().nullable(),
  currentCategory: z.string().nullable(),
  timeRemaining: z.number(),
  wordsGuessed: z.array(z.string()),
  currentRound: z.number().default(1),
  totalRounds: z.number().optional(),
  gameMode: z.enum(["solo", "team"]).optional(),
  teams: z.array(z.object({
    name: z.string(),
    score: z.number(),
    color: z.string(),
  })).optional(),
  currentTeamIndex: z.number().optional(),
  activeCategories: z.array(z.string()),
});

export type Category = z.infer<typeof categorySchema>;
export type GameSettings = z.infer<typeof gameSettingsSchema>;
export type GameState = z.infer<typeof gameStateSchema>;
