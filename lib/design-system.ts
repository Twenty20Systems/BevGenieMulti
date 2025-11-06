/**
 * BevGenie Design System
 *
 * Unified design system for dynamically generated UI components.
 * Maintains BevGenie's brand identity (copper/cyan) while providing
 * modern, production-ready component patterns.
 */

export const designSystem = {
  colors: {
    // BevGenie Brand Colors (Primary)
    copper: {
      50: '#fdf8f6',
      100: '#f2e8e1',
      200: '#ebd0c1',
      300: '#ddb89d',
      400: '#c99876',
      500: '#AA6C39', // Primary copper
      600: '#8B5A2B', // Dark copper
      700: '#7a4d23',
      800: '#64401d',
      900: '#523418',
    },
    cyan: {
      50: '#ecfeff',
      100: '#cffafe',
      200: '#a5f3fc',
      300: '#67e8f9',
      400: '#22d3ee',
      500: '#00C8FF', // Primary cyan
      600: '#00B8EF',
      700: '#0891b2',
      800: '#0e7490',
      900: '#155e75',
    },
    navy: {
      50: '#f0f4f8',
      100: '#d9e2ec',
      200: '#bcccdc',
      300: '#9fb3c8',
      400: '#829ab1',
      500: '#627d98',
      600: '#486581',
      700: '#334e68',
      800: '#243b53',
      900: '#0A1930', // Primary dark navy
    },

    // Supporting colors
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',

    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    }
  },

  gradients: {
    // BevGenie Brand Gradients
    primary: 'linear-gradient(135deg, #AA6C39 0%, #8B5A2B 100%)',
    accent: 'linear-gradient(135deg, #00C8FF 0%, #00B8EF 100%)',
    copperCyan: 'linear-gradient(135deg, #AA6C39 0%, #00C8FF 100%)',
    darkCyan: 'linear-gradient(135deg, #0A1930 0%, #00C8FF 100%)',

    // Supporting gradients
    success: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    warning: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',

    // Background gradients
    backgroundLight: 'linear-gradient(135deg, #f0f4f8 0%, #f9fafb 100%)',
    backgroundCopper: 'linear-gradient(135deg, #fdf8f6 0%, #f2e8e1 100%)',
    backgroundCyan: 'linear-gradient(135deg, #ecfeff 0%, #f0f4f8 100%)',
    backgroundDark: 'linear-gradient(135deg, #0A1930 0%, #243b53 100%)',
  },

  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',

    // Branded shadows
    glowCopper: '0 0 20px rgba(170, 108, 57, 0.4)',
    glowCyan: '0 0 20px rgba(0, 200, 255, 0.4)',
    glowDark: '0 0 20px rgba(10, 25, 48, 0.4)',
  },

  spacing: {
    xs: '0.5rem',    // 8px
    sm: '1rem',      // 16px
    md: '1.5rem',    // 24px
    lg: '2.5rem',    // 40px
    xl: '4rem',      // 64px
    '2xl': '6rem',   // 96px
    '3xl': '8rem',   // 128px
  },

  typography: {
    fontFamily: {
      sans: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    },
    fontSize: {
      xs: '0.75rem',      // 12px
      sm: '0.875rem',     // 14px
      base: '1rem',       // 16px
      lg: '1.125rem',     // 18px
      xl: '1.25rem',      // 20px
      '2xl': '1.5rem',    // 24px
      '3xl': '1.875rem',  // 30px
      '4xl': '2.25rem',   // 36px
      '5xl': '3rem',      // 48px
      '6xl': '3.75rem',   // 60px
      '7xl': '4.5rem',    // 72px
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
    }
  },

  borderRadius: {
    sm: '0.5rem',
    md: '0.75rem',
    lg: '1rem',
    xl: '1.5rem',
    '2xl': '2rem',
    full: '9999px',
  },

  animations: {
    fadeIn: 'fadeIn 0.5s ease-in-out',
    slideUp: 'slideUp 0.5s ease-out',
    scaleIn: 'scaleIn 0.3s ease-out',
    pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
    float: 'float 3s ease-in-out infinite',
  }
};

