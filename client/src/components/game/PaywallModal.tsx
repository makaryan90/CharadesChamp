import { useState } from "react";
import { X, Crown, Sparkles, Zap, Lock, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import confetti from "canvas-confetti";

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUnlock: () => void;
}

type PricingTier = "monthly" | "yearly" | "lifetime";

export function PaywallModal({ isOpen, onClose, onUnlock }: PaywallModalProps) {
  const [selectedTier, setSelectedTier] = useState<PricingTier>("yearly");
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

  if (!isOpen) return null;

  const handleUnlock = async () => {
    setIsUnlocking(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // TODO: RevenueCat integration here
    // Example:
    // const result = await Purchases.purchasePackage(selectedPackage);
    // if (result.customerInfo.entitlements.active['premium']) {
    //   onUnlock();
    // }

    // Show confetti celebration
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#a855f7", "#06b6d4", "#f97316"],
    });

    // Trigger haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate([200, 100, 200]);
    }

    setShowThankYou(true);

    // Call unlock and close after celebration
    setTimeout(() => {
      onUnlock();
      setIsUnlocking(false);
      setShowThankYou(false);
      onClose();
    }, 2000);
  };

  const pricingTiers = [
    {
      id: "monthly" as PricingTier,
      name: "Monthly",
      price: "$3.99",
      period: "/month",
      badge: null,
      savings: null,
    },
    {
      id: "yearly" as PricingTier,
      name: "Yearly",
      price: "$19.99",
      period: "/year",
      badge: "Best Value",
      savings: "Save 60%",
    },
    {
      id: "lifetime" as PricingTier,
      name: "Lifetime",
      price: "$29.99",
      period: "once",
      badge: "Most Popular",
      savings: null,
    },
  ];

  const premiumFeatures = [
    "35 Premium Decks (900+ words)",
    "Disney, Marvel, Harry Potter & More",
    "TikTok Dances & Pop Culture",
    "Adult 18+ Content",
    "Remove All Ads Forever",
    "Early Access to New Decks",
    "Support Development",
  ];

  if (showThankYou) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
        <div className="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl p-8 max-w-md w-full text-center space-y-6 animate-in zoom-in duration-500">
          <div className="flex justify-center">
            <div className="bg-primary/20 p-6 rounded-full">
              <Crown className="w-16 h-16 text-primary" />
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-foreground">Welcome to Premium!</h2>
            <p className="text-muted-foreground text-lg">
              You now have access to all 44 categories!
            </p>
          </div>
          <div className="flex items-center justify-center gap-2 text-primary font-semibold">
            <Sparkles className="w-5 h-5" />
            <span>Unlocking premium features...</span>
            <Sparkles className="w-5 h-5" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6 overflow-y-auto">
      <div className="bg-background rounded-3xl max-w-2xl w-full my-8 animate-in zoom-in duration-300">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-primary to-secondary p-8 rounded-t-3xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-primary-foreground/80 hover:text-primary-foreground transition-colors"
            data-testid="button-paywall-close"
            aria-label="Close paywall modal"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <div className="bg-primary-foreground/20 p-4 rounded-full">
                <Crown className="w-12 h-12 text-primary-foreground" />
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground">
              Unlock Premium
            </h2>
            <p className="text-primary-foreground/90 text-lg">
              Get access to 35+ exclusive decks
            </p>
          </div>
        </div>

        {/* Pricing Tiers */}
        <div className="p-6 space-y-4">
          <div className="grid gap-3">
            {pricingTiers.map((tier) => (
              <button
                key={tier.id}
                onClick={() => setSelectedTier(tier.id)}
                className={`relative p-4 rounded-2xl border-2 transition-all hover-elevate ${
                  selectedTier === tier.id
                    ? "border-primary bg-primary/10"
                    : "border-border bg-card"
                }`}
                data-testid={`button-tier-${tier.id}`}
              >
                {tier.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      {tier.badge}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedTier === tier.id
                          ? "border-primary bg-primary"
                          : "border-muted-foreground/30"
                      }`}
                    >
                      {selectedTier === tier.id && (
                        <Check className="w-4 h-4 text-primary-foreground" />
                      )}
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-foreground">{tier.name}</div>
                      {tier.savings && (
                        <div className="text-sm text-primary font-semibold">
                          {tier.savings}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-foreground">{tier.price}</div>
                    <div className="text-sm text-muted-foreground">{tier.period}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Features */}
          <div className="bg-card rounded-2xl p-6 space-y-3">
            <h3 className="font-bold text-foreground flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              What You Get:
            </h3>
            <div className="space-y-2">
              {premiumFeatures.map((feature, index) => (
                <div key={index} className="flex items-center gap-3 text-sm">
                  <Check className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="text-muted-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Unlock Button */}
          <Button
            size="lg"
            className="w-full h-14 text-lg font-bold rounded-2xl"
            onClick={handleUnlock}
            disabled={isUnlocking}
            data-testid="button-unlock-premium"
          >
            {isUnlocking ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Processing...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Unlock Now - {pricingTiers.find((t) => t.id === selectedTier)?.price}
              </div>
            )}
          </Button>

          {/* Footer */}
          <div className="text-center space-y-2">
            <p className="text-xs text-muted-foreground">
              Simulated purchase - No real payment required
            </p>
            <button
              onClick={onClose}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              data-testid="button-maybe-later"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
