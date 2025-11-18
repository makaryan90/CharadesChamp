// Mock Ad System for Web
// TODO: Replace with real AdMob integration after Capacitor conversion

export interface AdResult {
  success: boolean;
  reward?: number;
  error?: string;
}

let isAdInitialized = false;

export async function initializeAdMob(): Promise<void> {
  // Mock initialization
  return new Promise((resolve) => {
    setTimeout(() => {
      isAdInitialized = true;
      console.log("[Mock AdMob] Initialized successfully");
      resolve();
    }, 500);
  });
}

export async function showRewardedAd(): Promise<AdResult> {
  // Mock rewarded ad - simulates watching an ad to earn +10 seconds
  return new Promise((resolve) => {
    console.log("[Mock AdMob] Showing rewarded ad...");
    
    // Simulate ad loading time
    setTimeout(() => {
      // 90% success rate for demo purposes
      const success = Math.random() > 0.1;
      
      if (success) {
        console.log("[Mock AdMob] Rewarded ad completed! +10 seconds");
        resolve({ success: true, reward: 10 });
      } else {
        console.log("[Mock AdMob] Ad failed to load");
        resolve({ success: false, error: "Ad failed to load" });
      }
    }, 2000); // 2 second delay to simulate ad
  });
}

export async function showInterstitial(): Promise<AdResult> {
  // Mock interstitial ad - shown between screens
  return new Promise((resolve) => {
    console.log("[Mock AdMob] Showing interstitial ad...");
    
    // Simulate ad loading and display time
    setTimeout(() => {
      // 95% success rate for demo purposes
      const success = Math.random() > 0.05;
      
      if (success) {
        console.log("[Mock AdMob] Interstitial ad shown");
        resolve({ success: true });
      } else {
        console.log("[Mock AdMob] Interstitial ad failed");
        resolve({ success: false, error: "Ad failed to load" });
      }
    }, 1500); // 1.5 second delay
  });
}

export function isAdAvailable(): boolean {
  // In mock mode, always return true
  return isAdInitialized;
}

// Initialize ads on module load
if (typeof window !== "undefined") {
  initializeAdMob();
}

/* 
TODO: Real AdMob Integration for Capacitor
===============================================

import { AdMob, BannerAdSize, BannerAdPosition } from '@capacitor-community/admob';

export async function initializeAdMob(): Promise<void> {
  await AdMob.initialize({
    requestTrackingAuthorization: true,
    testingDevices: ['YOUR_TEST_DEVICE_ID'],
  });
}

export async function showRewardedAd(): Promise<AdResult> {
  try {
    const result = await AdMob.showRewardedAd({
      adId: 'YOUR_REWARDED_AD_UNIT_ID',
    });
    return { success: true, reward: 10 };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function showInterstitial(): Promise<AdResult> {
  try {
    await AdMob.showInterstitial({
      adId: 'YOUR_INTERSTITIAL_AD_UNIT_ID',
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}
*/
