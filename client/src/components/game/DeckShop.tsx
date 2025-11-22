import { useState } from "react";
import { ArrowLeft, Lock, Sparkles, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CategoryCard } from "./CategoryCard";
import { allCategories } from "@/lib/categories";
import { Badge } from "@/components/ui/badge";

interface DeckShopProps {
  onBack: () => void;
  onOpenPaywall: () => void;
  isPremium: boolean;
  selectedCategories?: string[];
  onCategoryToggle?: (categoryId: string) => void;
}

export function DeckShop({
  onBack,
  onOpenPaywall,
  isPremium,
  selectedCategories = [],
  onCategoryToggle,
}: DeckShopProps) {
  const [filter, setFilter] = useState<"all" | "free" | "premium">("all");

  // Tag certain decks as "New" or "Popular"
  const newDeckIds = ["tiktok-dances", "billie-eilish", "reality-tv", "memes", "emojis"];
  const popularDeckIds = ["disney", "marvel", "harry-potter", "friends-quotes", "the-office", "netflix-shows"];

  const filteredCategories = allCategories.filter((cat) => {
    if (filter === "free") return !cat.premium;
    if (filter === "premium") return cat.premium;
    return true;
  });

  const freeCount = allCategories.filter((cat) => !cat.premium).length;
  const premiumCount = allCategories.filter((cat) => cat.premium).length;

  return (
    <div className="min-h-screen flex flex-col p-6 md:p-8">
      {/* Fixed Back Button */}
      <div className="fixed top-4 left-4 z-50">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="bg-background/80 backdrop-blur-sm rounded-full shadow-lg"
          data-testid="button-back-fixed"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button
          size="icon"
          variant="ghost"
          onClick={onBack}
          data-testid="button-back-from-shop"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground">
          Deck Shop
        </h2>
        <div className="w-10" />
      </div>

      {/* Stats */}
      <div className="flex items-center justify-center gap-4 mb-6">
        <div className="text-center">
          <div className="text-3xl font-bold text-primary">{allCategories.length}</div>
          <div className="text-sm text-muted-foreground">Total Decks</div>
        </div>
        <div className="w-px h-12 bg-border" />
        <div className="text-center">
          <div className="text-3xl font-bold text-green-500">{freeCount}</div>
          <div className="text-sm text-muted-foreground">Free</div>
        </div>
        <div className="w-px h-12 bg-border" />
        <div className="text-center">
          <div className="text-3xl font-bold text-purple-500">{premiumCount}</div>
          <div className="text-sm text-muted-foreground">Premium</div>
        </div>
      </div>

      {/* Premium Banner (if not premium) */}
      {!isPremium && (
        <div
          className="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl p-6 mb-6 border-2 border-primary/30 hover-elevate cursor-pointer"
          onClick={onOpenPaywall}
          data-testid="banner-upgrade-premium"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-lg text-foreground">Unlock All Premium Decks</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Get instant access to {premiumCount} exclusive decks with 900+ premium words
              </p>
              <Button size="sm" variant="default" data-testid="button-upgrade-from-banner">
                <Lock className="w-4 h-4 mr-2" />
                Unlock Premium
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("all")}
          data-testid="filter-all"
        >
          All ({allCategories.length})
        </Button>
        <Button
          variant={filter === "free" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("free")}
          data-testid="filter-free"
        >
          Free ({freeCount})
        </Button>
        <Button
          variant={filter === "premium" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("premium")}
          data-testid="filter-premium"
        >
          Premium ({premiumCount})
        </Button>
      </div>

      {/* Deck Grid */}
      <div className="flex-1 max-w-6xl w-full mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-8">
          {filteredCategories.map((category) => {
            const isLocked = !isPremium && category.premium;
            const isNew = newDeckIds.includes(category.id);
            const isPopular = popularDeckIds.includes(category.id);
            const isSelected = selectedCategories.includes(category.id);

            return (
              <div key={category.id} className="relative">
                {/* Tags */}
                {(isNew || isPopular) && (
                  <div className="absolute -top-2 -right-2 z-10">
                    {isNew && (
                      <Badge
                        variant="default"
                        className="bg-green-500 hover:bg-green-600 text-white font-bold shadow-lg"
                      >
                        <Sparkles className="w-3 h-3 mr-1" />
                        New
                      </Badge>
                    )}
                    {isPopular && !isNew && (
                      <Badge
                        variant="default"
                        className="bg-orange-500 hover:bg-orange-600 text-white font-bold shadow-lg"
                      >
                        <TrendingUp className="w-3 h-3 mr-1" />
                        Popular
                      </Badge>
                    )}
                  </div>
                )}

                {/* Category Card */}
                <CategoryCard
                  category={category}
                  isSelected={isSelected}
                  onToggle={() => {
                    if (isLocked) {
                      onOpenPaywall();
                    } else if (onCategoryToggle) {
                      onCategoryToggle(category.id);
                    }
                  }}
                  isLocked={isLocked}
                  onLockedClick={onOpenPaywall}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Info */}
      <div className="text-center text-sm text-muted-foreground py-4">
        {isPremium ? (
          <p className="flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            You have access to all {allCategories.length} decks!
          </p>
        ) : (
          <p>
            Unlock {premiumCount} premium decks with{" "}
            <button
              onClick={onOpenPaywall}
              className="text-primary font-semibold hover:underline"
              data-testid="button-upgrade-inline"
            >
              Premium
            </button>
          </p>
        )}
      </div>
    </div>
  );
}
