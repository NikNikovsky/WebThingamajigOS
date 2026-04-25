import type { AppMetadata } from '../types/app';
import TextManipulator from '../apps/TextManipulator/TextManipulator.svelte';  
import FileMangler from '../apps/FileMangler/FileMangler.svelte';  
import Jukebox from '../apps/Jukebox/Jukebox.svelte';
import TasqueMangler from '../apps/TasqueMangler/TasqueMangler.svelte';
import Settings from '../apps/Settings/Settings.svelte';
import Ultrakill from '../apps/Ultrakill/Ultrakill.svelte';
import PictureViewer from '../apps/PictureViewer/PictureViewer.svelte';

export const appRegistry: Map<string, AppMetadata> = new Map([
   ['TextManipulator', {
     name: 'TextManipulator',
     title: 'Text Changer',
     icon: 'file-text',
     component: TextManipulator,
     system: false,
     defaultWindow: { width: 800, height: 600 }
   }],
   ['FileMangler', {
     name: 'FileMangler',
     title: 'Cow Mangler 3000',
     icon: 'folder',
     component: FileMangler,
     system: false,
     defaultWindow: { width: 1024, height: 768 }
   }],
   ['Jukebox', {
    name: 'Jukebox',
    title: 'Jukebox',
    icon: 'music',
    component: Jukebox,
    system: false,
    defaultWindow: { width: 640, height: 480 },
   }],
   ['TasqueMangler', {
    name: 'TasqueMangler',
    title: 'Tasque Mangler',
    icon: 'tasks',
    component: TasqueMangler,
    system: false,
    defaultWindow: { width: 800, height: 600 }
  }],
  ['Settings', {
    name: 'Settings',
    title: 'Settings',
    icon: 'cog',
    component: Settings,
    system: false,
    defaultWindow: { width: 800, height: 600 }
   }],
   ['Ultrakill', {
    name: 'Ultrakill',
    title: 'Ultrakill',
    icon: '⚡',
    component: Ultrakill,
    system: true,
    defaultWindow: { width: 600, height: 500 }
   }],
   ['PictureViewer', {
    name: 'PictureViewer',
    title: 'Picture Viewer',
    icon: 'image',
    component: PictureViewer,
    system: true,
    defaultWindow: { width: 1024, height: 768 }
   }]
]);

export function getApp(name: string): AppMetadata | undefined {
  return appRegistry.get(name);
}