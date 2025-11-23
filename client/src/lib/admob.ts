import { Capacitor } from "@capacitor/core";

// PLACEHOLDER IDs - Replace with YOUR keys from Google AdMob
// ← REPLACE WITH YOUR REAL IDs HERE (from https://admob.google.com)
const ADMOB_APP_ID_ANDROID = "ca-app-pub-xxxxxxxxxxxxxxxx";
const ADMOB_APP_ID_IOS = "ca-app-pub-xxxxxxxxxxxxxxxx";

// Official Google Test Ad Unit IDs (safe for development)
const REWARDED_AD_ID_ANDROID = "ca-app-pub-3940256099942544/5224354917";
const REWARDED_AD_ID_IOS = "ca-app-pub-3940256099942544/1712485313";
const INTERSTITIAL_AD_ID_ANDROID = "ca-app-pub-3940256099942544/1033173712";
const INTERSTITIAL_AD_ID_IOS = "ca-app-pub-3940256099942544/4411468910";

let admobInitialized = false;
let AdMob: any = null;

// Dynamically import AdMob only on native platforms
async function getAdMobModule() {
  if (AdMob) return AdMob;

  const platform = Capacitor.getPlatform();
  // Only import on native platforms (ios, android)
  if (platform === "ios" || platform === "android") {
    try {
      AdMob = await import("@capacitor-community/admob");
      return AdMob;
    } catch (e) {
      console.log("⚠️ AdMob not available on this platform");
      return null;
    }
  }
  return null;
}

export async function initAdMob() {
  if (admobInitialized) return;

  try {
    const AdMobModule = await getAdMobModule();
    if (!AdMobModule) {
      console.log("ℹ️ AdMob: Web environment - ads disabled");
      admobInitialized = true;
      return;
    }

    const platform = Capacitor.getPlatform();
    const appId =
      platform === "ios" ? ADMOB_APP_ID_IOS : ADMOB_APP_ID_ANDROID;

    await (AdMobModule as any).AdMob.initialize({ appId });
    admobInitialized = true;
    console.log("✅ AdMob initialized");
  } catch (error) {
    console.error("❌ AdMob init failed:", error);
  }
}

export async function showRewardedAd(): Promise<boolean> {
  try {
    const AdMobModule = await getAdMobModule();
    if (!AdMobModule) {
      console.log("ℹ️ Rewarded ad: Web environment - simulating reward");
      // On web, just return true to simulate earning the reward
      return true;
    }

    const platform = Capacitor.getPlatform();
    const unitId =
      platform === "ios" ? REWARDED_AD_ID_IOS : REWARDED_AD_ID_ANDROID;

    await (AdMobModule as any).AdMob.loadRewardedAd({
      adId: unitId,
      isTesting: true,
    });
    await (AdMobModule as any).AdMob.showRewardedAd();
    console.log("✅ Rewarded ad shown");
    return true;
  } catch (error) {
    console.error("❌ Rewarded ad failed:", error);
    return false;
  }
}

export async function showInterstitialAd(): Promise<void> {
  try {
    const AdMobModule = await getAdMobModule();
    if (!AdMobModule) {
      console.log("ℹ️ Interstitial ad: Web environment - skipped");
      return;
    }

    const platform = Capacitor.getPlatform();
    const unitId =
      platform === "ios"
        ? INTERSTITIAL_AD_ID_IOS
        : INTERSTITIAL_AD_ID_ANDROID;

    await (AdMobModule as any).AdMob.loadInterstitialAd({
      adId: unitId,
      isTesting: true,
    });
    await (AdMobModule as any).AdMob.showInterstitialAd();
    console.log("✅ Interstitial ad shown");
  } catch (error) {
    console.error("❌ Interstitial ad failed:", error);
  }
}
