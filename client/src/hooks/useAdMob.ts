import { useEffect } from "react";
import { initAdMob, showRewardedAd, showInterstitialAd } from "@/lib/admob";

export function useAdMob() {
  // Initialize AdMob when component mounts
  useEffect(() => {
    initAdMob();
  }, []);

  /**
   * Show a rewarded ad (user watches ad to get reward)
   * Returns true if ad was shown successfully
   */
  const showRewarded = async (): Promise<boolean> => {
    return await showRewardedAd();
  };

  /**
   * Show an interstitial ad (full-screen ad between screens)
   */
  const showInterstitial = async () => {
    return await showInterstitialAd();
  };

  return {
    showRewarded,
    showInterstitial,
  };
}
