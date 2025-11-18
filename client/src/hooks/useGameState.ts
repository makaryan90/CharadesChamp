import { useState, useEffect, useRef } from "react";
import { type GameState, type GameSettings } from "@shared/schema";
import { allCategories } from "@/lib/categories";

export function useGameState(settings: GameSettings, playSound: (sound: string) => void) {
  const latestSettingsRef = useRef<GameSettings>(settings);

  // Keep ref in sync with latest settings
  useEffect(() => {
    latestSettingsRef.current = settings;
  }, [settings]);

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
    const availableCategories = allCategories.filter((c) =>
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

  // Helper function to determine if we should show round-end screen
  const shouldShowRoundEnd = (state: GameState): boolean => {
    if (state.gameMode === "solo") {
      const hasMoreRounds = !state.totalRounds || state.currentRound < state.totalRounds;
      return hasMoreRounds;
    }

    if (state.gameMode === "team" && state.teams && state.teams.length > 1) {
      const currentIndex = state.currentTeamIndex || 0;
      const isLastTeam = currentIndex === state.teams.length - 1;
      const hasMoreRounds = !state.totalRounds || state.currentRound < state.totalRounds;
      return !isLastTeam || hasMoreRounds;
    }

    return false;
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const startTimer = () => {
    // Always clear any existing timer first
    stopTimer();

    timerRef.current = setInterval(() => {
      setGameState((prev) => {
        if (prev.timeRemaining <= 1) {
          playSound("timeout");
          stopTimer();

          // Use helper function to determine if round-end or game-end
          if (shouldShowRoundEnd(prev)) {
            return { ...prev, status: "round-end", timeRemaining: 0 };
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

  const startGame = (teams?: Array<{ name: string; score: number; color: string }>, overrideSettings?: GameSettings) => {
    // Use override settings directly when provided (already merged by caller), otherwise use latest ref
    const effectiveSettings = overrideSettings ?? latestSettingsRef.current;
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

  const startWithTeams = (teams: Array<{ name: string; score: number; color: string }>, overrideSettings?: GameSettings) => {
    // Use override settings directly when provided (already merged by caller), otherwise use latest ref
    const effectiveSettings = overrideSettings ?? latestSettingsRef.current;
    const totalRounds = effectiveSettings.numberOfRounds === "infinite" 
      ? undefined 
      : parseInt(effectiveSettings.numberOfRounds || "5");

    setGameState({
      status: "category-select",
      score: 0,
      currentWord: null,
      currentCategory: null,
      timeRemaining: parseInt(effectiveSettings.timerLength),
      wordsGuessed: [],
      currentRound: 1,
      totalRounds,
      gameMode: "team",
      teams,
      currentTeamIndex: 0,
      activeCategories: effectiveSettings.selectedCategories,
    });
    usedWordsRef.current.clear();
  };

  // FIX: Pass isInitialWord to control timer start, avoid stale gameState closure
  const nextWord = (overrideCategories?: string[], isInitialWord?: boolean) => {
    const wordData = getRandomWord(overrideCategories);
    if (!wordData) {
      setGameState((prev) => ({ ...prev, status: "welcome" }));
      return;
    }

    // Determine if we should start the timer based on the parameter
    const shouldStartTimer = isInitialWord === true;

    setGameState((prev) => ({
      ...prev,
      status: "playing",
      currentWord: wordData.word,
      currentCategory: wordData.categoryId,
      activeCategories: overrideCategories || prev.activeCategories,
    }));

    if (shouldStartTimer) {
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

  // FIX: Clear used words and use latestSettingsRef for timer length
  const continueNextRound = () => {
    // Clear used words for the new round
    usedWordsRef.current.clear();

    setGameState((prev) => {
      if (prev.gameMode === "team" && prev.teams && prev.teams.length > 1) {
        const currentIndex = prev.currentTeamIndex || 0;
        const nextIndex = (currentIndex + 1) % prev.teams.length;
        const isMovingToNextRound = nextIndex === 0;

        return {
          ...prev,
          status: "playing",
          timeRemaining: parseInt(latestSettingsRef.current.timerLength),
          currentTeamIndex: nextIndex,
          currentRound: isMovingToNextRound ? prev.currentRound + 1 : prev.currentRound,
        };
      } else {
        // Solo mode - just increment round
        return {
          ...prev,
          status: "playing",
          timeRemaining: parseInt(latestSettingsRef.current.timerLength),
          currentRound: prev.currentRound + 1,
        };
      }
    });

    playSound("start");
    startTimer();
  };

  const nextTeam = () => {
    stopTimer();
    setGameState((prev) => ({ ...prev, status: "round-end", timeRemaining: 0 }));
  };

  const pauseGame = () => {
    stopTimer();
    setGameState((prev) => ({ ...prev, status: "paused" }));
  };

  const resumeGame = () => {
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

  const addTime = (seconds: number) => {
    setGameState((prev) => ({
      ...prev,
      timeRemaining: prev.timeRemaining + seconds,
    }));
  };

  // FIX: Effect to handle timer state changes (pause/resume)
  useEffect(() => {
    if (gameState.status === "playing") {
      startTimer();
    } else {
      stopTimer();
    }

    return () => {
      stopTimer();
    };
  }, [gameState.status]);

  // Cleanup on unmount
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
    addTime,
  };
}