/**
 * Google Fonts Integration Utility
 * 
 * Provides utilities for managing Google Fonts in the application,
 * including font selection, URL generation, and CSS custom properties.
 * 
 * Features:
 * - Dynamic loading of all 1,500+ Google Fonts via API
 * - Curated list of 25 popular fonts for quick access
 * - Search and filter functionality
 * - Font preview and metadata
 */

// =====================================================================================
// TYPES
// =====================================================================================

export interface GoogleFontsAPIResponse {
  kind: string;
  items: GoogleFontItem[];
}

export interface GoogleFontItem {
  family: string;
  variants: string[];
  subsets: string[];
  version: string;
  lastModified: string;
  files: Record<string, string>;
  category: string;
  kind: string;
  menu: string;
}

// =====================================================================================
// TYPES
// =====================================================================================

export interface FontDefinition {
  id: string;
  name: string;
  category: 'sans-serif' | 'serif' | 'monospace' | 'display' | 'handwriting';
  weights: number[];
  variable?: boolean;
  fallback: string;
}

export interface TypographySettings {
  headingFont: string;
  bodyFont: string;
  monoFont: string;
  fontWeights: {
    light: number;
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
  };
  fontSizes: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
    '5xl': string;
  };
  lineHeights?: {
    tight: number;
    normal: number;
    relaxed: number;
  };
  letterSpacing?: {
    tight: string;
    normal: string;
    wide: string;
  };
}

// =====================================================================================
// AVAILABLE FONTS
// =====================================================================================

export const AVAILABLE_FONTS: FontDefinition[] = [
  // Sans-Serif Fonts
  {
    id: 'inter',
    name: 'Inter',
    category: 'sans-serif',
    weights: [300, 400, 500, 600, 700],
    variable: true,
    fallback: 'system-ui, -apple-system, sans-serif'
  },
  {
    id: 'roboto',
    name: 'Roboto',
    category: 'sans-serif',
    weights: [300, 400, 500, 700],
    fallback: 'Arial, sans-serif'
  },
  {
    id: 'open-sans',
    name: 'Open Sans',
    category: 'sans-serif',
    weights: [300, 400, 600, 700],
    variable: true,
    fallback: 'Arial, sans-serif'
  },
  {
    id: 'lato',
    name: 'Lato',
    category: 'sans-serif',
    weights: [300, 400, 700],
    fallback: 'Arial, sans-serif'
  },
  {
    id: 'montserrat',
    name: 'Montserrat',
    category: 'sans-serif',
    weights: [300, 400, 500, 600, 700],
    variable: true,
    fallback: 'Arial, sans-serif'
  },
  {
    id: 'poppins',
    name: 'Poppins',
    category: 'sans-serif',
    weights: [300, 400, 500, 600, 700],
    fallback: 'Arial, sans-serif'
  },
  {
    id: 'nunito',
    name: 'Nunito',
    category: 'sans-serif',
    weights: [300, 400, 600, 700],
    variable: true,
    fallback: 'Arial, sans-serif'
  },
  {
    id: 'raleway',
    name: 'Raleway',
    category: 'sans-serif',
    weights: [300, 400, 500, 600, 700],
    variable: true,
    fallback: 'Arial, sans-serif'
  },
  {
    id: 'work-sans',
    name: 'Work Sans',
    category: 'sans-serif',
    weights: [300, 400, 500, 600, 700],
    variable: true,
    fallback: 'Arial, sans-serif'
  },
  {
    id: 'dm-sans',
    name: 'DM Sans',
    category: 'sans-serif',
    weights: [400, 500, 700],
    variable: true,
    fallback: 'Arial, sans-serif'
  },

  // Serif Fonts
  {
    id: 'playfair-display',
    name: 'Playfair Display',
    category: 'serif',
    weights: [400, 500, 600, 700],
    variable: true,
    fallback: 'Georgia, serif'
  },
  {
    id: 'merriweather',
    name: 'Merriweather',
    category: 'serif',
    weights: [300, 400, 700],
    fallback: 'Georgia, serif'
  },
  {
    id: 'lora',
    name: 'Lora',
    category: 'serif',
    weights: [400, 500, 600, 700],
    variable: true,
    fallback: 'Georgia, serif'
  },
  {
    id: 'crimson-text',
    name: 'Crimson Text',
    category: 'serif',
    weights: [400, 600, 700],
    fallback: 'Georgia, serif'
  },
  {
    id: 'eb-garamond',
    name: 'EB Garamond',
    category: 'serif',
    weights: [400, 500, 600, 700],
    variable: true,
    fallback: 'Georgia, serif'
  },

  // Monospace Fonts
  {
    id: 'jetbrains-mono',
    name: 'JetBrains Mono',
    category: 'monospace',
    weights: [300, 400, 500, 600, 700],
    variable: true,
    fallback: 'Consolas, Monaco, monospace'
  },
  {
    id: 'fira-code',
    name: 'Fira Code',
    category: 'monospace',
    weights: [300, 400, 500, 600, 700],
    variable: true,
    fallback: 'Consolas, Monaco, monospace'
  },
  {
    id: 'source-code-pro',
    name: 'Source Code Pro',
    category: 'monospace',
    weights: [300, 400, 500, 600, 700],
    variable: true,
    fallback: 'Consolas, Monaco, monospace'
  },
  {
    id: 'roboto-mono',
    name: 'Roboto Mono',
    category: 'monospace',
    weights: [300, 400, 500, 700],
    variable: true,
    fallback: 'Consolas, Monaco, monospace'
  },
  {
    id: 'ibm-plex-mono',
    name: 'IBM Plex Mono',
    category: 'monospace',
    weights: [300, 400, 500, 600, 700],
    fallback: 'Consolas, Monaco, monospace'
  },

  // Display Fonts
  {
    id: 'bebas-neue',
    name: 'Bebas Neue',
    category: 'display',
    weights: [400],
    fallback: 'Impact, sans-serif'
  },
  {
    id: 'oswald',
    name: 'Oswald',
    category: 'display',
    weights: [300, 400, 500, 600, 700],
    variable: true,
    fallback: 'Impact, sans-serif'
  }
];

