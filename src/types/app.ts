export interface AppMetadata {
  name: string;
  title: string;
  icon: string;
  component: any;  // Svelte component
  system?: boolean;
  defaultWindow: {
    width: number;
    height: number;
    x?: number;
    y?: number;
  };
}