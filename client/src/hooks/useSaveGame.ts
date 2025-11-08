import { apiRequest, queryClient } from "@/lib/queryClient";
import { type InsertGame, type InsertTeam } from "@shared/schema";

export async function saveGame(gameData: {
  mode: string;
  finalScore: number;
  duration: number;
  categories: string[];
  wordsGuessed: number;
  difficulty?: string;
  teams?: Array<{ name: string; score: number; color: string; orderIndex: number }>;
}) {
  try {
    const gamePayload: InsertGame = {
      mode: gameData.mode,
      finalScore: gameData.finalScore,
      duration: gameData.duration,
      categories: gameData.categories,
      wordsGuessed: gameData.wordsGuessed,
      difficulty: gameData.difficulty,
      teamCount: gameData.teams?.length,
    };

    const response = await apiRequest("POST", "/api/games", {
      ...gamePayload,
      teams: gameData.teams,
    });

    queryClient.invalidateQueries({ queryKey: ["/api/games/history"] });
    
    return response;
  } catch (error) {
    console.error("Failed to save game:", error);
    throw error;
  }
}
