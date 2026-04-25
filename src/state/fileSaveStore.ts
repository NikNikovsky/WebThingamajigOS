import { writable } from 'svelte/store';

interface SavedFile {
  name: string;
  path: string;
  content: string;
  lastSaved: Date;
}

function createFileSaveStore() {
  const basePath = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');

  const mockFileContents: { [key: string]: string } = {
    '/how to build a nuclear reactor.txt': `dont();`,

    '/Documents/User Guide.pdf': `# User Guide

Welcome to Fatuus OS!

This is a mock PDF file displayed as text.
In a real implementation, you'd need a PDF viewer.

## Getting Started
- Use the File Manager to browse files
- Double-click files to open them
- Use the Text Editor for text files
- Use the Jukebox for audio files

Have fun exploring!`,

    '/Documents/Evidence that Spy had contact with Scout\'s mother.zip': `[This is a zip file - cannot be displayed as text]
Mock content for a zipped archive.`,

    '/Pictures/good moaning.jpg': basePath + '/images/good-moaning.jpg',
    '/Pictures/genocide.png': basePath + '/images/genocide.png',
    '/Music/Mister_Sandman.mp3': basePath + '/music/Mister_Sandman.mp3',
    '/Music/DeviatedMachinations.ogg': basePath + '/music/DeviatedMachinations.ogg',
  };

  const { subscribe, set, update } = writable(mockFileContents);

  function saveFile(path: string, content: string): void {
    update(files => ({
      ...files,
      [path]: content
    }));
    
    console.log(`[FileSaveStore] File saved: ${path}`);
  }

  function getFile(path: string): string | undefined {
    let result: string | undefined;
    subscribe(files => {
      result = files[path];
    })();
    return result;
  }

  function getAllFiles(): { [key: string]: string } {
    let result: { [key: string]: string } = {};
    subscribe(files => {
      result = files;
    })();
    return result;
  }

  function deleteFile(path: string): void {
    update(files => {
      const newFiles = { ...files };
      delete newFiles[path];
      return newFiles;
    });
    
    console.log(`[FileSaveStore] File deleted: ${path}`);
  }

  return {
    subscribe,
    saveFile,
    getFile,
    getAllFiles,
    deleteFile,
  };
}

export const fileSaveStore = createFileSaveStore();
