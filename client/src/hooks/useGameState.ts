import { useState, useEffect, useRef } from "react";
import { type GameState, type GameSettings } from "@shared/schema";
import { categories } from "@/lib/categories";

export function useGameState(settings: GameSettings, playSound: (sound: string) => void) {
  const [gameState, setGameState] = useState<GameState>({
    status: "welcome",
    score: 0,
    currentWord: null,
    currentCategory: null,
    timeRemaining: parseInt(settings.timerLength),
    wordsGuessed: [],
    gameMode: settings.gameMode || "solo",
    teams: [],
    currentTeamIndex: 0,
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const usedWordsRef = useRef<Set<string>>(new Set());

  const getRandomWord = () => {
    const availableCategories = categories.filter((c) =>
      settings.selectedCategories.includes(c.id)
    );

    if (availableCategories.length === 0) return null;

    const randomCategory =
      availableCategories[Math.floor(Math.random() * availableCategories.length)];

    const availableWords = randomCategory.words.filter(
      (word) => !usedWordsRef.current.has(word)
    );

    if (availableWords.length === 0) {
      usedWordsRef.current.clear();
      return {
        word: randomCategory.words[Math.floor(Math.random() * randomCategory.words.length)],
        categoryId: randomCategory.id,
      };
    }

    const randomWord =
      availableWords[Math.floor(Math.random() * availableWords.length)];
    usedWordsRef.current.add(randomWord);

    return {
      word: randomWord,
      categoryId: randomCategory.id,
    };
  };

  const startTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      setGameState((prev) => {
        if (prev.timeRemaining <= 1) {
          playSound("timeout");
          if (timerRef.current) {
            clearInterval(timerRef.current);
          }
          return { ...prev, status: "ended", timeRemaining: 0 };
        }

        if (prev.timeRemaining === 10) {
          playSound("tick");
        }

        return { ...prev, timeRemaining: prev.timeRemaining - 1 };
      });
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const startGame = (teams?: Array<{ name: string; score: number; color: string }>) => {
    const gameMode = settings.gameMode || "solo";
    setGameState({
      status: gameMode === "team" ? "team-setup" : "category-select",
      score: 0,
      currentWord: null,
      currentCategory: null,
      timeRemaining: parseInt(settings.timerLength),
      wordsGuessed: [],
      gameMode,
      teams: teams || [],
      currentTeamIndex: 0,
    });
    usedWordsRef.current.clear();
  };

  const startWithTeams = (teams: Array<{ name: string; score: number; color: string }>) => {
    setGameState({
      status: "category-select",
      score: 0,
      currentWord: null,
      currentCategory: null,
      timeRemaining: parseInt(settings.timerLength),
      wordsGuessed: [],
      gameMode: "team",
      teams,
      currentTeamIndex: 0,
    });
    usedWordsRef.current.clear();
  };

  const nextWord = () => {
    const wordData = getRandomWord();
    if (!wordData) {
      setGameState((prev) => ({ ...prev, status: "welcome" }));
      return;
    }

    setGameState((prev) => ({
      ...prev,
      status: "playing",
      currentWord: wordData.word,
      currentCategory: wordData.categoryId,
    }));

    if (gameState.status === "category-select") {
      playSound("start");
      startTimer();
    }
  };

  const correctGuess = () => {
    const wordData = getRandomWord();
    if (!wordData) return;

    setGameState((prev) => {
      if (prev.gameMode === "team" && prev.teams && prev.teams.length > 0) {
        const updatedTeams = [...prev.teams];
        const currentIndex = prev.currentTeamIndex || 0;
        updatedTeams[currentIndex] = {
          ...updatedTeams[currentIndex],
          score: updatedTeams[currentIndex].score + 1,
        };
        
        return {
          ...prev,
          teams: updatedTeams,
          score: prev.score + 1,
          currentWord: wordData.word,
          currentCategory: wordData.categoryId,
          wordsGuessed: [...prev.wordsGuessed, prev.currentWord || ""],
        };
      }
      
      return {
        ...prev,
        score: prev.score + 1,
        currentWord: wordData.word,
        currentCategory: wordData.categoryId,
        wordsGuessed: [...prev.wordsGuessed, prev.currentWord || ""],
      };
    });
  };

  const nextTeam = () => {
    setGameState((prev) => {
      if (!prev.teams || prev.teams.length === 0) return prev;
      
      const nextIndex = ((prev.currentTeamIndex || 0) + 1) % prev.teams.length;
      return {
        ...prev,
        currentTeamIndex: nextIndex,
      };
    });
  };

  const pauseGame = () => {
    stopTimer();
    setGameState((prev) => ({ ...prev, status: "paused" }));
  };

  const resumeGame = () => {
    startTimer();
    setGameState((prev) => ({ ...prev, status: "playing" }));
  };

  const endGame = () => {
    stopTimer();
    setGameState((prev) => ({ ...prev, status: "ended" }));
  };

  const resetGame = () => {
    stopTimer();
    usedWordsRef.current.clear();
    setGameState({
      status: "welcome",
      score: 0,
      currentWord: null,
      currentCategory: null,
      timeRemaining: parseInt(settings.timerLength),
      wordsGuessed: [],
      gameMode: settings.gameMode || "solo",
      teams: [],
      currentTeamIndex: 0,
    });
  };

  useEffect(() => {
    return () => {
      stopTimer();
    };
  }, []);

  return {
    gameState,
    startGame,
    startWithTeams,
    nextWord,
    correctGuess,
    pauseGame,
    resumeGame,
    endGame,
    resetGame,
    nextTeam,
  };
}
