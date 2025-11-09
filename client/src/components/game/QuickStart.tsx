import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock, ArrowLeft, Play } from "lucide-react";
import { categories } from "@/lib/categories";
import { getIcon } from "@/lib/iconMap";
import { useState } from "react";

interface QuickStartProps {
  onBack: () => void;
  onStartGame: (selectedCategories: string[], timerLength: string) => void;
  onOpenSubscription?: () => void;
  isPremium?: boolean;
}

const FREE_CATEGORY_LIMIT = 5;

export function QuickStart({ onBack, onStartGame, onOpenSubscription, isPremium = false }: QuickStartProps) {
  const freeCategories = categories.slice(0, FREE_CATEGORY_LIMIT);
  const premiumCategories = categories.slice(FREE_CATEGORY_LIMIT);
  
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    freeCategories.slice(0, 2).map(c => c.id)
  );
  const [timerLength, setTimerLength] = useState<string>("60");

  const toggleCategory = (categoryId: string) => {
    if (selectedCategories.includes(categoryId)) {
      setSelectedCategories(selectedCategories.filter(id => id !== categoryId));
    } else {
      setSelectedCategories([...selectedCategories, categoryId]);
    }
  };

  const handleStart = () => {
    if (selectedCategories.length === 0) return;
    onStartGame(selectedCategories, timerLength);
  };

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
        <h2 className="text-2xl font-bold text-foreground">Ready for Quick Fun?</h2>
        <div className="w-10" />
      </div>

      <div className="flex-1 space-y-6 max-w-4xl mx-auto w-full">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Choose Categories</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {freeCategories.map((category) => {
              const isSelected = selectedCategories.includes(category.id);
              return (
                <Card
                  key={category.id}
                  className={`p-4 cursor-pointer transition-all hover-elevate active-elevate-2 ${
                    isSelected ? 'ring-2 ring-primary bg-primary/10' : ''
                  }`}
                  onClick={() => toggleCategory(category.id)}
                  data-testid={`category-${category.id}`}
                >
                  <div className="flex flex-col items-center gap-2 text-center">
                    <div className={category.color}>
                      {getIcon(category.icon, "h-10 w-10")}
                    </div>
                    <span className="text-sm font-semibold">{category.name}</span>
                    <Badge variant="secondary" className="text-xs">Free</Badge>
                  </div>
                </Card>
              );
            })}

            {premiumCategories.slice(0, 6).map((category) => (
              <Card
                key={category.id}
                className="p-4 opacity-60 cursor-pointer relative overflow-hidden hover-elevate"
                data-testid={`category-locked-${category.id}`}
                onClick={onOpenSubscription}
              >
                <div className="absolute inset-0 bg-card/80 backdrop-blur-[2px] flex items-center justify-center">
                  <Lock className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="flex flex-col items-center gap-2 text-center blur-[1px]">
                  <div className={category.color}>
                    {getIcon(category.icon, "h-10 w-10")}
                  </div>
                  <span className="text-sm font-semibold">{category.name}</span>
                  <Badge variant="outline" className="text-xs">Premium</Badge>
                </div>
              </Card>
            ))}
          </div>

          {selectedCategories.length === 0 && (
            <p className="text-sm text-destructive">Please select at least one category</p>
          )}
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-foreground">Round Time</h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: "30", label: "30 seconds" },
              { value: "60", label: "60 seconds" },
              { value: "90", label: "90 seconds" },
            ].map((option) => (
              <Button
                key={option.value}
                variant={timerLength === option.value ? "default" : "outline"}
                className="h-12 font-semibold"
                onClick={() => setTimerLength(option.value)}
                data-testid={`timer-${option.value}`}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="pt-4">
          <Button
            size="lg"
            className="w-full h-14 text-lg font-bold rounded-full"
            onClick={handleStart}
            disabled={selectedCategories.length === 0}
            data-testid="button-start-game"
          >
            <Play className="h-5 w-5 mr-2" />
            Start Game
          </Button>
        </div>
      </div>
    </div>
  );
}
