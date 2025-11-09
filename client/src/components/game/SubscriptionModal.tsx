import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Crown, Check, Sparkles, X } from "lucide-react";

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUnlock: () => void;
  onRegister?: () => void;
}

export function SubscriptionModal({
  isOpen,
  onClose,
  onUnlock,
  onRegister,
}: SubscriptionModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <Crown className="h-16 w-16 text-accent" />
          </div>
          <DialogTitle className="text-2xl text-center">
            Unlock Premium Fun!
          </DialogTitle>
          <DialogDescription className="text-center">
            Get access to 20+ categories and exclusive features
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Card className="p-4 bg-gradient-to-r from-primary/10 to-accent/10">
            <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-accent" />
              Premium Benefits
            </h3>
            <ul className="space-y-2">
              {[
                "Access 20+ Categories (Music, Sports, Food & More)",
                "No Ads - Uninterrupted Fun",
                "Custom Deck Creation",
                "Unlimited Gameplay",
                "Exclusive Sound Effects",
                "Priority Support",
              ].map((benefit, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <Check className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </Card>

          <div className="space-y-3">
            <Card className="p-4 border-2 border-primary hover-elevate cursor-pointer" onClick={onUnlock}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-lg">Monthly Plan</p>
                  <p className="text-sm text-muted-foreground">$4.99/month</p>
                </div>
                <Badge variant="secondary">Popular</Badge>
              </div>
            </Card>

            <Card className="p-4 border-2 border-accent hover-elevate cursor-pointer" onClick={onUnlock}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-lg">Annual Plan</p>
                  <p className="text-sm text-muted-foreground">
                    $29.99/year <span className="text-accent font-semibold">(Save 50%!)</span>
                  </p>
                </div>
                <Badge className="bg-accent text-accent-foreground">Best Value</Badge>
              </div>
            </Card>
          </div>

          <div className="space-y-2 pt-2">
            <Button
              size="lg"
              className="w-full h-12 text-lg font-bold rounded-full"
              onClick={onUnlock}
              data-testid="button-unlock-now"
            >
              <Crown className="h-5 w-5 mr-2" />
              Unlock Now (Demo)
            </Button>

            {onRegister && (
              <Button
                size="lg"
                variant="outline"
                className="w-full h-12 text-base font-semibold rounded-full"
                onClick={onRegister}
                data-testid="button-register"
              >
                Create Account to Subscribe
              </Button>
            )}

            <Button
              variant="ghost"
              className="w-full"
              onClick={onClose}
              data-testid="button-maybe-later"
            >
              Maybe Later
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Cancel anytime. Auto-renewal. Terms apply.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
