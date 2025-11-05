export interface SystemState {
  bootTime: Date;
  theme: 'light' | 'dark';
  locale: string;
  runningApps: string[];  // App IDs
}