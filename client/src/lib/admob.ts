import * as AdMob from "@capacitor-community/admob";
import { Capacitor } from "@capacitor/core";

// PLACEHOLDER IDs - you'll get real ones from Google AdMob later
const ADMOB_APP_ID_ANDROID = "ca-app-pub-xxxxxxxxxxxxxxxx";
const ADMOB_APP_ID_IOS = "ca-app-pub-xxxxxxxxxxxxxxxx";

// Test IDs (safe to use for development - don't use real IDs during testing!)
const REWARDED_AD_ID_ANDROID = "ca-app-pub-3940256099942544/5224354917";
const REWARDED_AD_ID_IOS = "ca-app-pub-3940256099942544/1712485313";
const INTERSTITIAL_AD_ID_ANDROID = "ca-app-pub-3940256099942544/1033173712";
const INTERSTITIAL_AD_ID_IOS = "ca-app-pub-3940256099942544/4411468910";

let admobInitialized = false;

export async function initAdMob() {
  if (admobInitialized) return;

  try {
    const platform = Capacitor.getPlatform();
    const appId = platform === "ios" ? ADMOB_APP_ID_IOS : ADMOB_APP_ID_ANDROID;

    await AdMob.initialize({ appId });
    admobInitialized = true;
    console.log("✅ AdMob initialized");
  } catch (error) {
    console.error("❌ AdMob init failed:", error);
  }
}

export async function showRewardedAd(): Promise<boolean> {
  try {
    const platform = Capacitor.getPlatform();
    const unitId =
      platform === "ios" ? REWARDED_AD_ID_IOS : REWARDED_AD_ID_ANDROID;

    await AdMob.loadRewardedAd({ adId: unitId, isTesting: true });
    await AdMob.showRewardedAd();
    console.log("✅ Rewarded ad shown");
    return true;
  } catch (error) {
    console.error("❌ Rewarded ad failed:", error);
    return false;
  }
}

export async function showInterstitialAd(): Promise<void> {
  try {
    const platform = Capacitor.getPlatform();
    const unitId =
      platform === "ios" ? INTERSTITIAL_AD_ID_IOS : INTERSTITIAL_AD_ID_ANDROID;

    await AdMob.loadInterstitialAd({ adId: unitId, isTesting: true });
    await AdMob.showInterstitialAd();
    console.log("✅ Interstitial ad shown");
  } catch (error) {
    console.error("❌ Interstitial ad failed:", error);
  }
}
