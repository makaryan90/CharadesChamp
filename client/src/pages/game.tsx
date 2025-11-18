import { useState, useEffect } from "react";
import { MainMenu } from "@/components/game/MainMenu";
import { QuickStart } from "@/components/game/QuickStart";
import { HowToPlay } from "@/components/game/HowToPlay";
import { SubscriptionModal } from "@/components/game/SubscriptionModal";
import { WelcomeScreen } from "@/components/game/WelcomeScreen";
import { CategorySelect } from "@/components/game/CategorySelect";
import { GamePlay } from "@/components/game/GamePlay";
import { EndScreen } from "@/components/game/EndScreen";
import { RoundEnd } from "@/components/game/RoundEnd";
import { SettingsModal } from "@/components/game/SettingsModal";
import { TeamSetup } from "@/components/game/TeamSetup";
import { useGameState } from "@/hooks/useGameState";
import { useGameSettings } from "@/hooks/useGameSettings";
import { useSoundEffects } from "@/hooks/useSoundEffects";
import { saveGame } from "@/hooks/useSaveGame";
import type { GameSettings } from "@shared/schema";

type NavigationScreen = "main-menu" | "quick-start" | "how-to-play" | "subscribe";

export default function Game() {
  const [navigationScreen, setNavigationScreen] = useState<NavigationScreen | null>("main-menu");
  const [showSettings, setShowSettings] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [gameSaved, setGameSaved] = useState(false);
  const [isPremium, setIsPremium] = useState(() => {
    return localStorage.getItem("charades-premium") === "true";
  });
  const [pendingGameStart, setPendingGameStart] = useState(false);
  
  const { settings, updateSettings, applySettings } = useGameSettings();
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
    continueNextRound,
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

  const handleQuickStartGame = (selectedCategories: string[], timerLength: string, numberOfRounds: string) => {
    const newSettings = { 
      selectedCategories, 
      timerLength: timerLength as "30" | "60" | "90",
      numberOfRounds: numberOfRounds as "3" | "5" | "10" | "infinite",
      gameMode: "solo" as const,
      soundEnabled: settings.soundEnabled,
    };
    
    // Update state (useGameSettings will handle localStorage via useEffect)
    updateSettings(newSettings);
    setNavigationScreen(null);
    
    // Pass settings directly to startGame to avoid waiting for state update
    startGame(undefined, newSettings);
    nextWord(newSettings.selectedCategories);
  };

  const handleBackToMainMenu = () => {
    setNavigationScreen("main-menu");
    resetGame();
  };

  const handleUnlockPremium = () => {
    setIsPremium(true);
    localStorage.setItem("charades-premium", "true");
    setShowSubscriptionModal(false);
    if (navigationScreen === "subscribe") {
      setNavigationScreen("main-menu");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 overflow-hidden">
      {navigationScreen === "main-menu" && (
        <MainMenu
          onQuickStart={() => setNavigationScreen("quick-start")}
          onCreateTeams={() => {
            setNavigationScreen(null);
            const teamSettings: GameSettings = {
              ...settings,
              gameMode: "team",
            };
            updateSettings(teamSettings);
            startGame(undefined, teamSettings);
          }}
          onHowToPlay={() => setNavigationScreen("how-to-play")}
          onSettings={() => setShowSettings(true)}
          onSubscribe={() => setNavigationScreen("subscribe")}
          isPremium={isPremium}
        />
      )}

      {navigationScreen === "quick-start" && (
        <QuickStart
          onBack={() => setNavigationScreen("main-menu")}
          onStartGame={handleQuickStartGame}
          onOpenSubscription={() => setShowSubscriptionModal(true)}
          isPremium={isPremium}
        />
      )}

      {navigationScreen === "how-to-play" && (
        <HowToPlay onBack={() => setNavigationScreen("main-menu")} />
      )}

      {navigationScreen === "subscribe" && (
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="text-center space-y-4 max-w-md">
            <h2 className="text-3xl font-bold">Premium Features</h2>
            <p className="text-muted-foreground">Unlock all categories and features!</p>
            <button
              className="px-6 py-3 bg-primary text-primary-foreground rounded-full font-bold"
              onClick={() => {
                setIsPremium(true);
                localStorage.setItem("charades-premium", "true");
                setNavigationScreen("main-menu");
              }}
              data-testid="button-unlock-premium"
            >
              Unlock Premium (Simulated)
            </button>
            <button
              className="block mx-auto text-sm text-muted-foreground hover:underline"
              onClick={() => setNavigationScreen("main-menu")}
              data-testid="button-maybe-later"
            >
              Maybe Later
            </button>
          </div>
        </div>
      )}

      {gameState.status === "welcome" && !navigationScreen && (
        <WelcomeScreen
          onStartGame={() => startGame()}
          onOpenSettings={() => setShowSettings(true)}
        />
      )}

      {gameState.status === "team-setup" && (
        <TeamSetup
          onStart={(teams, numberOfRounds) => {
            const nextSettings: GameSettings = {
              ...settings,
              numberOfRounds: numberOfRounds as "3" | "5" | "10" | "infinite",
            };
            updateSettings(nextSettings);
            startWithTeams(teams, nextSettings);
          }}
          onBack={handleBackToMainMenu}
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
          onStartPlaying={() => nextWord(settings.selectedCategories)}
          onBack={handleBackToMainMenu}
          onOpenSubscription={() => setShowSubscriptionModal(true)}
          isPremium={isPremium}
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

      {gameState.status === "round-end" && (
        <RoundEnd
          gameState={gameState}
          onContinue={() => {
            continueNextRound();
            nextWord();
          }}
          onEndGame={endGame}
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
          onMainMenu={handleBackToMainMenu}
        />
      )}

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        settings={settings}
        onUpdateSettings={updateSettings}
      />

      <SubscriptionModal
        isOpen={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
        onUnlock={handleUnlockPremium}
        onRegister={() => {
          alert("Registration page coming soon! For now, click 'Unlock Now' to simulate premium unlock.");
        }}
      />
    </div>
  );
}
