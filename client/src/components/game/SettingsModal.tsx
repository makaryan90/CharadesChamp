import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { type GameSettings } from "@shared/schema";
import { categories } from "@/lib/categories";
import { getIcon } from "@/lib/iconMap";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: GameSettings;
  onUpdateSettings: (settings: Partial<GameSettings>) => void;
}

export function SettingsModal({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}: SettingsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md" data-testid="modal-settings">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Settings</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-3">
            <Label className="text-lg font-semibold">Timer Length</Label>
            <div className="grid grid-cols-3 gap-3">
              {(["30", "60", "90"] as const).map((time) => (
                <button
                  key={time}
                  onClick={() => onUpdateSettings({ timerLength: time })}
                  className={`
                    p-4 rounded-xl border-2 font-semibold transition-all
                    hover-elevate active-elevate-2
                    ${settings.timerLength === time 
                      ? "border-primary bg-primary text-primary-foreground" 
                      : "border-border bg-card text-foreground"
                    }
                  `}
                  data-testid={`button-timer-${time}`}
                >
                  {time}s
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-lg font-semibold">Categories</Label>
            <div className="space-y-2">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-card border border-card-border"
                >
                  <div className="flex items-center gap-3">
                    <div className={category.color}>
                      {getIcon(category.icon, "h-6 w-6")}
                    </div>
                    <span className="font-medium text-foreground">
                      {category.name}
                    </span>
                  </div>
                  <Switch
                    checked={settings.selectedCategories.includes(category.id)}
                    onCheckedChange={() => {
                      const newCategories = settings.selectedCategories.includes(category.id)
                        ? settings.selectedCategories.filter((id) => id !== category.id)
                        : [...settings.selectedCategories, category.id];
                      onUpdateSettings({ selectedCategories: newCategories });
                    }}
                    data-testid={`switch-category-${category.id}`}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-card border border-card-border">
            <Label htmlFor="sound-toggle" className="font-medium text-foreground cursor-pointer">
              Sound Effects
            </Label>
            <Switch
              id="sound-toggle"
              checked={settings.soundEnabled}
              onCheckedChange={(checked) => onUpdateSettings({ soundEnabled: checked })}
              data-testid="switch-sound"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
