import { useState, useEffect } from "react";
import { MainMenu } from "@/components/game/MainMenu";
import { QuickStart } from "@/components/game/QuickStart";
import { HowToPlay } from "@/components/game/HowToPlay";
import { PaywallModal } from "@/components/game/PaywallModal";
import { DeckShop } from "@/components/game/DeckShop";
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
import { usePremium } from "@/lib/premium";
import { saveGame } from "@/hooks/useSaveGame";
import { showInterstitial } from "@/lib/ads";
import type { GameSettings } from "@shared/schema";

type NavigationScreen = "main-menu" | "quick-start" | "how-to-play" | "deck-shop";

export default function Game() {
  const [navigationScreen, setNavigationScreen] = useState<NavigationScreen | null>("main-menu");
  const [showSettings, setShowSettings] = useState(false);
  const [showPaywallModal, setShowPaywallModal] = useState(false);
  const [gameSaved, setGameSaved] = useState(false);
  const { isPremium, unlockPremium } = usePremium();
  const [previousTeams, setPreviousTeams] = useState<Array<{ name: string; score: number; color: string }>>([]);

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
    addTime,
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
    // FIX: Pass isInitialWord flag to trigger timer start
    startGame(undefined, newSettings);
    nextWord(newSettings.selectedCategories, true);
  };

  const handleBackToMainMenu = () => {
    setNavigationScreen("main-menu");
    resetGame();
  };

  const handleUnlockPremium = () => {
    unlockPremium();
    setShowPaywallModal(false);
  };

  const handleAddTime = (seconds: number) => {
    addTime(seconds);
  };

  const handleBackToMainMenuWithAd = async () => {
    // Show interstitial ad if not premium
    if (!isPremium) {
      await showInterstitial();
    }
    handleBackToMainMenu();
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
          onSubscribe={() => setShowPaywallModal(true)}
          onDeckShop={() => setNavigationScreen("deck-shop")}
          isPremium={isPremium}
        />
      )}

      {navigationScreen === "quick-start" && (
        <QuickStart
          onBack={() => setNavigationScreen("main-menu")}
          onStartGame={handleQuickStartGame}
          onOpenSubscription={() => setShowPaywallModal(true)}
          isPremium={isPremium}
        />
      )}

      {navigationScreen === "how-to-play" && (
        <HowToPlay onBack={() => setNavigationScreen("main-menu")} />
      )}

      {navigationScreen === "deck-shop" && (
        <DeckShop
          onBack={() => setNavigationScreen("main-menu")}
          onOpenPaywall={() => setShowPaywallModal(true)}
          isPremium={isPremium}
        />
      )}

      {gameState.status === "welcome" && !navigationScreen && (
        <WelcomeScreen
          onStartGame={() => startGame()}
          onOpenSettings={() => setShowSettings(true)}
        />
      )}

      {gameState.status === "team-setup" && (
        <TeamSetup
          initialTeams={previousTeams.length > 0 ? previousTeams : undefined}
          onStart={(teams, numberOfRounds) => {
            setPreviousTeams([]);
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
          // FIX: Pass isInitialWord flag to trigger timer start for category selection
          onStartPlaying={() => nextWord(settings.selectedCategories, true)}
          onBack={handleBackToMainMenu}
          onOpenSubscription={() => setShowPaywallModal(true)}
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
            nextWord(settings.selectedCategories);
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
          isPaused={false}
          isPremium={isPremium}
          onAddTime={handleAddTime}
        />
      )}

      {gameState.status === "round-end" && (
        <RoundEnd
          gameState={gameState}
          onContinue={() => {
            continueNextRound();
            // FIX: Pass categories to avoid missing words from wrong categories
            nextWord(settings.selectedCategories, false);
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
            nextWord(settings.selectedCategories);
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
          isPaused={true}
          isPremium={isPremium}
          onAddTime={handleAddTime}
        />
      )}

      {gameState.status === "ended" && (
        <EndScreen
          score={gameState.score}
          wordsGuessed={gameState.wordsGuessed}
          teams={gameState.teams}
          gameMode={gameState.gameMode}
          onPlayAgain={() => {
            if (gameState.gameMode === "team" && gameState.teams) {
              setPreviousTeams(gameState.teams);
              const teamSettings: GameSettings = { ...settings, gameMode: "team" };
              updateSettings(teamSettings);
              // FIX: Pass teams to startGame so it doesn't go back to team-setup
              startGame(gameState.teams, teamSettings);
            } else {
              resetGame();
            }
            playSound("start");
          }}
          onChangeSettings={() => {
            resetGame();
            setShowSettings(true);
          }}
          onMainMenu={handleBackToMainMenuWithAd}
        />
      )}

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        settings={settings}
        onUpdateSettings={updateSettings}
      />

      <PaywallModal
        isOpen={showPaywallModal}
        onClose={() => setShowPaywallModal(false)}
        onUnlock={handleUnlockPremium}
      />
    </div>
  );
}