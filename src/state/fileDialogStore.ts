import { writable } from 'svelte/store';

export interface FileDialogRequest {
  isOpen: boolean;
  requestedBy: string | null;
  requestedByWindowId: string | null;
  selectedFile: { name: string; path: string; content: string; type: string; size: string } | null;
  currentlyOpen: { name: string; path: string; content: string; type: string; size: string } | null;
}

export const fileDialogStore = writable<FileDialogRequest>({
  isOpen: false,
  requestedBy: null,
  requestedByWindowId: null,
  selectedFile: null,
  currentlyOpen: null,
});

export function openFileDialog(appName: string, windowId: string | null = null) {
  fileDialogStore.update((state: FileDialogRequest) => ({
    ...state,
    isOpen: true,
    requestedBy: appName,
    requestedByWindowId: windowId,
    selectedFile: null
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