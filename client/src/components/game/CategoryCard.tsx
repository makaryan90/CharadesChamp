import { type Category } from "@shared/schema";
import { Check, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getIcon } from "@/lib/iconMap";

interface CategoryCardProps {
  category: Category;
  isSelected: boolean;
  onToggle: () => void;
  isLocked?: boolean;
  onLockedClick?: () => void;
}

export function CategoryCard({ 
  category, 
  isSelected, 
  onToggle, 
  isLocked = false,
  onLockedClick 
}: CategoryCardProps) {
  const handleClick = () => {
    if (isLocked && onLockedClick) {
      onLockedClick();
    } else {
      onToggle();
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`
        relative p-6 rounded-2xl border-2 transition-all
        ${isLocked ? 'opacity-75' : 'hover-elevate active-elevate-2'}
        ${isSelected 
          ? "border-primary bg-primary/10 scale-105" 
          : "border-border bg-card"
        }
        ${isLocked ? 'cursor-pointer' : ''}
      `}
      data-testid={`category-${isLocked ? 'locked-' : ''}${category.id}`}
    >
      {isLocked && (
        <div className="absolute top-2 right-2 w-8 h-8 bg-accent rounded-full flex items-center justify-center shadow-lg">
          <Lock className="h-4 w-4 text-accent-foreground" />
        </div>
      )}

      {!isLocked && isSelected && (
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
        {isLocked && (
          <Badge variant="outline" className="text-xs">Premium</Badge>
        )}
      </div>
    </button>
  );
}
