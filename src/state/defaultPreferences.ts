export interface Preferences {
  theme: 'light' | 'dark' | 'auto';
  soundEnabled: boolean;
  animations: boolean;
  language: string;
  autoSave: boolean;
  windowSnap: boolean;
  fontSize: 'small' | 'normal' | 'large';
  rememberLastFile: boolean;
}
const defaultPreferences: Preferences = {
  theme: 'dark',
  soundEnabled: true,
  animations: true,
  language: 'en',
  autoSave: true,
  windowSnap: true,
  fontSize: 'normal',
  rememberLastFile: true,
};

export default defaultPreferences;