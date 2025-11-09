import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { categories } from "@/lib/categories";
import { CategoryCard } from "./CategoryCard";

interface CategorySelectProps {
  selectedCategories: string[];
  onCategoryToggle: (categoryId: string) => void;
  onStartPlaying: () => void;
  onBack: () => void;
  onOpenSubscription?: () => void;
  isPremium?: boolean;
}

const FREE_CATEGORY_LIMIT = 5;

export function CategorySelect({
  selectedCategories,
  onCategoryToggle,
  onStartPlaying,
  onBack,
  onOpenSubscription,
  isPremium = false,
}: CategorySelectProps) {
  const canStart = selectedCategories.length > 0;

  return (
    <div className="min-h-screen flex flex-col p-6 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <Button
          size="icon"
          variant="ghost"
          onClick={onBack}
          data-testid="button-back"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground">
          Choose Categories
        </h2>
        <div className="w-10" />
      </div>

      <div className="flex-1 max-w-4xl w-full mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          {categories.map((category, index) => {
            const isLocked = !isPremium && index >= FREE_CATEGORY_LIMIT;
            return (
              <CategoryCard
                key={category.id}
                category={category}
                isSelected={selectedCategories.includes(category.id)}
                onToggle={() => onCategoryToggle(category.id)}
                isLocked={isLocked}
                onLockedClick={onOpenSubscription}
              />
            );
          })}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background via-background to-transparent">
        <Button
          size="lg"
          className="w-full max-w-md mx-auto block h-16 text-xl font-semibold rounded-full"
          onClick={onStartPlaying}
          disabled={!canStart}
          data-testid="button-start-playing"
        >
          {canStart
            ? `Start Playing (${selectedCategories.length} ${selectedCategories.length === 1 ? "Category" : "Categories"})`
            : "Select at least 1 category"}
        </Button>
      </div>
    </div>
  );
}
