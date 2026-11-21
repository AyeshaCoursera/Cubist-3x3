/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ThemeConfig, ThemeName } from '../types/cube';

export const CUBE_THEMES: Record<ThemeName, ThemeConfig> = {
  classic: {
    id: 'classic',
    name: 'WCA Tournament',
    bodyColor: '#18181b', // Matte dark polymer core
    roughness: 0.35,
    metalness: 0.05,
    colors: {
      white: '#F8FAFC',
      yellow: '#FACC15',
      orange: '#FB923C',
      red: '#EF4444',
      green: '#22C55E',
      blue: '#2563EB',
    },
  },
  neon: {
    id: 'neon',
    name: 'Cyberpunk Neon',
    bodyColor: '#09090b',
    roughness: 0.2,
    metalness: 0.4,
    colors: {
      white: '#F0FDFA',
      yellow: '#FEF08A',
      orange: '#F97316',
      red: '#F43F5E',
      green: '#10B981',
      blue: '#06B6D4',
    },
  },
  pastel: {
    id: 'pastel',
    name: 'Nordic Pastel',
    bodyColor: '#27272a',
    roughness: 0.45,
    metalness: 0.0,
    colors: {
      white: '#F1F5F9',
      yellow: '#FDE047',
      orange: '#FDBA74',
      red: '#F87171',
      green: '#86EFAC',
      blue: '#93C5FD',
    },
  },
  carbon: {
    id: 'carbon',
    name: 'Carbon Fiber',
    bodyColor: '#121214',
    roughness: 0.25,
    metalness: 0.6,
    colors: {
      white: '#E2E8F0',
      yellow: '#EAB308',
      orange: '#EA580C',
      red: '#DC2626',
      green: '#16A34A',
      blue: '#1D4ED8',
    },
  },
  'wood-gold': {
    id: 'wood-gold',
    name: 'Rosewood & Gold',
    bodyColor: '#2b1b17',
    roughness: 0.3,
    metalness: 0.5,
    colors: {
      white: '#FAF5EF',
      yellow: '#E6C687',
      orange: '#C86D51',
      red: '#962D2D',
      green: '#4D7C5D',
      blue: '#3A5A78',
    },
  },
};
