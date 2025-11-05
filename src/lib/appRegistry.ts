import type { AppMetadata } from '../types/app';
import TextManipulator from '../apps/TextManipulator/TextManipulator.svelte';  
import FileMangler from '../apps/FileMangler/FileMangler.svelte';  

export const appRegistry: Map<string, AppMetadata> = new Map([
   ['TextManipulator', {
     name: 'TextManipulator',
     title: 'Text Changer',
     icon: 'file-text',
     component: TextManipulator,
     defaultWindow: { width: 800, height: 600 }
   }],
   ['FileMangler', {
     name: 'FileMangler',
     title: 'Cow Mangler 3000',
     icon: 'folder',
     component: FileMangler,
     defaultWindow: { width: 1024, height: 768 }
   }],
]);

export function getApp(name: string): AppMetadata | undefined {
  return appRegistry.get(name);
}