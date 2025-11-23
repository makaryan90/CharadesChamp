import { Capacitor } from "@capacitor/core";

// PLACEHOLDER keys - Replace with YOUR keys from RevenueCat dashboard
// ← REPLACE WITH YOUR REAL KEY HERE (from https://dashboard.revenuecat.com)
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
let Purchases: any = null;

// Dynamically import RevenueCat only on native platforms
async function getPurchasesModule() {
  if (Purchases) return Purchases;

  const platform = Capacitor.getPlatform();
  // Only import on native platforms (ios, android)
  if (platform === "ios" || platform === "android") {
    try {
      Purchases = await import("@revenuecat/purchases-capacitor");
      return Purchases;
    } catch (e) {
      console.log("⚠️ RevenueCat not available on this platform");
      return null;
    }
  }
  return null;
}

export async function initRevenueCat() {
  if (isInitialized) return;

  try {
    const Purchases = await getPurchasesModule();
    if (!Purchases) {
      console.log("ℹ️ RevenueCat: Web environment - using trial deck only");
      isInitialized = true;
      return;
    }

    const platform = Capacitor.getPlatform();
    const apiKey =
      platform === "ios" ? REVENUECAT_API_KEY_IOS : REVENUECAT_API_KEY_ANDROID;

    // Configure RevenueCat
    await (Purchases as any).Purchases.setDebugLogsEnabled({ enabled: true });
    await (Purchases as any).Purchases.configure({
      apiKey,
      appUserID: undefined,
    });

    isInitialized = true;
    console.log("✅ RevenueCat initialized");
  } catch (error) {
    console.error("❌ RevenueCat init failed:", error);
  }
}

export async function getProducts() {
  try {
    const Purchases = await getPurchasesModule();
    if (!Purchases) return [];

    const offerings = await (Purchases as any).Purchases.getOfferings();
    return offerings.current?.availablePackages || [];
  } catch (error) {
    console.error("❌ Failed to fetch products:", error);
    return [];
  }
}

export async function purchaseProduct(productId: string) {
  try {
    const Purchases = await getPurchasesModule();
    if (!Purchases) throw new Error("RevenueCat not available");

    const packages = await (Purchases as any).Purchases.getOfferings();
    const pkg = packages.current?.availablePackages.find(
      (p: any) => p.identifier === productId,
    );

    if (!pkg) throw new Error("Product not found");

    const result = await (Purchases as any).Purchases.purchasePackage({
      aPackage: pkg,
    });
    return result;
  } catch (error) {
    console.error("❌ Purchase failed:", error);
    throw error;
  }
}

export async function isPremium() {
  try {
    const Purchases = await getPurchasesModule();
    if (!Purchases) {
      // Web environment - only check trial deck
      return false;
    }

    const customerInfo = await (Purchases as any).Purchases.getCustomerInfo();
    return !!customerInfo.entitlements.active[ENTITLEMENT_ID];
  } catch (error) {
    console.error("❌ Failed to check premium status:", error);
    return false;
  }
}

export async function restorePurchases() {
  try {
    const Purchases = await getPurchasesModule();
    if (!Purchases) throw new Error("RevenueCat not available");

    await (Purchases as any).Purchases.restorePurchases();
    return await isPremium();
  } catch (error) {
    console.error("❌ Restore failed:", error);
    throw error;
  }
}
