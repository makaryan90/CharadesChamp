import { Button } from "@/components/ui/button";
import { Trophy, RotateCcw, Settings } from "lucide-react";
import Confetti from "react-confetti";
import { useWindowSize } from "@/hooks/useWindowSize";

interface EndScreenProps {
  score: number;
  wordsGuessed: string[];
  onPlayAgain: () => void;
  onChangeSettings: () => void;
}

export function EndScreen({ score, wordsGuessed, onPlayAgain, onChangeSettings }: EndScreenProps) {
  const { width, height } = useWindowSize();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 relative">
      {score > 0 && (
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={500}
          gravity={0.3}
        />
      )}

      <div className="text-center space-y-8 max-w-2xl w-full">
        <div className="space-y-4">
          <Trophy className="h-24 w-24 text-accent mx-auto" />
          <h1 className="text-5xl md:text-6xl font-bold text-primary">
            Game Over!
          </h1>
        </div>

        <div className="space-y-4">
          <div className="text-8xl font-black text-foreground" data-testid="text-final-score">
            {score}
          </div>
          <p className="text-2xl font-semibold text-muted-foreground">
            {score === 1 ? "Word" : "Words"} Guessed
          </p>

          {score === 0 && (
            <p className="text-lg text-muted-foreground">
              Better luck next time!
            </p>
          )}

          {score > 0 && score <= 5 && (
            <p className="text-lg text-muted-foreground">
              Good effort! Try again?
            </p>
          )}

          {score > 5 && score <= 10 && (
            <p className="text-lg text-muted-foreground">
              Great job! You're on fire!
            </p>
          )}

          {score > 10 && (
            <p className="text-lg text-muted-foreground">
              Amazing! You're a charades champion!
            </p>
          )}
        </div>

        <div className="space-y-4">
          <Button
            size="lg"
            className="w-64 h-16 text-xl font-semibold rounded-full"
            onClick={onPlayAgain}
            data-testid="button-play-again"
          >
            <RotateCcw className="h-6 w-6 mr-2" />
            Play Again
          </Button>

          <Button
            size="lg"
            variant="secondary"
            className="w-64 h-16 text-xl font-semibold rounded-full"
            onClick={onChangeSettings}
            data-testid="button-change-settings"
          >
            <Settings className="h-6 w-6 mr-2" />
            Change Settings
          </Button>
        </div>
      </div>
    </div>
  );
}
