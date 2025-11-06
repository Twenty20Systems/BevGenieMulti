/**
 * BevGenie Comprehensive Design System
 *
 * This theme system ensures visual consistency across all generated pages
 * and matches the landing page aesthetic exactly.
 */

export const THEME = {
  colors: {
    // Primary Colors (from landing page)
    primary: '#00C8FF',        // Cyan - main brand color
    primaryDark: '#00B8EF',   // Slightly darker cyan for hover states
    secondary: '#0A1930',      // Navy - deep blue for headers and text
    copper: '#AA6C39',         // Copper accent color

    // Background Colors
    background: '#FFFFFF',
    backgroundAlt: '#F8F9FA',
    backgroundDark: '#0A1930',

    // Text Colors
    text: {
      primary: '#0A1930',      // Navy for headings
      secondary: '#666666',    // Gray for body text
      light: '#999999',        // Light gray for subtle text
      white: '#FFFFFF'
    },

    // Neutral Colors
    white: '#FFFFFF',
    lightGray: '#F8F9FA',
    mediumGray: '#EBEFF2',
    darkGray: '#333333',
    textGray: '#666666',

    // Status Colors
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',

    // Border Colors
    border: {
      light: '#E5E7EB',
      medium: '#D1D5DB',
      dark: '#9CA3AF'
    },

    // Overlay
    overlay: 'rgba(10, 25, 48, 0.95)',

    // Gradients
    gradients: {
      navyToCyan: 'linear-gradient(135deg, #0A1930 0%, #00C8FF 100%)',
      cyanToCopper: 'linear-gradient(135deg, #00C8FF 0%, #AA6C39 100%)',
      copperToNavy: 'linear-gradient(135deg, #AA6C39 0%, #0A1930 100%)',
      primary: 'linear-gradient(135deg, #00C8FF 0%, #00B8EF 100%)',
      header: 'linear-gradient(135deg, #0A1930 0%, #1A3A5A 100%)'
    }
  },

  typography: {
    fontFamily: {
      primary: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
      heading: '"Inter", sans-serif',
      mono: '"Monaco", "Courier New", monospace'
    },

    fontSize: {
      xs: '0.75rem',     // 12px
      sm: '0.875rem',    // 14px
      base: '1rem',      // 16px
      lg: '1.125rem',    // 18px
      xl: '1.25rem',     // 20px
      '2xl': '1.5rem',   // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem',  // 36px
      '5xl': '3rem',     // 48px
      '6xl': '3.75rem'   // 60px
    },

    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800
    },

    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
      loose: 2
    },

    letterSpacing: {
      tight: '-0.025em',
      normal: '0',
      wide: '0.025em',
      wider: '0.05em',
      widest: '0.1em'
    }
  },

  spacing: {
    // Standard spacing scale (matches Tailwind)
    px: '1px',
    0: '0',
    0.5: '0.125rem',   // 2px
    1: '0.25rem',      // 4px
    1.5: '0.375rem',   // 6px
    2: '0.5rem',       // 8px
    2.5: '0.625rem',   // 10px
    3: '0.75rem',      // 12px
    3.5: '0.875rem',   // 14px
    4: '1rem',         // 16px
    5: '1.25rem',      // 20px
    6: '1.5rem',       // 24px
    7: '1.75rem',      // 28px
    8: '2rem',         // 32px
    9: '2.25rem',      // 36px
    10: '2.5rem',      // 40px
    11: '2.75rem',     // 44px
    12: '3rem',        // 48px
    14: '3.5rem',      // 56px
    16: '4rem',        // 64px
    20: '5rem',        // 80px
    24: '6rem',        // 96px
    28: '7rem',        // 112px
    32: '8rem',        // 128px

    // Semantic spacing
    section: '5rem',   // 80px - between major page sections
    container: '7rem', // 112px - max width container
    card: '2rem',      // 32px - card padding
    gutter: '1.5rem'   // 24px - grid gutters
  },

  borderRadius: {
    none: '0',
    sm: '0.25rem',     // 4px
    DEFAULT: '0.5rem', // 8px
    md: '0.5rem',      // 8px
    lg: '0.75rem',     // 12px
    xl: '1rem',        // 16px
    '2xl': '1.25rem',  // 20px
    '3xl': '1.5rem',   // 24px
    full: '9999px'
  },

  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    none: 'none'
  },

  transitions: {
    fast: '150ms ease',
    DEFAULT: '200ms ease',
    slow: '300ms ease',
    slower: '500ms ease',

    properties: {
      all: 'all',
      colors: 'background-color, border-color, color, fill, stroke',
      opacity: 'opacity',
      shadow: 'box-shadow',
      transform: 'transform'
    }
  },

  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px'
  },

  maxWidth: {
    xs: '20rem',      // 320px
    sm: '24rem',      // 384px
    md: '28rem',      // 448px
    lg: '32rem',      // 512px
    xl: '36rem',      // 576px
    '2xl': '42rem',   // 672px
    '3xl': '48rem',   // 768px
    '4xl': '56rem',   // 896px
    '5xl': '64rem',   // 1024px
    '6xl': '72rem',   // 1152px
    '7xl': '80rem',   // 1280px
    full: '100%',
    container: '1280px' // Main container max-width
  },

  zIndex: {
    hide: -1,
    auto: 'auto',
    base: 0,
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070
  }
} as const;

