import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronRight, Trophy } from "lucide-react";
import { type GameState } from "@shared/schema";

interface RoundEndProps {
  gameState: GameState;
  onContinue: () => void;
  onEndGame: () => void;
}

export function RoundEnd({ gameState, onContinue, onEndGame }: RoundEndProps) {
  const isTeamMode = gameState.gameMode === "team";
  const currentTeam = isTeamMode && gameState.teams && gameState.currentTeamIndex !== undefined
    ? gameState.teams[gameState.currentTeamIndex]
    : null;
  
  const currentIndex = gameState.currentTeamIndex || 0;
  const isLastTeam = isTeamMode && gameState.teams ? currentIndex === gameState.teams.length - 1 : false;
  const isLastRound = gameState.totalRounds ? gameState.currentRound >= gameState.totalRounds : false;

  const nextTeam = isTeamMode && gameState.teams && !isLastTeam
    ? gameState.teams[currentIndex + 1]
    : null;

  const showContinueButton = isTeamMode 
    ? (!isLastTeam || !isLastRound)
    : !isLastRound;

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="max-w-md w-full p-8 space-y-6">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="h-20 w-20 rounded-full bg-primary/20 flex items-center justify-center">
              <Trophy className="h-10 w-10 text-primary" />
            </div>
          </div>

          {isTeamMode && currentTeam ? (
            <>
              <div>
                <h2 className="text-3xl font-bold" style={{ color: currentTeam.color }}>
                  {currentTeam.name}
                </h2>
                <p className="text-muted-foreground">Round Complete!</p>
              </div>

              <div className="py-6">
                <div className="text-6xl font-bold text-primary">
                  {currentTeam.score}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Words Guessed This Game
                </p>
              </div>

              {gameState.totalRounds && (
                <p className="text-sm text-muted-foreground">
                  Round {gameState.currentRound} of {gameState.totalRounds}
                </p>
              )}
            </>
          ) : (
            <>
              <div>
                <h2 className="text-3xl font-bold text-foreground">
                  Round Complete!
                </h2>
                <p className="text-muted-foreground">Great job!</p>
              </div>

              <div className="py-6">
                <div className="text-6xl font-bold text-primary">
                  {gameState.score}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Total Words Guessed
                </p>
              </div>

              {gameState.totalRounds && (
                <p className="text-sm text-muted-foreground">
                  Round {gameState.currentRound} of {gameState.totalRounds}
                </p>
              )}
            </>
          )}
        </div>

        <div className="space-y-3">
          {showContinueButton ? (
            <>
              <Button
                size="lg"
                className="w-full h-14 text-lg font-bold rounded-full"
                onClick={onContinue}
                data-testid="button-continue-next"
              >
                {isTeamMode && nextTeam ? (
                  <>
                    Pass to {nextTeam.name}
                    <ChevronRight className="h-5 w-5 ml-2" />
                  </>
                ) : isTeamMode && isLastTeam ? (
                  <>
                    Next Round
                    <ChevronRight className="h-5 w-5 ml-2" />
                  </>
                ) : (
                  <>
                    Next Round
                    <ChevronRight className="h-5 w-5 ml-2" />
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="w-full h-12"
                onClick={onEndGame}
                data-testid="button-end-game"
              >
                End Game
              </Button>
            </>
          ) : (
            <Button
              size="lg"
              className="w-full h-14 text-lg font-bold rounded-full"
              onClick={onEndGame}
              data-testid="button-view-results"
            >
              View Final Results
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
