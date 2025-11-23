import { useState, useEffect } from "react";
import {
  isPremium as checkRevenueCatPremium,
  restorePurchases,
} from "./revenuecat";

const FREE_TRIAL_CLAIMED_KEY = "free-trial-claimed";
const UNLOCKED_TRIAL_DECK_KEY = "unlocked-trial-deck";

export const isDeckUnlocked = (deckId: string): boolean => {
  if (typeof window === "undefined") return false;

  // Check if user has premium via RevenueCat (will be checked async in hook)
  // For now, check trial deck unlock
  if (localStorage.getItem(UNLOCKED_TRIAL_DECK_KEY) === deckId) return true;
  return false;
};

export const hasClaimedFreeTrial = (): boolean => {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(FREE_TRIAL_CLAIMED_KEY) === "true";
};

export const claimFreeTrial = (deckId: string): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(FREE_TRIAL_CLAIMED_KEY, "true");
  localStorage.setItem(UNLOCKED_TRIAL_DECK_KEY, deckId);
};

export function usePremium() {
  const [isPremium, setIsPremium] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize premium status on mount
  useEffect(() => {
    const initPremium = async () => {
      try {
        setLoading(true);
        const premium = await checkRevenueCatPremium();
        setIsPremium(premium);
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "Failed to check premium status";
        setError(msg);
        console.error("Premium check failed:", err);
      } finally {
        setLoading(false);
      }
    };

    initPremium();
  }, []);

  const unlockPremium = () => {
    // In production, this happens via RevenueCat purchase
    // This function is kept for compatibility
    setIsPremium(true);
  };

  const lockPremium = () => {
    // In production, this happens when subscription expires
    setIsPremium(false);
  };

  const restorePurchase = async () => {
    try {
      const hasPremium = await restorePurchases();
      setIsPremium(hasPremium);
      return hasPremium;
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to restore purchase";
      setError(msg);
      console.error("Restore purchase failed:", err);
      return false;
    }
  };

  return {
    isPremium,
    unlockPremium,
    lockPremium,
    restorePurchase,
    loading,
    error,
  };
}
