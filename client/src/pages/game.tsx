import { useState, useEffect } from "react";
import { WelcomeScreen } from "@/components/game/WelcomeScreen";
import { CategorySelect } from "@/components/game/CategorySelect";
import { GamePlay } from "@/components/game/GamePlay";
import { EndScreen } from "@/components/game/EndScreen";
import { SettingsModal } from "@/components/game/SettingsModal";
import { useGameState } from "@/hooks/useGameState";
import { useGameSettings } from "@/hooks/useGameSettings";
import { useSoundEffects } from "@/hooks/useSoundEffects";

export default function Game() {
  const [showSettings, setShowSettings] = useState(false);
  const { settings, updateSettings } = useGameSettings();
  const { playSound } = useSoundEffects(settings.soundEnabled);
  const {
    gameState,
    startGame,
    nextWord,
    correctGuess,
    pauseGame,
    resumeGame,
    endGame,
    resetGame,
  } = useGameState(settings, (sound: string) => playSound(sound as any));

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 overflow-hidden">
      {gameState.status === "welcome" && (
        <WelcomeScreen
          onStartGame={() => startGame()}
          onOpenSettings={() => setShowSettings(true)}
        />
      )}

      {gameState.status === "category-select" && (
        <CategorySelect
          selectedCategories={settings.selectedCategories}
          onCategoryToggle={(categoryId) => {
            const newCategories = settings.selectedCategories.includes(categoryId)
              ? settings.selectedCategories.filter((id) => id !== categoryId)
              : [...settings.selectedCategories, categoryId];
            updateSettings({ selectedCategories: newCategories });
          }}
          onStartPlaying={nextWord}
          onBack={resetGame}
        />
      )}

      {gameState.status === "playing" && (
        <GamePlay
          gameState={gameState}
          onCorrect={() => {
            correctGuess();
            playSound("correct");
          }}
          onSkip={() => {
            nextWord();
            playSound("skip");
          }}
          onPause={pauseGame}
        />
      )}

      {gameState.status === "paused" && (
        <GamePlay
          gameState={gameState}
          onCorrect={() => {
            correctGuess();
            playSound("correct");
          }}
          onSkip={() => {
            nextWord();
            playSound("skip");
          }}
          onPause={resumeGame}
          isPaused
        />
      )}

      {gameState.status === "ended" && (
        <EndScreen
          score={gameState.score}
          wordsGuessed={gameState.wordsGuessed}
          onPlayAgain={() => {
            resetGame();
            playSound("start");
          }}
          onChangeSettings={() => {
            resetGame();
            setShowSettings(true);
          }}
        />
      )}

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        settings={settings}
        onUpdateSettings={updateSettings}
      />
    </div>
  );
}
