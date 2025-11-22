import { writable } from 'svelte/store';

export type Mode = 'offline' | 'localhost' | null;

export interface Settings {
  mode: Mode;
  serverUrl: string | null;
  hasCompletedOOBE: boolean;
  isLoggedIn: boolean;
  currentUser: {
    username: string;
    isGuest: boolean;
  } | null;
}

const defaultSettings: Settings = {
  mode: null,
  serverUrl: null,
  hasCompletedOOBE: false,
  isLoggedIn: false,
  currentUser: null,
};

// Helper to load from localStorage
function loadSettings(): Settings {
  if (typeof window === 'undefined') return defaultSettings;
  
  try {
    const stored = localStorage.getItem('fatuus-settings');
    if (stored) {
      return { ...defaultSettings, ...JSON.parse(stored) };
    }
  } catch (e) {
    console.error('Failed to load settings from localStorage:', e);
  }
  
  return defaultSettings;
}

// Helper to save to localStorage
function saveSettings(settings: Settings) {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem('fatuus-settings', JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings to localStorage:', e);
  }
}

// Create the store
function createSettingsStore() {
  const initialSettings = loadSettings();
  const { subscribe, set, update } = writable<Settings>(initialSettings);

  return {
    subscribe,
    
    // Set mode and server URL
    setMode: (mode: Mode, serverUrl: string | null = null) => {
      update(settings => {
        const updated = { ...settings, mode, serverUrl };
        saveSettings(updated);
        return updated;
      });
    },

    // Mark OOBE as completed
    completeOOBE: () => {
      update(settings => {
        const updated = { ...settings, hasCompletedOOBE: true };
        saveSettings(updated);
        return updated;
      });
    },

    // Login user
    login: (username: string, isGuest: boolean = false) => {
      update(settings => {
        const updated = {
          ...settings,
          isLoggedIn: true,
          currentUser: { username, isGuest },
        };
        saveSettings(updated);
        return updated;
      });
    },

    // Logout user
    logout: () => {
      update(settings => {
        const updated = {
          ...settings,
          isLoggedIn: false,
          currentUser: null,
        };
        saveSettings(updated);
        return updated;
      });
    },

    // Reset to defaults (for testing)
    reset: () => {
      set(defaultSettings);
      saveSettings(defaultSettings);
    },
  };
}

export const settingsStore = createSettingsStore();
