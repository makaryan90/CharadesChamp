import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.charadesparty.app',
  appName: 'Charades Party!',
  webDir: 'dist',            // ← THIS IS THE ONLY LINE THAT MATTERS
  bundledWebRuntime: false
};

export default config;