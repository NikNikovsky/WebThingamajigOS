import { writable } from 'svelte/store';

export interface FileDialogRequest {
  isOpen: boolean;
  requestedBy: string | null;  // app name requesting
  selectedFile: { name: string; path: string; content: string; type: string; size: string } | null;
  currentlyOpen: { name: string; path: string; content: string; type: string; size: string } | null;  // currently open file in app
}

export const fileDialogStore = writable<FileDialogRequest>({
  isOpen: false,
  requestedBy: null,
  selectedFile: null,
  currentlyOpen: null,
});

export function openFileDialog(appName: string) {
  fileDialogStore.update((state: FileDialogRequest) => ({
    ...state,
    isOpen: true,
    requestedBy: appName
  }));
}

export function closeFileDialog() {
  fileDialogStore.update((state: FileDialogRequest) => ({
    ...state,
    isOpen: false
  }));
}

export function setCurrentlyOpen(file: { name: string; path: string; content: string; type: string; size: string } | null) {
  fileDialogStore.update((state: FileDialogRequest) => ({
    ...state,
    currentlyOpen: file
  }));
}