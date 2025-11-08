import { type Category } from "@shared/schema";
import { Check } from "lucide-react";
import { getIcon } from "@/lib/iconMap";

interface CategoryCardProps {
  category: Category;
  isSelected: boolean;
  onToggle: () => void;
}

export function CategoryCard({ category, isSelected, onToggle }: CategoryCardProps) {
  return (
    <button
      onClick={onToggle}
      className={`
        relative p-6 rounded-2xl border-2 transition-all
        hover-elevate active-elevate-2
        ${isSelected 
          ? "border-primary bg-primary/10 scale-105" 
          : "border-border bg-card"
        }
      `}
      data-testid={`category-${category.id}`}
    >
      {isSelected && (
        <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
          <Check className="h-4 w-4 text-primary-foreground" />
        </div>
      )}

      <div className="flex flex-col items-center gap-3">
        <div className={category.color}>
          {getIcon(category.icon, "h-12 w-12")}
        </div>
        <span className="text-lg font-semibold text-foreground">
          {category.name}
        </span>
        <span className="text-sm text-muted-foreground">
          {category.words.length} words
        </span>
      </div>
    </button>
  );
}
