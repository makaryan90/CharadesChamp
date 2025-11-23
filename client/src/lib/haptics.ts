import { Haptics, ImpactStyle } from "@capacitor/haptics";

/**
 * Trigger a haptic feedback (phone vibration)
 * @param style - 'light', 'medium', or 'heavy'
 *
 * Example:
 * triggerHaptic('light')   // Subtle vibration
 * triggerHaptic('medium')  // Normal vibration
 * triggerHaptic('heavy')   // Strong vibration
 */
export async function triggerHaptic(
  style: "light" | "medium" | "heavy" = "medium",
) {
  try {
    const styleMap = {
      light: ImpactStyle.Light,
      medium: ImpactStyle.Medium,
      heavy: ImpactStyle.Heavy,
    };
    await Haptics.impact({ style: styleMap[style] });
  } catch (error) {
    // Haptics not available on web/emulator - silently fail
    console.debug("Haptics not available");
  }
}

/**
 * Trigger selection feedback (quick double vibration)
 * Used when user selects/taps something
 */
export async function triggerSelection() {
  try {
    await Haptics.selectionStart();
    // End after 50ms
    setTimeout(() => Haptics.selectionEnd(), 50);
  } catch (error) {
    // Silently fail
    console.debug("Selection haptics not available");
  }
}

/**
 * Trigger notification feedback
 * Used to indicate success/warning/error
 */
export async function triggerNotification(
  type: "success" | "warning" | "error" = "success",
) {
  try {
    // Map notification types to impact styles for now
    const styleMap = {
      success: ImpactStyle.Medium,
      warning: ImpactStyle.Medium,
      error: ImpactStyle.Heavy,
    };
    await Haptics.impact({ style: styleMap[type] });
  } catch (error) {
    // Silently fail
    console.debug("Notification haptics not available");
  }
}
