import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Smartphone, Users, Timer, Trophy } from "lucide-react";

interface HowToPlayProps {
  onBack: () => void;
}

export function HowToPlay({ onBack }: HowToPlayProps) {
  return (
    <div className="min-h-screen flex flex-col p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <Button
          size="icon"
          variant="ghost"
          onClick={onBack}
          data-testid="button-back"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h2 className="text-2xl font-bold text-foreground">How to Play</h2>
        <div className="w-10" />
      </div>

      <div className="flex-1 space-y-6 max-w-3xl mx-auto w-full pb-8">
        <Card className="p-6 space-y-4">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <Smartphone className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-foreground mb-2">Basic Setup</h3>
              <p className="text-muted-foreground">
                Hold your phone to your forehead so you can't see the screen. Your friends will see the word or phrase and give you clues.
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center">
              <Users className="h-6 w-6 text-secondary" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-foreground mb-2">Giving Clues</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">✓</span>
                  <span>Use gestures, sounds, and acting to describe the word</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">✓</span>
                  <span>Be creative with your clues and have fun!</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive font-bold">✗</span>
                  <span>Don't say the word itself or rhyming words</span>
                </li>
              </ul>
            </div>
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
              <Timer className="h-6 w-6 text-accent" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-foreground mb-2">Controls</h3>
              <div className="space-y-3 text-muted-foreground">
                <div className="flex items-center gap-3 p-3 bg-card/50 rounded-lg">
                  <div className="w-8 h-8 rounded bg-green-500/20 flex items-center justify-center">
                    <span className="text-lg">✓</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">Got It!</p>
                    <p className="text-sm">Tap button, swipe right, or tilt down when guessed correctly</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-card/50 rounded-lg">
                  <div className="w-8 h-8 rounded bg-orange-500/20 flex items-center justify-center">
                    <span className="text-lg">→</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">Pass</p>
                    <p className="text-sm">Tap button, swipe up, or tilt up to skip to next word</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <Trophy className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-foreground mb-2">Team vs Solo Play</h3>
              <div className="space-y-2 text-muted-foreground">
                <p><strong className="text-foreground">Quick Start:</strong> Jump right in for solo play or quick rounds</p>
                <p><strong className="text-foreground">Create Teams:</strong> Set up 2-6 teams with custom names and colors. Teams take turns, and the team with the highest score wins!</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-r from-primary/10 to-secondary/10">
          <h3 className="text-lg font-bold text-foreground mb-3">Pro Tips 🎯</h3>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-accent font-bold">•</span>
              <span>Use exaggerated gestures to make it easier for your team</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent font-bold">•</span>
              <span>Keep the energy high and have fun - laughter is part of the game!</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent font-bold">•</span>
              <span>Practice different acting styles for different categories</span>
            </li>
          </ul>
        </Card>

        <Button
          size="lg"
          className="w-full h-14 text-lg font-bold rounded-full"
          onClick={onBack}
          data-testid="button-got-it"
        >
          Got It! Let's Play
        </Button>
      </div>
    </div>
  );
}
