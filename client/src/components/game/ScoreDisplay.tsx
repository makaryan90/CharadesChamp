import { Trophy } from "lucide-react";

interface ScoreDisplayProps {
  score: number;
}

export function ScoreDisplay({ score }: ScoreDisplayProps) {
  return (
    <div className="flex items-center gap-2 bg-card rounded-full px-4 py-2 border border-card-border" data-testid="score-display">
      <Trophy className="h-5 w-5 text-accent" />
      <span className="text-2xl font-bold text-foreground">{score}</span>
    </div>
  );
}
