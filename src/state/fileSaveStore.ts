import { writable } from 'svelte/store';

interface SavedFile {
  name: string;
  path: string;
  content: string;
  lastSaved: Date;
}

function createFileSaveStore() {
  // Initialize with mock file system from FileMangler
  const mockFileContents: { [key: string]: string } = {
    '/how to build a nuclear reactor.txt': `# How to Build a Nuclear Reactor

## WARNING: This is satirical and fictional!

1. First, obtain some uranium... just kidding, don't do that.
2. This is a joke file created for demonstration purposes.
3. Nuclear science is actually super complex and requires years of study.
4. Please don't try this at home!

## Actual Nuclear Facts:
- Nuclear reactions power about 10% of the world's electricity
- Modern nuclear plants have multiple safety systems
- Nuclear waste is handled very carefully
- Proper training and licensing is absolutely required

Stay safe! 😄`,
    
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