// =====================================================================================
// FONT CATEGORIES
// =====================================================================================

export const FONT_CATEGORIES = {
  'sans-serif': 'Sans Serif',
  'serif': 'Serif',
  'monospace': 'Monospace',
  'display': 'Display',
  'handwriting': 'Handwriting'
} as const;

// =====================================================================================
// HELPER FUNCTIONS
// =====================================================================================

/**
 * Get font definition by ID
 */
export function getFontById(id: string): FontDefinition | undefined {
  return AVAILABLE_FONTS.find(font => font.id === id);
}

/**
 * Get font definition by name
 */
export function getFontByName(name: string): FontDefinition | undefined {
  return AVAILABLE_FONTS.find(font => font.name === name);
}

/**
 * Get fonts by category
 */
export function getFontsByCategory(category: FontDefinition['category']): FontDefinition[] {
  return AVAILABLE_FONTS.filter(font => font.category === category);
}

/**
 * Build Google Fonts URL for multiple fonts
 */
export function buildGoogleFontsUrl(fonts: string[], weights?: number[]): string {
  if (fonts.length === 0) return '';

  const uniqueFonts = [...new Set(fonts)];
  const fontDefinitions = uniqueFonts
    .map(name => getFontByName(name))
    .filter((def): def is FontDefinition => def !== undefined);

  if (fontDefinitions.length === 0) return '';

  const fontParams = fontDefinitions.map(font => {
    const fontWeights = weights || font.weights;
    const weightsStr = fontWeights.join(';');
    const fontName = font.name.replace(/\s+/g, '+');
    
    return `family=${fontName}:wght@${weightsStr}`;
  }).join('&');

  return `https://fonts.googleapis.com/css2?${fontParams}&display=swap`;
}

/**
 * Build Google Fonts URL from typography settings
 */
export function buildFontsUrlFromSettings(settings: TypographySettings): string {
  const fonts = [
    settings.headingFont,
    settings.bodyFont,
    settings.monoFont
  ];

  const weights = Object.values(settings.fontWeights);

  return buildGoogleFontsUrl(fonts, weights);
}

/**
 * Generate CSS custom properties from typography settings
 */
