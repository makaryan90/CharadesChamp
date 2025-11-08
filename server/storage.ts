// Storage interface for charades game
// Currently uses in-memory storage since the game doesn't require persistence

export interface IStorage {
  // Game-specific storage methods can be added here if needed
}

export class MemStorage implements IStorage {
  constructor() {
    // Initialize storage if needed
  }
}

export const storage = new MemStorage();
