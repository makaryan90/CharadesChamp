import * as Purchases from "@revenuecat/purchases-capacitor";
import { Capacitor } from "@capacitor/core";

// PLACEHOLDER keys - you'll get real ones from RevenueCat later
// For now, these are just placeholders and won't work in production
const REVENUECAT_API_KEY_ANDROID = "goog_YOUR_ANDROID_KEY_HERE";
const REVENUECAT_API_KEY_IOS = "appl_YOUR_IOS_KEY_HERE";

// These are your product IDs - they must match what you create in App Store & Google Play
export const PRODUCT_IDS = {
  MONTHLY: "charades_monthly", // $3.99/month
  YEARLY: "charades_yearly", // $19.99/year
  LIFETIME: "charades_lifetime", // $29.99 one-time
};

// This is the entitlement ID - what you check for premium access
export const ENTITLEMENT_ID = "premium_access";

let isInitialized = false;

export async function initRevenueCat() {
  if (isInitialized) return;

  try {
    const platform = Capacitor.getPlatform();
    const apiKey =
      platform === "ios" ? REVENUECAT_API_KEY_IOS : REVENUECAT_API_KEY_ANDROID;

    await Purchases.setDebugLogsEnabled({ enabled: true });
    await Purchases.configure({
      apiKey,
      appUserID: undefined, // RevenueCat generates unique ID automatically
    });

    isInitialized = true;
    console.log("✅ RevenueCat initialized");
  } catch (error) {
    console.error("❌ RevenueCat init failed:", error);
  }
}

export async function getProducts() {
  try {
    const offerings = await Purchases.getOfferings();
    return offerings.current?.availablePackages || [];
  } catch (error) {
    console.error("❌ Failed to fetch products:", error);
    return [];
  }
}

export async function purchaseProduct(productId: string) {
  try {
    const packages = await Purchases.getOfferings();
    const pkg = packages.current?.availablePackages.find(
      (p) => p.identifier === productId,
    );

    if (!pkg) throw new Error("Product not found");

    const result = await Purchases.purchasePackage({ aPackage: pkg });
    return result;
  } catch (error) {
    console.error("❌ Purchase failed:", error);
    throw error;
  }
}

export async function isPremium() {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    return !!customerInfo.entitlements.active[ENTITLEMENT_ID];
  } catch (error) {
    console.error("❌ Failed to check premium status:", error);
    return false;
  }
}

export async function restorePurchases() {
  try {
    await Purchases.restorePurchases();
    return await isPremium();
  } catch (error) {
    console.error("❌ Restore failed:", error);
    throw error;
  }
}
