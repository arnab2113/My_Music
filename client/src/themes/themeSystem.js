export const THEMES = [
  {
    id: 'midnight-cafe',
    name: 'Midnight Café',
    description: 'Warm amber glow, dark coffee shop ambiance with subtle dust motes.',
    colors: {
      bgPrimary: '#0c0a09',
      bgSurface: '#1c1917',
      bgElevated: '#27272a',
      textPrimary: '#fef3c7',
      textSecondary: '#a1a1aa',
      accent: '#f59e0b',
      accentGlow: 'rgba(245, 158, 11, 0.4)',
      border: 'rgba(245, 158, 11, 0.2)'
    },
    particles: 'dust',
    ambience: 'cafe',
    visualizer: 'bars'
  },
  {
    id: 'rainy-window',
    name: 'Rainy Window',
    description: 'Deep navy charcoal atmosphere with cascading rain droplets.',
    colors: {
      bgPrimary: '#090d16',
      bgSurface: '#111827',
      bgElevated: '#1f2937',
      textPrimary: '#e0f2fe',
      textSecondary: '#94a3b8',
      accent: '#06b6d4',
      accentGlow: 'rgba(6, 182, 212, 0.4)',
      border: 'rgba(6, 182, 212, 0.2)'
    },
    particles: 'rain',
    ambience: 'rain',
    visualizer: 'waveform'
  },
  {
    id: 'neon-tokyo',
    name: 'Neon Tokyo',
    description: 'Cyber retro magenta and cyan neon glow.',
    colors: {
      bgPrimary: '#090514',
      bgSurface: '#150d2a',
      bgElevated: '#241445',
      textPrimary: '#f472b6',
      textSecondary: '#a78bfa',
      accent: '#ec4899',
      accentGlow: 'rgba(236, 72, 153, 0.5)',
      border: 'rgba(236, 72, 153, 0.25)'
    },
    particles: 'fireflies',
    ambience: 'city',
    visualizer: 'spectrum'
  },
  {
    id: 'vintage-radio',
    name: 'Vintage Radio',
    description: 'Authentic 90s brass dial radio aesthetic with warm vinyl grooves.',
    colors: {
      bgPrimary: '#120d09',
      bgSurface: '#221912',
      bgElevated: '#33261c',
      textPrimary: '#fde68a',
      textSecondary: '#d97706',
      accent: '#d97706',
      accentGlow: 'rgba(217, 119, 6, 0.4)',
      border: 'rgba(217, 119, 6, 0.25)'
    },
    particles: 'dust',
    ambience: 'vinyl',
    visualizer: 'circle'
  },
  {
    id: 'sunset-drive',
    name: 'Sunset Drive',
    description: 'Warm crimson and terracotta golden hour vibes.',
    colors: {
      bgPrimary: '#140807',
      bgSurface: '#27110e',
      bgElevated: '#3b1c18',
      textPrimary: '#ffedd5',
      textSecondary: '#fb923c',
      accent: '#f97316',
      accentGlow: 'rgba(249, 115, 22, 0.4)',
      border: 'rgba(249, 115, 22, 0.25)'
    },
    particles: 'fireflies',
    ambience: 'fireplace',
    visualizer: 'bars'
  },
  {
    id: 'cosmic-night',
    name: 'Cosmic Night',
    description: 'Deep violet space nebula with sparkling stars.',
    colors: {
      bgPrimary: '#070514',
      bgSurface: '#110c28',
      bgElevated: '#1c153d',
      textPrimary: '#e0e7ff',
      textSecondary: '#818cf8',
      accent: '#6366f1',
      accentGlow: 'rgba(99, 102, 241, 0.4)',
      border: 'rgba(99, 102, 241, 0.25)'
    },
    particles: 'stars',
    ambience: 'ocean',
    visualizer: 'particles'
  },
  {
    id: 'dark-cinema',
    name: 'Dark Cinema',
    description: 'Ultra dark luxury theater mood with gold light accents.',
    colors: {
      bgPrimary: '#050505',
      bgSurface: '#121212',
      bgElevated: '#1e1e1e',
      textPrimary: '#f5f5f5',
      textSecondary: '#737373',
      accent: '#eab308',
      accentGlow: 'rgba(234, 179, 8, 0.4)',
      border: 'rgba(255, 255, 255, 0.12)'
    },
    particles: 'dust',
    ambience: 'vinyl',
    visualizer: 'waveform'
  },
  {
    id: 'forest-midnight',
    name: 'Forest Midnight',
    description: 'Serene dark emerald canopy with glowing fireflies.',
    colors: {
      bgPrimary: '#040d09',
      bgSurface: '#0a1d15',
      bgElevated: '#122c21',
      textPrimary: '#dcfce7',
      textSecondary: '#4ade80',
      accent: '#10b981',
      accentGlow: 'rgba(16, 185, 129, 0.4)',
      border: 'rgba(16, 185, 129, 0.25)'
    },
    particles: 'fireflies',
    ambience: 'forest',
    visualizer: 'spectrum'
  },
  {
    id: 'ocean-night',
    name: 'Ocean Night',
    description: 'Deep abyss teal waves with soothing sea soundscapes.',
    colors: {
      bgPrimary: '#030f14',
      bgSurface: '#081e28',
      bgElevated: '#0f2d3d',
      textPrimary: '#ccfbf1',
      textSecondary: '#2dd4bf',
      accent: '#14b8a6',
      accentGlow: 'rgba(20, 184, 166, 0.4)',
      border: 'rgba(20, 184, 166, 0.25)'
    },
    particles: 'rain',
    ambience: 'ocean',
    visualizer: 'waveform'
  },
  {
    id: '90s-nostalgia',
    name: '90s Nostalgia',
    description: 'Classic warm cassette tape brown with gold dial typography.',
    colors: {
      bgPrimary: '#120b06',
      bgSurface: '#20140c',
      bgElevated: '#311f14',
      textPrimary: '#fef3c7',
      textSecondary: '#b45309',
      accent: '#f59e0b',
      accentGlow: 'rgba(245, 158, 11, 0.4)',
      border: 'rgba(245, 158, 11, 0.25)'
    },
    particles: 'dust',
    ambience: 'vinyl',
    visualizer: 'circle'
  }
];

export const applyThemeTokens = (themeId, customAccent = null) => {
  const theme = THEMES.find((t) => t.id === themeId) || THEMES[0];
  const root = document.documentElement;

  const accentColor = customAccent || theme.colors.accent;

  root.style.setProperty('--bg-primary', theme.colors.bgPrimary);
  root.style.setProperty('--bg-surface', theme.colors.bgSurface);
  root.style.setProperty('--bg-elevated', theme.colors.bgElevated);
  root.style.setProperty('--text-primary', theme.colors.textPrimary);
  root.style.setProperty('--text-secondary', theme.colors.textSecondary);
  root.style.setProperty('--accent', accentColor);
  root.style.setProperty('--accent-glow', theme.colors.accentGlow);
  root.style.setProperty('--border', theme.colors.border);

  return theme;
};
