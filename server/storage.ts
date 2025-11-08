import { db } from "./db";
import { games, teams, customCategories, type InsertGame, type InsertTeam, type InsertCustomCategory, type Game, type Team, type CustomCategory } from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  createGame(game: InsertGame): Promise<Game>;
  getGameHistory(limit?: number): Promise<Game[]>;
  createTeams(teamData: InsertTeam[]): Promise<Team[]>;
  getTeamsByGameId(gameId: number): Promise<Team[]>;
  createCustomCategory(category: InsertCustomCategory): Promise<CustomCategory>;
  getCustomCategories(deviceId?: string): Promise<CustomCategory[]>;
  deleteCustomCategory(id: number): Promise<void>;
  updateCustomCategory(id: number, category: Partial<InsertCustomCategory>): Promise<CustomCategory | undefined>;
}

export class DbStorage implements IStorage {
  async createGame(game: InsertGame): Promise<Game> {
    const [newGame] = await db.insert(games).values(game).returning();
    return newGame;
  }

  async getGameHistory(limit: number = 50): Promise<Game[]> {
    return await db.select().from(games).orderBy(desc(games.createdAt)).limit(limit);
  }

  async createTeams(teamData: InsertTeam[]): Promise<Team[]> {
    return await db.insert(teams).values(teamData).returning();
  }

  async getTeamsByGameId(gameId: number): Promise<Team[]> {
    return await db.select().from(teams).where(eq(teams.gameId, gameId));
  }

  async createCustomCategory(category: InsertCustomCategory): Promise<CustomCategory> {
    const [newCategory] = await db.insert(customCategories).values(category).returning();
    return newCategory;
  }

  async getCustomCategories(deviceId?: string): Promise<CustomCategory[]> {
    if (deviceId) {
      return await db.select().from(customCategories).where(eq(customCategories.deviceId, deviceId)).orderBy(desc(customCategories.createdAt));
    }
    return await db.select().from(customCategories).orderBy(desc(customCategories.createdAt));
  }

  async deleteCustomCategory(id: number): Promise<void> {
    await db.delete(customCategories).where(eq(customCategories.id, id));
  }

  async updateCustomCategory(id: number, category: Partial<InsertCustomCategory>): Promise<CustomCategory | undefined> {
    const [updated] = await db.update(customCategories).set(category).where(eq(customCategories.id, id)).returning();
    return updated;
  }
}

export const storage = new DbStorage();
