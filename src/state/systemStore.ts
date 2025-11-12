import { writable } from 'svelte/store';
import type { SystemState } from '../types/system';

export function generateRandomGradient(): string {
  const colors = [
    '#667eea', '#764ba2',  // Current purple
    '#f093fb', '#f5576c',  // Pink/Red
    '#4facfe', '#00f2fe',  // Cyan/Blue
    '#43e97b', '#38f9d7',  // Green
    '#fa709a', '#fee140',  // Orange/Yellow
  ];
  
  const color1 = colors[Math.floor(Math.random() * colors.length)];
  const color2 = colors[Math.floor(Math.random() * colors.length)];
  
  return `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`;
}
export function generateTheme() {
  const colors = [
    '#667eea', '#764ba2',
    '#f093fb', '#f5576c',
    '#4facfe', '#00f2fe',
    '#43e97b', '#38f9d7',
    '#fa709a', '#fee140',
  ];
  
  const color1 = colors[Math.floor(Math.random() * colors.length)];
  const color2 = colors[Math.floor(Math.random() * colors.length)];
  
  return {
    accentColor: color1,
    wallpaperGradient: `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`
  };
}
const theme = generateTheme();
const initialState: SystemState = {
  bootTime: new Date(),
  theme: 'dark',
  locale: 'en-US',
  runningApps: [],
  wallpaperGradient: theme.wallpaperGradient,
  accentColor: theme.accentColor,
  version: __GIT_HASH__,
};

export const systemStore = writable<SystemState>(initialState);