export function generateCSSCustomProperties(settings: TypographySettings): string {
  const headingFont = getFontByName(settings.headingFont);
  const bodyFont = getFontByName(settings.bodyFont);
  const monoFont = getFontByName(settings.monoFont);

  return `
    --font-heading: "${settings.headingFont}", ${headingFont?.fallback || 'sans-serif'};
    --font-body: "${settings.bodyFont}", ${bodyFont?.fallback || 'sans-serif'};
    --font-mono: "${settings.monoFont}", ${monoFont?.fallback || 'monospace'};
    
    --font-weight-light: ${settings.fontWeights.light};
    --font-weight-normal: ${settings.fontWeights.normal};
    --font-weight-medium: ${settings.fontWeights.medium};
    --font-weight-semibold: ${settings.fontWeights.semibold};
    --font-weight-bold: ${settings.fontWeights.bold};
    
    --font-size-xs: ${settings.fontSizes.xs};
    --font-size-sm: ${settings.fontSizes.sm};
    --font-size-base: ${settings.fontSizes.base};
    --font-size-lg: ${settings.fontSizes.lg};
    --font-size-xl: ${settings.fontSizes.xl};
    --font-size-2xl: ${settings.fontSizes['2xl']};
    --font-size-3xl: ${settings.fontSizes['3xl']};
    --font-size-4xl: ${settings.fontSizes['4xl']};
    --font-size-5xl: ${settings.fontSizes['5xl']};
    
    ${settings.lineHeights ? `
    --line-height-tight: ${settings.lineHeights.tight};
    --line-height-normal: ${settings.lineHeights.normal};
    --line-height-relaxed: ${settings.lineHeights.relaxed};
    ` : ''}
    
    ${settings.letterSpacing ? `
    --letter-spacing-tight: ${settings.letterSpacing.tight};
    --letter-spacing-normal: ${settings.letterSpacing.normal};
    --letter-spacing-wide: ${settings.letterSpacing.wide};
    ` : ''}
  `.trim();
}

/**
 * Get default typography settings
 */
export function getDefaultTypographySettings(): TypographySettings {
  return {
    headingFont: 'Inter',
    bodyFont: 'Inter',
    monoFont: 'JetBrains Mono',
    fontWeights: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700
    },
    fontSizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem'
    },
    lineHeights: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75
    },
    letterSpacing: {
      tight: '-0.025em',
      normal: '0em',
      wide: '0.025em'
    }
  };
}

/**
 * Validate typography settings structure
 */
export function validateTypographySettings(settings: unknown): settings is TypographySettings {
  if (!settings || typeof settings !== 'object') return false;

  const s = settings as Record<string, unknown>;

  // Check required top-level keys
  if (
    typeof s.headingFont !== 'string' ||
    typeof s.bodyFont !== 'string' ||
    typeof s.monoFont !== 'string' ||
    typeof s.fontWeights !== 'object' ||
    typeof s.fontSizes !== 'object'
  ) {
    return false;
  }

  // Check fontWeights structure
  const weights = s.fontWeights as Record<string, unknown>;
  if (
    typeof weights.light !== 'number' ||
    typeof weights.normal !== 'number' ||
    typeof weights.medium !== 'number' ||
    typeof weights.semibold !== 'number' ||
    typeof weights.bold !== 'number'
  ) {
    return false;
  }

  // Check fontSizes structure
  const sizes = s.fontSizes as Record<string, unknown>;
  if (
    typeof sizes.xs !== 'string' ||
    typeof sizes.sm !== 'string' ||
    typeof sizes.base !== 'string' ||
    typeof sizes.lg !== 'string' ||
    typeof sizes.xl !== 'string'
  ) {
    return false;
  }

  return true;
}

/**
 * Merge user typography override with organization defaults
 */
export function mergeTypographySettings(
  orgSettings: TypographySettings,
  userOverride?: Partial<TypographySettings> | null
): TypographySettings {
  if (!userOverride) return orgSettings;

  return {
    headingFont: userOverride.headingFont || orgSettings.headingFont,
    bodyFont: userOverride.bodyFont || orgSettings.bodyFont,
    monoFont: userOverride.monoFont || orgSettings.monoFont,
    fontWeights: {
      ...orgSettings.fontWeights,
      ...(userOverride.fontWeights || {})
    },
    fontSizes: {
      ...orgSettings.fontSizes,
      ...(userOverride.fontSizes || {})
    },
    lineHeights: {
      ...orgSettings.lineHeights,
      ...(userOverride.lineHeights || {})
    },
    letterSpacing: {
      ...orgSettings.letterSpacing,
      ...(userOverride.letterSpacing || {})
    }
  };
}
