export interface SystemState {
  bootTime: Date;
  theme: 'light' | 'dark';
  locale: string;
  runningApps: string[];  // App IDeez nuts
  wallpaperGradient: string; 
  accentColor: string;
  version: string;
}