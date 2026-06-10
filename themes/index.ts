export type ThemeName = keyof typeof themes;

export interface Theme {
  name: string;
  colors: {
    bg: string;
    surface: string;
    border: string;
    text: string;
    textMuted: string;
    accent: string;
    primary: string;
  };
  borderRadius: number;
  fonts: {
    mono: string;
    sans: string;
  };
}

export const themes = {
  'dark-terminal': {
    name: 'Dark Terminal',
    colors: {
      bg: '#0A0A0A',
      surface: '#121212',
      border: '#262626',
      text: '#F5F5F5',
      textMuted: '#737373',
      accent: '#FFFFFF',
      primary: '#FFFFFF',
    },
    borderRadius: 4,
    fonts: {
      mono: 'monospace',
      sans: 'system-ui, sans-serif',
    },
  },
  'cozy-forest': {
    name: 'Cozy Forest',
    colors: {
      bg: '#0F1A0F',
      surface: '#1A2E1A',
      border: '#2D4A2D',
      text: '#E8F0E8',
      textMuted: '#7A9A7A',
      accent: '#A8D8A8',
      primary: '#6BBF6B',
    },
    borderRadius: 8,
    fonts: {
      mono: 'monospace',
      sans: 'system-ui, sans-serif',
    },
  },
  'cyber-neon': {
    name: 'Cyber Neon',
    colors: {
      bg: '#0A001A',
      surface: '#1A0033',
      border: '#330066',
      text: '#F0E6FF',
      textMuted: '#8866AA',
      accent: '#FF66FF',
      primary: '#00FFFF',
    },
    borderRadius: 4,
    fonts: {
      mono: 'monospace',
      sans: 'system-ui, sans-serif',
    },
  },
  'midnight-ocean': {
    name: 'Midnight Ocean',
    colors: {
      bg: '#0A1628',
      surface: '#122240',
      border: '#1E3A5F',
      text: '#E0EAF5',
      textMuted: '#6A8FAD',
      accent: '#4DA8FF',
      primary: '#2196F3',
    },
    borderRadius: 8,
    fonts: {
      mono: 'monospace',
      sans: 'system-ui, sans-serif',
    },
  },
} as const;
