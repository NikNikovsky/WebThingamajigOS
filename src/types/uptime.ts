import { systemStore } from '../state/systemStore';
import { get } from 'svelte/store';

export interface Uptime {
    seconds: number;
    minutes: number;
    hours: number;
}

export function getUptime(): number {
  // Use the 'get' function to retrieve the current store value
  const state = get(systemStore);
  return Math.floor((Date.now() - state.bootTime.getTime()) / 1000);
}

export function formatUptime(seconds: number): Uptime {
  return {
    seconds: seconds % 60,
    minutes: Math.floor((seconds % 3600) / 60),
    hours: Math.floor(seconds / 3600)
  };
}