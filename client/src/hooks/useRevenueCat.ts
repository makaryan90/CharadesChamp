import { useState, useEffect } from "react";
import {
  initRevenueCat,
  isPremium as checkPremium,
  restorePurchases as restoreRevenueCatPurchases,
} from "@/lib/revenuecat";

export function useRevenueCat() {
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize RevenueCat when component mounts
  useEffect(() => {
    const init = async () => {
      try {
        await initRevenueCat();
        const premium = await checkPremium();
        setIsPremium(premium);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Init failed";
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  // Function to restore purchases
  const restorePurchases = async () => {
    try {
      setError(null);
      const premium = await restoreRevenueCatPurchases();
      setIsPremium(premium);
      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Restore failed";
      setError(msg);
      return false;
    }
  };

  return {
    isPremium,
    loading,
    error,
    restorePurchases,
  };
}
