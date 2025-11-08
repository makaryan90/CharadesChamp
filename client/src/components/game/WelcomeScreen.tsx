import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { categories } from "@/lib/categories";
import { getIcon } from "@/lib/iconMap";

interface WelcomeScreenProps {
  onStartGame: () => void;
  onOpenSettings: () => void;
}

export function WelcomeScreen({ onStartGame, onOpenSettings }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 relative">
      <Button
        size="icon"
        variant="ghost"
        className="absolute top-6 right-6"
        onClick={onOpenSettings}
        data-testid="button-settings"
      >
        <Settings className="h-6 w-6" />
      </Button>

      <div className="text-center space-y-8 max-w-2xl w-full animate-fadeIn">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-primary animate-pulse">
            Charades
          </h1>
          <p className="text-xl md:text-2xl font-semibold text-muted-foreground">
            The Ultimate Party Game
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
          {categories.slice(0, 3).map((category, index) => (
            <div
              key={category.id}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-card hover-elevate transition-all animate-slideUp"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={category.color}>
                {getIcon(category.icon, "h-10 w-10")}
              </div>
              <span className="text-sm font-medium text-card-foreground">
                {category.name}
              </span>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <Button
            size="lg"
            className="w-64 h-16 text-xl font-semibold rounded-full"
            onClick={onStartGame}
            data-testid="button-start-game"
          >
            Start Game
          </Button>

          <p className="text-sm text-muted-foreground">
            Choose categories, set your timer, and let the fun begin!
          </p>
        </div>
      </div>
    </div>
  );
}
