/**
 * BevGenie Design System Colors
 * Premium B2B SaaS Color Palette
 */

export const COLORS = {
  // Primary Colors
  navy: '#0A1930',
  cyan: '#00C8FF',
  copper: '#AA6C39',

  // Neutrals
  white: '#FFFFFF',
  lightGray: '#F8F9FA',
  mediumGray: '#EBEFF2',
  darkGray: '#333333',
  textGray: '#666666',

  // Status Colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',

  // Overlay
  overlay: 'rgba(10, 25, 48, 0.95)', // Navy with 95% opacity

  // Gradients
  navyToCyan: 'linear-gradient(135deg, #0A1930 0%, #00C8FF 100%)',
  cyanToCopper: 'linear-gradient(135deg, #00C8FF 0%, #AA6C39 100%)',
  copperToNavy: 'linear-gradient(135deg, #AA6C39 0%, #0A1930 100%)',
} as const;

// CSS variable definitions for Tailwind
export const colorVars = {
  '--color-navy': COLORS.navy,
  '--color-cyan': COLORS.cyan,
  '--color-copper': COLORS.copper,
  '--color-light-gray': COLORS.lightGray,
  '--color-medium-gray': COLORS.mediumGray,
  '--color-dark-gray': COLORS.darkGray,
  '--color-text-gray': COLORS.textGray,
  '--color-overlay': COLORS.overlay,
} as const;
