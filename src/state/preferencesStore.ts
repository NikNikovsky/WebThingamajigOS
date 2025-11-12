import { writable } from 'svelte/store';
import defaultPreferences, { type Preferences } from './defaultPreferences';


// Try to load from localStorage, fall back to defaults
function loadPreferences(): Preferences {
  if (typeof window === 'undefined') {
    return defaultPreferences;
  }

  try {
    const stored = localStorage.getItem('fatuus_preferences');
    if (stored) {
      return { ...defaultPreferences, ...JSON.parse(stored) };
    }
  } catch (e) {
    console.error('Failed to load preferences:', e);
  }

  return defaultPreferences;
}

// Create store
function createPreferencesStore() {
  const { subscribe, set, update } = writable<Preferences>(loadPreferences());

  return {
    subscribe,
    set: (prefs: Preferences) => {
      // Persist to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('fatuus_preferences', JSON.stringify(prefs));
      }
      set(prefs);
    },
    update: (fn: (p: Preferences) => Preferences) => {
      update((current) => {
        const updated = fn(current);
        // Persist to localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('fatuus_preferences', JSON.stringify(updated));
        }
        return updated;
      });
    },
    reset: () => {
      set(defaultPreferences);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('fatuus_preferences');
      }
    },
  };
}

export const preferencesStore = createPreferencesStore();
