export interface Window {
  id: string;
  title: string;
  appName: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  isMinimized: boolean;
  isMaximized: boolean;
  isFocused: boolean;
}

export interface WindowAction {
  type: 'CREATE' | 'CLOSE' | 'MINIMIZE' | 'MAXIMIZE' | 'MOVE' | 'RESIZE' | 'FOCUS';
  payload: Partial<Window>;
}