import { writable } from 'svelte/store';

export interface LastFile {
  name: string;
  path: string;
  content: string;
  type: string;
  size: string;
}

function createLastFileStore() {
  const DEFAULT_LAST_FILE: LastFile | null = null;

  function loadLastFile(): LastFile | null {
    if (typeof window === 'undefined') {
      return DEFAULT_LAST_FILE;
    }

    try {
      const stored = localStorage.getItem('fatuus_last_file');
      return stored ? JSON.parse(stored) : DEFAULT_LAST_FILE;
    } catch (error) {
      console.error('Failed to load last file:', error);
      return DEFAULT_LAST_FILE;
    }
  }

  const { subscribe, set, update } = writable(loadLastFile());

  return {
    subscribe,
    setLastFile: (file: LastFile | null) => {
      if (typeof window !== 'undefined') {
        if (file) {
          localStorage.setItem('fatuus_last_file', JSON.stringify(file));
        } else {
          localStorage.removeItem('fatuus_last_file');
        }
      }
      set(file);
    },
    clearLastFile: () => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('fatuus_last_file');
      }
      set(null);
    }
  };
}

export const lastFileStore = createLastFileStore();
