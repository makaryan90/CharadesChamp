import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, RotateCcw, Settings, Home } from "lucide-react";
import Confetti from "react-confetti";
import { useWindowSize } from "@/hooks/useWindowSize";

interface Team {
  name: string;
  score: number;
  color: string;
}

interface EndScreenProps {
  score: number;
  wordsGuessed: string[];
  onPlayAgain: () => void;
  onChangeSettings: () => void;
  onMainMenu: () => void;
  teams?: Team[];
  gameMode?: string;
}

export function EndScreen({ score, wordsGuessed, onPlayAgain, onChangeSettings, onMainMenu, teams, gameMode }: EndScreenProps) {
  const { width, height } = useWindowSize();
  
  const sortedTeams = teams ? [...teams].sort((a, b) => b.score - a.score) : [];

  const getTeamColorDot = (color: string) => {
    const colorMap: Record<string, string> = {
      purple: "bg-purple-500",
      cyan: "bg-cyan-500",
      orange: "bg-orange-500",
      green: "bg-green-500",
      pink: "bg-pink-500",
      yellow: "bg-yellow-500",
    };
    return colorMap[color] || "bg-purple-500";
  };

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

        {gameMode === "team" && sortedTeams.length > 0 ? (
          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-foreground">
                {sortedTeams[0].name} Wins!
              </h2>
              <div className="text-6xl font-black text-foreground" data-testid="text-final-score">
                {sortedTeams[0].score}
              </div>
              <p className="text-xl font-semibold text-muted-foreground">
                Points
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground">Team Rankings</h3>
              {sortedTeams.map((team, index) => (
                <div
                  key={team.name}
                  className="flex items-center justify-between p-4 bg-card rounded-xl border-2 border-card-border"
                  data-testid={`team-result-${index}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl font-bold text-muted-foreground">
                      {index === 0 ? <Trophy className="h-6 w-6 text-accent" /> : `#${index + 1}`}
                    </div>
                    <div className={`w-4 h-4 rounded-full ${getTeamColorDot(team.color)}`} />
                    <span className="font-bold text-lg">{team.name}</span>
                  </div>
                  <Badge variant="secondary" className="text-lg px-4 py-1">
                    {team.score} points
                  </Badge>
                </div>
              ))}
            </div>

            <p className="text-lg text-muted-foreground">
              Total: {score} {score === 1 ? "word" : "words"} guessed
            </p>
          </div>
        ) : (
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
        )}

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

          <Button
            size="lg"
            variant="outline"
            className="w-64 h-16 text-xl font-semibold rounded-full"
            onClick={onMainMenu}
            data-testid="button-main-menu"
          >
            <Home className="h-6 w-6 mr-2" />
            Main Menu
          </Button>
        </div>
      </div>
    </div>
  );
}
