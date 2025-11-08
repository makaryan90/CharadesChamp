import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertGameSchema, insertCustomCategorySchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/games", async (req, res) => {
    try {
      const gameData = insertGameSchema.parse(req.body);
      const game = await storage.createGame(gameData);
      
      if (req.body.teams && Array.isArray(req.body.teams)) {
        const teamsData = req.body.teams.map((team: any, index: number) => ({
          gameId: game.id,
          name: team.name,
          score: team.score,
          color: team.color,
          orderIndex: index,
        }));
        await storage.createTeams(teamsData);
      }
      
      res.json(game);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/games/history", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const games = await storage.getGameHistory(limit);
      res.json(games);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/games/:id/teams", async (req, res) => {
    try {
      const gameId = parseInt(req.params.id);
      const teams = await storage.getTeamsByGameId(gameId);
      res.json(teams);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/categories/custom", async (req, res) => {
    try {
      const deviceId = req.query.deviceId as string | undefined;
      const categories = await storage.getCustomCategories(deviceId);
      res.json(categories);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/categories/custom", async (req, res) => {
    try {
      const categoryData = insertCustomCategorySchema.parse(req.body);
      const category = await storage.createCustomCategory(categoryData);
      res.json(category);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/categories/custom/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteCustomCategory(id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/categories/custom/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const category = await storage.updateCustomCategory(id, updates);
      res.json(category);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
