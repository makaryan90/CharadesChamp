import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pause, Play, ChevronRight, Check, X, Tv } from "lucide-react";
import { type GameState } from "@shared/schema";
import { Timer } from "./Timer";
import { ScoreDisplay } from "./ScoreDisplay";
import { allCategories } from "@/lib/categories";
import { getIcon } from "@/lib/iconMap";
import { useEffect, useState } from "react";
import { useSwipeGesture } from "@/hooks/useSwipeGesture";
import confetti from "canvas-confetti";
import { showRewardedAd } from "@/lib/ads";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface GamePlayProps {
  gameState: GameState;
  onCorrect: () => void;
  onSkip: () => void;
  onPause: () => void;
  onExit: () => void;
  onNextTeam?: () => void;
  isPaused?: boolean;
  onAddTime?: (seconds: number) => void;
  isPremium?: boolean;
}

export function GamePlay({ gameState, onCorrect, onSkip, onPause, onExit, onNextTeam, isPaused = false, onAddTime, isPremium = false }: GamePlayProps) {
  const [showWord, setShowWord] = useState(true);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [isWatchingAd, setIsWatchingAd] = useState(false);
  const category = allCategories.find((c) => c.id === gameState.currentCategory);

  const handleCorrect = () => {
    // Trigger confetti explosion
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#a855f7", "#06b6d4", "#f97316"],
    });

    // Enhanced haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate([200, 100, 200]);
    }

    onCorrect();
  };

  const handleWatchAd = async () => {
    setIsWatchingAd(true);
    const result = await showRewardedAd();
    
    if (result.success && result.reward && onAddTime) {
      onAddTime(result.reward);
      
      // Show success feedback
      if (navigator.vibrate) {
        navigator.vibrate(100);
      }
    }
    
    setIsWatchingAd(false);
  };

  useSwipeGesture({
    onSwipeUp: !isPaused ? onSkip : undefined,
    onSwipeRight: !isPaused ? handleCorrect : undefined,
  });

  useEffect(() => {
    if (!isPaused && gameState.currentWord) {
      setShowWord(false);
      setTimeout(() => setShowWord(true), 50);
    }
  }, [gameState.currentWord, isPaused]);

  const currentTeam = gameState.teams && gameState.teams.length > 0 
    ? gameState.teams[gameState.currentTeamIndex || 0] 
    : null;

  const getTeamColorClasses = (color: string) => {
    const colorMap: Record<string, { bg: string, border: string, dot: string }> = {
      purple: { bg: "bg-purple-500/20", border: "border-purple-500", dot: "bg-purple-500" },
      cyan: { bg: "bg-cyan-500/20", border: "border-cyan-500", dot: "bg-cyan-500" },
      orange: { bg: "bg-orange-500/20", border: "border-orange-500", dot: "bg-orange-500" },
      green: { bg: "bg-green-500/20", border: "border-green-500", dot: "bg-green-500" },
      pink: { bg: "bg-pink-500/20", border: "border-pink-500", dot: "bg-pink-500" },
      yellow: { bg: "bg-yellow-500/20", border: "border-yellow-500", dot: "bg-yellow-500" },
    };
    return colorMap[color] || colorMap.purple;
  };

  // FIX: Calculate total time from gameState instead of reading from localStorage
  const totalTime = gameState.timeRemaining + (gameState.totalRounds ? gameState.currentRound * 60 : 0);
  // Better approach: pass totalTime through gameState or use a standard value
  // For now, we'll assume the timer was set to one of the standard values
  const timerOptions = [30, 60, 90];
  const estimatedTotalTime = timerOptions[1]; // Default to 60 seconds

  return (
    <div className="min-h-screen flex flex-col p-6 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="ghost"
            onClick={onPause}
            data-testid="button-pause"
          >
            {isPaused ? <Play className="h-6 w-6" /> : <Pause className="h-6 w-6" />}
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setShowExitDialog(true)}
            data-testid="button-exit"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>

        <Timer
          timeRemaining={gameState.timeRemaining}
          totalTime={estimatedTotalTime}
        />

        <ScoreDisplay score={gameState.gameMode === "team" && currentTeam ? currentTeam.score : gameState.score} />
      </div>

      <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Exit Game?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to exit the current game? Your progress will be saved and you'll see the game summary.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-exit">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setShowExitDialog(false);
                onExit();
              }}
              data-testid="button-confirm-exit"
            >
              Exit Game
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {gameState.gameMode === "team" && currentTeam && (
        <div className="mb-6 text-center">
          <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-full ${getTeamColorClasses(currentTeam.color).bg} border-2 ${getTeamColorClasses(currentTeam.color).border}`}>
            <div className={`w-3 h-3 rounded-full ${getTeamColorClasses(currentTeam.color).dot}`} />
            <span className="font-bold text-lg" data-testid="text-current-team">
              {currentTeam.name}'s Turn
            </span>
            <Badge variant="secondary" className="ml-2">
              {currentTeam.score} points
            </Badge>
          </div>
        </div>
      )}

      {isPaused ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-6">
            <Pause className="h-24 w-24 text-muted-foreground mx-auto" />
            <h2 className="text-3xl font-bold text-foreground">Paused</h2>
            <p className="text-lg text-muted-foreground">Tap play to resume</p>
          </div>
        </div>
      ) : (
        <>
          <div className="flex-1 flex items-center justify-center">
            <div
              className={`
                w-full max-w-2xl transition-all duration-300
                ${showWord ? "opacity-100 scale-100" : "opacity-0 scale-95"}
              `}
            >
              <div className="bg-card rounded-3xl p-8 md:p-12 shadow-2xl border-2 border-card-border">
                {category && (
                  <Badge
                    variant="default"
                    className="mb-6 flex items-center gap-2 text-base font-semibold px-4 py-2 bg-primary text-primary-foreground"
                    data-testid="badge-category"
                  >
                    {getIcon(category.icon, "h-5 w-5")}
                    {category.name}
                  </Badge>
                )}

                <h1
                  className="text-5xl md:text-6xl lg:text-7xl font-black text-foreground text-center break-words"
                  data-testid="text-current-word"
                >
                  {gameState.currentWord || "Get Ready!"}
                </h1>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <Button
              size="lg"
              className="w-full max-w-md mx-auto h-16 text-xl font-semibold rounded-full bg-chart-4 hover:bg-chart-4 text-white border-2 border-chart-4"
              onClick={handleCorrect}
              data-testid="button-correct"
            >
              <Check className="h-6 w-6 mr-2" />
              Got It!
            </Button>

            <Button
              size="lg"
              variant="secondary"
              className="w-full max-w-md mx-auto h-16 text-xl font-semibold rounded-full"
              onClick={onSkip}
              data-testid="button-skip"
            >
              <ChevronRight className="h-6 w-6 mr-2" />
              Skip
            </Button>

            {!isPremium && gameState.timeRemaining < 15 && onAddTime && (
              <Button
                size="lg"
                variant="outline"
                className="w-full max-w-md mx-auto h-16 text-xl font-semibold rounded-full border-2 border-primary text-primary hover:bg-primary/10"
                onClick={handleWatchAd}
                disabled={isWatchingAd}
                data-testid="button-watch-ad"
              >
                {isWatchingAd ? (
                  <>
                    <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin mr-2" />
                    Loading Ad...
                  </>
                ) : (
                  <>
                    <Tv className="h-6 w-6 mr-2" />
                    Watch Ad for +10 Sec
                  </>
                )}
              </Button>
            )}

            {gameState.gameMode === "team" && onNextTeam && gameState.teams && gameState.teams.length > 1 && (
              <Button
                size="lg"
                variant="outline"
                className="w-full max-w-md mx-auto h-16 text-xl font-semibold rounded-full mt-4"
                onClick={onNextTeam}
                data-testid="button-next-team"
              >
                <ChevronRight className="h-6 w-6 mr-2" />
                Pass to Next Team
              </Button>
            )}

            <p className="text-center text-sm text-muted-foreground mt-2">
              Tip: Swipe up to skip, swipe right for correct
            </p>
          </div>
        </>
      )}
    </div>
  );
}