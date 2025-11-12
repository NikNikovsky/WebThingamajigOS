import { writable } from 'svelte/store';
import type { Window } from '../types/window';
import { processStore } from './processStore';

function createWindowStore() {
  const { subscribe, set, update } = writable<Window[]>([]);

  return {
    subscribe,
    openWindow: (window: Window) => {
      // Register process when window opens
      const pid = processStore.registerProcess(window.id, window.appName);
      update(windows => [...windows, { ...window, zIndex: windows.length }]);
    },
    closeWindow: (id: string) => {
      // Unregister process when window closes
      processStore.unregisterProcess(id);
      update(windows => windows.filter(w => w.id !== id));
    },
    focusWindow: (id: string) => {
      update(windows => {
        const maxZIndex = Math.max(...windows.map(w => w.zIndex), 0);
        return windows.map(w =>
          w.id === id ? { ...w, zIndex: maxZIndex + 1, isFocused: true } : { ...w, isFocused: false }
        );
      });
    },
    moveWindow: (id: string, x: number, y: number) =>
      update(windows =>
        windows.map(w =>
          w.id === id ? { ...w, x, y } : w
        )
      ),
    minimizeWindow: (id: string) =>
      update(windows =>
        windows.map(w =>
          w.id === id ? { ...w, isMinimized: true } : w
        )
      ),
    restoreWindow: (id: string) =>
      update(windows =>
        windows.map(w =>
          w.id === id ? { ...w, isMinimized: false } : w
        )
      ),
    resizeWindow: (id: string, width: number, height: number) =>
      update(windows =>
        windows.map(w =>
          w.id === id ? { ...w, width, height } : w
        )
      ),
    updateWindowTitle: (id: string, title: string) =>
      update(windows =>
        windows.map(w =>
          w.id === id ? { ...w, title } : w
        )
      ),
  };
}

export const windowStore = createWindowStore();