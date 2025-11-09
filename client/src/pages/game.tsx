import { useState, useEffect } from "react";
import { WelcomeScreen } from "@/components/game/WelcomeScreen";
import { CategorySelect } from "@/components/game/CategorySelect";
import { GamePlay } from "@/components/game/GamePlay";
import { EndScreen } from "@/components/game/EndScreen";
import { SettingsModal } from "@/components/game/SettingsModal";
import { TeamSetup } from "@/components/game/TeamSetup";
import { useGameState } from "@/hooks/useGameState";
import { useGameSettings } from "@/hooks/useGameSettings";
import { useSoundEffects } from "@/hooks/useSoundEffects";
import { saveGame } from "@/hooks/useSaveGame";

export default function Game() {
  const [showSettings, setShowSettings] = useState(false);
  const [gameSaved, setGameSaved] = useState(false);
  const { settings, updateSettings } = useGameSettings();
  const { playSound } = useSoundEffects(settings.soundEnabled);
  const {
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
  } = useGameState(settings, (sound: string) => playSound(sound as any));

  useEffect(() => {
    if (gameState.status === "ended" && !gameSaved) {
      const timerDuration = parseInt(settings.timerLength);
      const actualDuration = timerDuration - gameState.timeRemaining;
      
      const teamsToSave = gameState.teams?.map((team, index) => ({
        ...team,
        orderIndex: index,
      }));

      saveGame({
        mode: gameState.gameMode || "solo",
        finalScore: gameState.score,
        duration: actualDuration,
        categories: settings.selectedCategories,
        wordsGuessed: gameState.wordsGuessed.length,
        difficulty: settings.difficulty,
        teams: teamsToSave,
      }).catch(console.error);

      setGameSaved(true);
    } else if (gameState.status !== "ended") {
      setGameSaved(false);
    }
  }, [gameState.status, gameState, settings, gameSaved]);

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

      {gameState.status === "team-setup" && (
        <TeamSetup
          onStart={(teams) => startWithTeams(teams)}
          onBack={resetGame}
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
          onExit={endGame}
          onNextTeam={() => {
            nextTeam();
            if (navigator.vibrate) {
              navigator.vibrate(50);
            }
          }}
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
          onExit={endGame}
          onNextTeam={() => {
            nextTeam();
            if (navigator.vibrate) {
              navigator.vibrate(50);
            }
          }}
          isPaused
        />
      )}

      {gameState.status === "ended" && (
        <EndScreen
          score={gameState.score}
          wordsGuessed={gameState.wordsGuessed}
          teams={gameState.teams}
          gameMode={gameState.gameMode}
          onPlayAgain={() => {
            resetGame();
            playSound("start");
          }}
          onChangeSettings={() => {
            resetGame();
            setShowSettings(true);
          }}
          onMainMenu={resetGame}
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
