// File associations: which app opens which file type
// Format: [extension] > [app]

export const fileAssociations: Map<string, string> = new Map([
  // Text files
  ['.txt', 'TextManipulator'],
  ['.md', 'TextManipulator'],
  ['.json', 'TextManipulator'],
  ['.csv', 'TextManipulator'],
  ['.html', 'TextManipulator'],
  ['.css', 'TextManipulator'],
  ['.js', 'TextManipulator'],
  ['.ts', 'TextManipulator'],
  ['.xml', 'TextManipulator'],
  ['.yaml', 'TextManipulator'],
  ['.yml', 'TextManipulator'],
  ['.log', 'TextManipulator'],
  ['.svelte', 'TextManipulator'],
  
  // Image files
  
  // Audio files
  ['.mp3', 'Jukebox'],
  ['.wav', 'Jukebox'],
  ['.flac', 'Jukebox'],
  ['.m4a', 'Jukebox'],
  ['.ogg', 'Jukebox'],
  
  // Documents (could open with TextManipulator for now)
  ['.pdf', 'TextManipulator'],
  ['.doc', 'TextManipulator'],
  ['.docx', 'TextManipulator'],
]);

/**
 * Get the associated app for a file by its extension
 * @param filename - The filename (e.g., "document.txt")
 * @returns The app name, or undefined if no association exists
 */
export function getAppForFile(filename: string): string | undefined {
  const extension = filename.substring(filename.lastIndexOf('.')).toLowerCase();
  return fileAssociations.get(extension);
}
