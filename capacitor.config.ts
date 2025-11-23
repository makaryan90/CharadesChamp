import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.charadesparty.app',
  appName: 'Charades Party',
  webDir: 'dist/public',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    // AdMob configuration
    AdMob: {
      // ← REPLACE WITH YOUR REAL APP IDs HERE
      // iOS: ca-app-pub-xxxxxxxxxxxxxxxx~yyyyyyyyyy
      // Android: ca-app-pub-xxxxxxxxxxxxxxxx~zzzzzzzzzz
      appId: '',
    },
    // Camera configuration for video recording
    Camera: {
      permissions: ['photos', 'video'],
    },
    // Haptics for vibration feedback
    Haptics: {},
    // Share plugin for video sharing
    Share: {},
  },
};

export default config;
