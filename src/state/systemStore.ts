import { writable } from 'svelte/store';
import type { SystemState } from '../types/system';

const initialState: SystemState = {
  bootTime: new Date(),
  theme: 'dark',
  locale: 'en-US',
  runningApps: [],
};

export const systemStore = writable<SystemState>(initialState);