/**
 * Utility function to get theme values programmatically
 */
export function getThemeValue(path: string): string {
  const keys = path.split('.');
  let value: any = THEME;

  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      return '';
    }
  }

  return String(value);
}

/**
 * Tailwind CSS classes that match our theme
 * Use these for consistent styling across all pages
 */
export const TAILWIND_CLASSES = {
  // Layout
  container: 'max-w-7xl mx-auto px-6',
  section: 'py-16 md:py-20',

  // Headers
  pageHeader: 'bg-gradient-to-r from-[#0A1930] to-[#1A3A5A] text-white p-8 md:p-12',
  sectionHeader: 'text-3xl md:text-4xl font-bold text-[#0A1930] mb-4',
  subheader: 'text-xl md:text-2xl font-semibold text-[#0A1930] mb-3',

  // Cards
  card: 'bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow',
  cardHeader: 'font-semibold text-lg text-[#0A1930] mb-4',

  // Buttons
  buttonPrimary: 'bg-[#00C8FF] hover:bg-[#00B8EF] text-white font-medium px-6 py-3 rounded-lg transition-colors shadow-sm hover:shadow-md',
  buttonSecondary: 'border-2 border-[#00C8FF] text-[#00C8FF] hover:bg-[#00C8FF] hover:text-white font-medium px-6 py-3 rounded-lg transition-all',
  buttonOutline: 'border border-gray-300 text-[#0A1930] hover:bg-gray-50 font-medium px-6 py-3 rounded-lg transition-colors',

  // Text
  textPrimary: 'text-[#0A1930]',
  textSecondary: 'text-[#666666]',
  textLight: 'text-[#999999]',

  // KPI/Metrics
  kpiCard: 'bg-white rounded-lg border border-gray-200 p-6',
  kpiValue: 'text-3xl md:text-4xl font-bold text-[#0A1930]',
  kpiLabel: 'text-sm text-[#666666] uppercase tracking-wide mb-2',
  kpiChange: 'text-sm font-medium',

  // Grids
  grid2: 'grid grid-cols-1 md:grid-cols-2 gap-6',
  grid3: 'grid grid-cols-1 md:grid-cols-3 gap-6',
  grid4: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'
} as const;

/**
 * Component style presets
 * Ready-to-use style objects for common components
 */
export const COMPONENT_STYLES = {
  pageWrapper: {
    minHeight: '100vh',
    backgroundColor: THEME.colors.background
  },

  header: {
    background: THEME.colors.gradients.header,
    color: THEME.colors.text.white,
    padding: '3rem 1.5rem'
  },

  mainContent: {
    maxWidth: THEME.maxWidth.container,
    margin: '0 auto',
    padding: '4rem 1.5rem'
  },

  card: {
    backgroundColor: THEME.colors.white,
    borderRadius: THEME.borderRadius.lg,
    padding: THEME.spacing[6],
    boxShadow: THEME.shadows.md,
    border: `1px solid ${THEME.colors.border.light}`
  },

  buttonPrimary: {
    backgroundColor: THEME.colors.primary,
    color: THEME.colors.text.white,
    padding: `${THEME.spacing[3]} ${THEME.spacing[6]}`,
    borderRadius: THEME.borderRadius.lg,
    fontWeight: THEME.typography.fontWeight.medium,
    transition: THEME.transitions.DEFAULT,
    border: 'none',
    cursor: 'pointer'
  }
} as const;

export default THEME;
