import { Film, Dog, Star, Sparkles, Package } from "lucide-react";

export const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Film,
  Dog,
  Star,
  Sparkles,
  Package,
};

export function getIcon(iconName: string, className?: string) {
  const IconComponent = iconMap[iconName];
  if (!IconComponent) return null;
  return <IconComponent className={className} />;
}
