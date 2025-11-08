import { useRef, useCallback } from "react";

type SoundType = "start" | "correct" | "skip" | "timeout" | "tick";

export function useSoundEffects(enabled: boolean) {
  const audioContextRef = useRef<AudioContext | null>(null);

  const getAudioContext = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  };

  const playTone = useCallback((frequency: number, duration: number, type: OscillatorType = "sine") => {
    if (!enabled) return;

    try {
      const ctx = getAudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = type;

      gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration);
    } catch (error) {
      console.error("Sound playback error:", error);
    }
  }, [enabled]);

  const playSound = useCallback((sound: SoundType) => {
    switch (sound) {
      case "start":
        playTone(523.25, 0.15);
        setTimeout(() => playTone(659.25, 0.15), 100);
        setTimeout(() => playTone(783.99, 0.2), 200);
        break;

      case "correct":
        playTone(659.25, 0.1);
        setTimeout(() => playTone(783.99, 0.15), 80);
        break;

      case "skip":
        playTone(392, 0.1, "sine");
        break;

      case "timeout":
        playTone(196, 0.3, "square");
        setTimeout(() => playTone(185, 0.3, "square"), 200);
        break;

      case "tick":
        playTone(440, 0.05);
        break;
    }

    if (enabled && "vibrate" in navigator) {
      switch (sound) {
        case "correct":
          navigator.vibrate(50);
          break;
        case "skip":
          navigator.vibrate(30);
          break;
        case "timeout":
          navigator.vibrate([100, 50, 100]);
          break;
      }
    }
  }, [playTone, enabled]);

  return { playSound };
}
