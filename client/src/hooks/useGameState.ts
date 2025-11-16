import { useState, useEffect, useRef } from "react";
import { type GameState, type GameSettings } from "@shared/schema";
import { categories } from "@/lib/categories";

export function useGameState(settings: GameSettings, playSound: (sound: string) => void) {
  const totalRounds = settings.numberOfRounds === "infinite" ? undefined : parseInt(settings.numberOfRounds);
  
  const [gameState, setGameState] = useState<GameState>({
    status: "welcome",
    score: 0,
    currentWord: null,
    currentCategory: null,
    timeRemaining: parseInt(settings.timerLength),
    wordsGuessed: [],
    currentRound: 1,
    totalRounds,
    gameMode: settings.gameMode || "solo",
    teams: [],
    currentTeamIndex: 0,
    activeCategories: settings.selectedCategories,
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const usedWordsRef = useRef<Set<string>>(new Set());

  const getRandomWord = (overrideCategories?: string[]) => {
    const selectedCategories = overrideCategories || gameState.activeCategories;
    const availableCategories = categories.filter((c) =>
      selectedCategories.includes(c.id)
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
          
          // Check if this is the end of a round in team mode
          if (prev.gameMode === "team" && prev.teams && prev.teams.length > 1) {
            // Check if all teams have completed this round
            const currentIndex = prev.currentTeamIndex || 0;
            const isLastTeam = currentIndex === prev.teams.length - 1;
            const hasMoreRounds = !prev.totalRounds || prev.currentRound < prev.totalRounds;
            
            if (!isLastTeam || hasMoreRounds) {
              return { ...prev, status: "round-end", timeRemaining: 0 };
            }
          } else if (prev.gameMode === "solo") {
            // For solo mode, check if there are more rounds
            const hasMoreRounds = !prev.totalRounds || prev.currentRound < prev.totalRounds;
            if (hasMoreRounds) {
              return { ...prev, status: "round-end", timeRemaining: 0 };
            }
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

  const startGame = (teams?: Array<{ name: string; score: number; color: string }>, overrideSettings?: Partial<GameSettings>) => {
    const effectiveSettings = overrideSettings ? { ...settings, ...overrideSettings } : settings;
    const gameMode = effectiveSettings.gameMode || "solo";
    const totalRounds = effectiveSettings.numberOfRounds === "infinite" 
      ? undefined 
      : parseInt(effectiveSettings.numberOfRounds || "5");
    
    setGameState({
      status: gameMode === "team" ? "team-setup" : "category-select",
      score: 0,
      currentWord: null,
      currentCategory: null,
      timeRemaining: parseInt(effectiveSettings.timerLength),
      wordsGuessed: [],
      currentRound: 1,
      totalRounds,
      gameMode,
      teams: teams || [],
      currentTeamIndex: 0,
      activeCategories: effectiveSettings.selectedCategories,
    });
    usedWordsRef.current.clear();
  };

  const startWithTeams = (teams: Array<{ name: string; score: number; color: string }>) => {
    const totalRounds = settings.numberOfRounds === "infinite" 
      ? undefined 
      : parseInt(settings.numberOfRounds || "5");
    
    setGameState({
      status: "category-select",
      score: 0,
      currentWord: null,
      currentCategory: null,
      timeRemaining: parseInt(settings.timerLength),
      wordsGuessed: [],
      currentRound: 1,
      totalRounds,
      gameMode: "team",
      teams,
      currentTeamIndex: 0,
      activeCategories: settings.selectedCategories,
    });
    usedWordsRef.current.clear();
  };

  const nextWord = (overrideCategories?: string[]) => {
    const wordData = getRandomWord(overrideCategories);
    if (!wordData) {
      setGameState((prev) => ({ ...prev, status: "welcome" }));
      return;
    }

    setGameState((prev) => ({
      ...prev,
      status: "playing",
      currentWord: wordData.word,
      currentCategory: wordData.categoryId,
      // If override categories provided, update activeCategories
      activeCategories: overrideCategories || prev.activeCategories,
    }));

    if (gameState.status === "category-select" || gameState.status === "welcome") {
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

  const continueNextRound = () => {
    setGameState((prev) => {
      if (prev.gameMode === "team" && prev.teams && prev.teams.length > 1) {
        const currentIndex = prev.currentTeamIndex || 0;
        const nextIndex = (currentIndex + 1) % prev.teams.length;
        const isMovingToNextRound = nextIndex === 0;
        
        return {
          ...prev,
          status: "playing",
          timeRemaining: parseInt(settings.timerLength),
          currentTeamIndex: nextIndex,
          currentRound: isMovingToNextRound ? prev.currentRound + 1 : prev.currentRound,
        };
      } else {
        // Solo mode - just increment round
        return {
          ...prev,
          status: "playing",
          timeRemaining: parseInt(settings.timerLength),
          currentRound: prev.currentRound + 1,
        };
      }
    });
    
    playSound("start");
    startTimer();
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
    const totalRounds = settings.numberOfRounds === "infinite" ? undefined : parseInt(settings.numberOfRounds);
    
    setGameState({
      status: "welcome",
      score: 0,
      currentWord: null,
      currentCategory: null,
      timeRemaining: parseInt(settings.timerLength),
      wordsGuessed: [],
      currentRound: 1,
      totalRounds,
      gameMode: settings.gameMode || "solo",
      teams: [],
      currentTeamIndex: 0,
      activeCategories: settings.selectedCategories,
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
    continueNextRound,
  };
}
