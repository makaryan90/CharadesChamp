import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Zap, Users, HelpCircle, Settings, Crown, Sparkles, Package } from "lucide-react";
import { categories, allCategories } from "@/lib/categories";
import { getIcon } from "@/lib/iconMap";

interface MainMenuProps {
  onQuickStart: () => void;
  onCreateTeams: () => void;
  onHowToPlay: () => void;
  onSettings: () => void;
  onSubscribe: () => void;
  onDeckShop?: () => void;
  isPremium?: boolean;
}

export function MainMenu({
  onQuickStart,
  onCreateTeams,
  onHowToPlay,
  onSettings,
  onSubscribe,
  onDeckShop,
  isPremium = false,
}: MainMenuProps) {
  const freeCount = allCategories.filter((cat) => !cat.premium).length;
  const premiumCount = allCategories.filter((cat) => cat.premium).length;
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 md:p-8 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 text-6xl opacity-20 animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}>
          🎭
        </div>
        <div className="absolute top-32 right-20 text-5xl opacity-20 animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '2.5s' }}>
          🎬
        </div>
        <div className="absolute bottom-20 left-20 text-5xl opacity-20 animate-bounce" style={{ animationDelay: '1s', animationDuration: '3.5s' }}>
          🎪
        </div>
        <div className="absolute bottom-32 right-16 text-6xl opacity-20 animate-bounce" style={{ animationDelay: '1.5s', animationDuration: '2.8s' }}>
          🎉
        </div>
      </div>

      <div className="text-center space-y-8 max-w-2xl w-full relative z-10">
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center justify-center gap-3">
            <Sparkles className="h-12 w-12 text-primary animate-pulse" />
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-primary">
              Charades Fun!
            </h1>
            <Sparkles className="h-12 w-12 text-secondary animate-pulse" />
          </div>
          <p className="text-xl md:text-2xl font-semibold text-muted-foreground">
            The Ultimate Party Game Experience
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
          {categories.slice(0, 3).map((category, index) => (
            <div
              key={category.id}
              className="flex flex-col items-center gap-2 p-3 rounded-xl bg-card hover-elevate transition-all animate-slideUp"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={category.color}>
                {getIcon(category.icon, "h-8 w-8")}
              </div>
              <span className="text-xs font-medium text-card-foreground">
                {category.name}
              </span>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <Button
            size="lg"
            className="w-full max-w-md h-14 text-lg font-bold rounded-full bg-gradient-to-r from-primary to-secondary hover:opacity-90"
            onClick={onQuickStart}
            data-testid="button-quick-start"
          >
            <Zap className="h-5 w-5 mr-2" />
            Quick Start
          </Button>

          <Button
            size="lg"
            variant="secondary"
            className="w-full max-w-md h-14 text-lg font-bold rounded-full"
            onClick={onCreateTeams}
            data-testid="button-create-teams"
          >
            <Users className="h-5 w-5 mr-2" />
            Create Teams
          </Button>

          {onDeckShop && (
            <Button
              size="lg"
              variant="outline"
              className="w-full max-w-md h-14 text-lg font-bold rounded-full border-2"
              onClick={onDeckShop}
              data-testid="button-deck-shop"
            >
              <Package className="h-5 w-5 mr-2" />
              More Decks ({allCategories.length})
            </Button>
          )}

          <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
            <Button
              variant="outline"
              className="h-12 text-base font-semibold rounded-full"
              onClick={onHowToPlay}
              data-testid="button-how-to-play"
            >
              <HelpCircle className="h-4 w-4 mr-2" />
              How to Play
            </Button>

            <Button
              variant="outline"
              className="h-12 text-base font-semibold rounded-full"
              onClick={onSettings}
              data-testid="button-settings"
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>

          {!isPremium && (
            <Card className="p-4 bg-gradient-to-r from-primary/20 to-secondary/20 border-2 border-primary hover-elevate active-elevate-2 cursor-pointer" onClick={onSubscribe}>
              <div className="flex items-center justify-between gap-3" data-testid="button-subscribe">
                <div className="flex items-center gap-2">
                  <Crown className="h-6 w-6 text-primary" />
                  <div className="text-left">
                    <p className="text-sm font-bold text-foreground">Go Premium!</p>
                    <p className="text-xs text-muted-foreground">Unlock {premiumCount} Premium Decks</p>
                  </div>
                </div>
                <Sparkles className="h-5 w-5 text-primary animate-pulse" />
              </div>
            </Card>
          )}

          {isPremium && (
            <Card className="p-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30">
              <div className="flex items-center justify-center gap-2">
                <Crown className="h-5 w-5 text-green-500" />
                <p className="text-sm font-semibold text-foreground">Premium Active - All {allCategories.length} Decks Unlocked!</p>
              </div>
            </Card>
          )}
        </div>

        <div className="text-xs text-muted-foreground space-y-1">
          <p>Version 2.0.0</p>
          <button className="hover:underline" data-testid="link-privacy">
            Privacy Policy
          </button>
        </div>
      </div>
    </div>
  );
}
