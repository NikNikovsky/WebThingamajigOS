import type { AppMetadata } from '../types/app';
import TextManipulator from '../apps/TextManipulator/TextManipulator.svelte';  
import FileMangler from '../apps/FileMangler/FileMangler.svelte';  
import Jukebox from '../apps/Jukebox/Jukebox.svelte';
import TasqueMangler from '../apps/TasqueMangler/TasqueMangler.svelte';
import Settings from '../apps/Settings/Settings.svelte';
import Ultrakill from '../apps/Ultrakill/Ultrakill.svelte';

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
   ['Jukebox', {
    name: 'Jukebox',
    title: 'Jukebox',
    icon: 'music',
    component: Jukebox,
    defaultWindow: { width: 640, height: 480 },
   }],
   ['TasqueMangler', {
    name: 'TasqueMangler',
    title: 'Tasque Mangler',
    icon: 'tasks',
    component: TasqueMangler,
    defaultWindow: { width: 800, height: 600 }
  }],
  ['Settings', {
    name: 'Settings',
    title: 'Settings',
    icon: 'cog',
    component: Settings,
    defaultWindow: { width: 800, height: 600 }
   }],
   ['Ultrakill', {
    name: 'Ultrakill',
    title: 'Ultrakill',
    icon: '⚡',
    component: Ultrakill,
    defaultWindow: { width: 600, height: 500 }
   }]
]);

export function getApp(name: string): AppMetadata | undefined {
  return appRegistry.get(name);
}