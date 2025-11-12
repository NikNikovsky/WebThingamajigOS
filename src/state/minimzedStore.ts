import { writable } from 'svelte/store';

function createMinimizedStore() {
  const { subscribe, set, update } = writable<string[]>([]);

  return {
    subscribe,
    minimize: (windowId: string) =>
      update(minimized => [...minimized, windowId]),
    restore: (windowId: string) =>
      update(minimized => minimized.filter(id => id !== windowId)),
  };
}

export const minimizedStore = createMinimizedStore();