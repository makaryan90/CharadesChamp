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

  const startGame = () => {
    setGameState({
      status: "category-select",
      score: 0,
      currentWord: null,
      currentCategory: null,
      timeRemaining: parseInt(settings.timerLength),
      wordsGuessed: [],
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

    setGameState((prev) => ({
      ...prev,
      score: prev.score + 1,
      currentWord: wordData.word,
      currentCategory: wordData.categoryId,
      wordsGuessed: [...prev.wordsGuessed, prev.currentWord || ""],
    }));
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
    nextWord,
    correctGuess,
    pauseGame,
    resumeGame,
    endGame,
    resetGame,
  };
}
