import { create } from 'zustand';

export const backgroundScenes = {
  'default': { name: 'Default', label: 'Pure Dark' },
  'deep-space': { name: 'Deep Space', label: 'Stars' },
  'cozy-rain': { name: 'Cozy Rain', label: 'Rain' },
  'northern-lights': { name: 'Northern Lights', label: 'Aurora' },
  'midnight-ocean': { name: 'Midnight Ocean', label: 'Ocean' },
  'warm-cafe': { name: 'Warm Cafe', label: 'Cafe' },
} as const;

export type BackgroundScene = keyof typeof backgroundScenes;

interface BackgroundStore {
  active: BackgroundScene;
  images: { [key: string]: string | null };
  setScene: (scene: BackgroundScene) => void;
}

export const useBackgroundStore = create<BackgroundStore>((set) => ({
  active: 'default',
  images: {},
  setScene: (scene) => set({ active: scene }),
}));
