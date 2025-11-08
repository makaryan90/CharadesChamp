import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pause, Play, ChevronRight, Check } from "lucide-react";
import { type GameState } from "@shared/schema";
import { Timer } from "./Timer";
import { ScoreDisplay } from "./ScoreDisplay";
import { categories } from "@/lib/categories";
import { getIcon } from "@/lib/iconMap";
import { useEffect, useState } from "react";
import { useSwipeGesture } from "@/hooks/useSwipeGesture";

interface GamePlayProps {
  gameState: GameState;
  onCorrect: () => void;
  onSkip: () => void;
  onPause: () => void;
  isPaused?: boolean;
}

export function GamePlay({ gameState, onCorrect, onSkip, onPause, isPaused = false }: GamePlayProps) {
  const [showWord, setShowWord] = useState(true);
  const category = categories.find((c) => c.id === gameState.currentCategory);

  useSwipeGesture({
    onSwipeUp: !isPaused ? onSkip : undefined,
    onSwipeRight: !isPaused ? onCorrect : undefined,
  });

  useEffect(() => {
    if (!isPaused && gameState.currentWord) {
      setShowWord(false);
      setTimeout(() => setShowWord(true), 50);
    }
  }, [gameState.currentWord, isPaused]);

  return (
    <div className="min-h-screen flex flex-col p-6 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <Button
          size="icon"
          variant="ghost"
          onClick={onPause}
          data-testid="button-pause"
        >
          {isPaused ? <Play className="h-6 w-6" /> : <Pause className="h-6 w-6" />}
        </Button>

        <Timer
          timeRemaining={gameState.timeRemaining}
          totalTime={parseInt(localStorage.getItem("timerLength") || "60")}
        />

        <ScoreDisplay score={gameState.score} />
      </div>

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
                    variant="secondary"
                    className={`mb-6 ${category.color} flex items-center gap-2`}
                    data-testid="badge-category"
                  >
                    {getIcon(category.icon, "h-4 w-4")}
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
              onClick={onCorrect}
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

            <p className="text-center text-sm text-muted-foreground mt-2">
              Tip: Swipe up to skip, swipe right for correct
            </p>
          </div>
        </>
      )}
    </div>
  );
}
