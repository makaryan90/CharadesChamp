import { useState, useEffect } from "react";

const PREMIUM_STORAGE_KEY = "charades-premium";
const FREE_TRIAL_CLAIMED_KEY = "free-trial-claimed";
const UNLOCKED_TRIAL_DECK_KEY = "unlocked-trial-deck";

export const isDeckUnlocked = (deckId: string): boolean => {
  if (typeof window === "undefined") return false;
  if (localStorage.getItem(PREMIUM_STORAGE_KEY) === "true") return true;
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
  const [isPremium, setIsPremium] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(PREMIUM_STORAGE_KEY) === "true";
  });

  useEffect(() => {
    const handleStorageChange = () => {
      setIsPremium(localStorage.getItem(PREMIUM_STORAGE_KEY) === "true");
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const unlockPremium = () => {
    localStorage.setItem(PREMIUM_STORAGE_KEY, "true");
    setIsPremium(true);
  };

  const lockPremium = () => {
    localStorage.removeItem(PREMIUM_STORAGE_KEY);
    setIsPremium(false);
  };

  const restorePurchase = () => {
    // TODO: Integrate with RevenueCat or payment provider to verify purchase
    // For now, check localStorage
    const hasPremium = localStorage.getItem(PREMIUM_STORAGE_KEY) === "true";
    setIsPremium(hasPremium);
    return hasPremium;
  };

  return {
    isPremium,
    unlockPremium,
    lockPremium,
    restorePurchase,
  };
}