/**
 * Component Pattern Library
 *
 * Reference patterns for AI to generate consistent, modern UI components
 * aligned with BevGenie's brand and beverage industry context.
 */
export const componentPatterns = {
  heroSection: {
    description: 'Primary landing section with compelling headline and CTA',
    specs: {
      minHeight: '85vh',
      background: 'gradient with floating blur elements (copper/cyan)',
      layout: 'Grid 2 columns (text left, visual right)',
      headline: '5xl to 7xl font size with gradient text (copper to cyan)',
      body: 'xl text size (20px)',
      ctas: 'Large buttons with shadows and hover effects (copper primary, cyan secondary)',
    },
    required: ['eyebrow text', 'large headline', 'description', '2 CTAs', 'visual element']
  },

  statsSection: {
    description: 'Key metrics and KPIs display',
    specs: {
      background: 'light gradient (copper-50 to cyan-50)',
      grid: '4 columns on desktop, responsive',
      cards: 'White with border, hover lift effect',
      numbers: '5xl font size with copper-cyan gradient',
      icons: '14x14 with gradient background (copper/cyan)',
    },
    required: ['icon', 'large number', 'label', 'description']
  },

  featureCard: {
    description: 'Individual feature or capability highlight',
    specs: {
      padding: '8 (32px)',
      background: 'white with border',
      hover: 'lift, shadow increase, gradient border glow (copper/cyan)',
      icon: '16x16 with gradient background in rounded-2xl',
      title: 'xl font, bold',
      description: 'gray-600, leading-relaxed',
    },
    required: ['icon', 'title', 'description', 'click handler']
  },

  timelineStep: {
    description: 'Process steps or timeline visualization',
    specs: {
      layout: 'Number circle + content card',
      connectingLine: 'vertical gradient line (copper to cyan)',
      number: '16x16 circle with copper-cyan gradient, white text',
      card: 'white background, shadow, hover effect',
    },
    required: ['step number', 'title', 'description']
  },

  ctaSection: {
    description: 'Final conversion section',
    specs: {
      background: 'gradient (navy to copper)',
      text: 'white',
      padding: '20 (80px vertical)',
      elements: 'floating blur elements, pattern overlay',
      buttons: 'contrasting (white + copper bordered)',
    },
    required: ['headline', 'description', 'primary CTA', 'secondary CTA']
  },

  comparisonTable: {
    description: 'Before/After or product comparison',
    specs: {
      layout: '2-column grid or table',
      headers: 'copper gradient background',
      rows: 'alternating background, hover highlight',
      highlights: 'cyan checkmarks for positive features',
    },
    required: ['column headers', 'comparison items', 'visual indicators']
  },

  dataVisualization: {
    description: 'Charts, graphs, or data representations',
    specs: {
      container: 'white card with shadow',
      colors: 'copper and cyan for data series',
      hover: 'tooltip with detailed info',
      labels: 'clear axis labels and legend',
    },
    required: ['title', 'data visualization', 'legend', 'axis labels']
  }
};

/**
 * BevGenie-specific content guidelines
 */
export const contentGuidelines = {
  tone: [
    'Professional and data-driven',
    'Confident but not overpromising',
    'Industry-specific (beverage/CPG focus)',
    'Results-oriented with concrete metrics'
  ],

  terminology: {
    analytics: ['SKU performance', 'Distribution coverage', 'Velocity analysis', 'Market share'],
    sales: ['Territory management', 'Distributor relationships', 'Account penetration', 'Sales cycles'],
    marketing: ['Brand health', 'Consumer insights', 'Campaign effectiveness', 'ROI tracking'],
    operations: ['Supply chain efficiency', 'Inventory optimization', 'Logistics tracking', 'Fulfillment rates']
  },

  ctaExamples: [
    'See Your Territory Performance',
    'Analyze Brand Health',
    'Calculate Distribution ROI',
    'Track Competitive Position',
    'Optimize Your Portfolio',
    'Discover Growth Opportunities'
  ]
};

export default designSystem;
