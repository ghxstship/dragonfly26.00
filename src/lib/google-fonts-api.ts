/**
 * Google Fonts API Integration
 * 
 * Provides dynamic access to all 1,500+ Google Fonts via the Google Fonts API
 */

import type { FontDefinition } from './google-fonts';

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
// API FUNCTIONS
// =====================================================================================

/**
 * Fetch all available Google Fonts from the API
 * Returns 1,500+ fonts sorted by popularity
 */
export async function fetchAllGoogleFonts(): Promise<FontDefinition[]> {
  const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_FONTS_API_KEY;
  
  if (!API_KEY) {
    console.warn('Google Fonts API key not configured');
    return [];
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/webfonts/v1/webfonts?key=${API_KEY}&sort=popularity`,
      { next: { revalidate: 86400 } } // Cache for 24 hours
    );

    if (!response.ok) {
      throw new Error(`Google Fonts API error: ${response.status}`);
    }

    const data: GoogleFontsAPIResponse = await response.json();

    return data.items.map((font) => convertGoogleFontToDefinition(font));
  } catch (error) {
    console.error('Failed to fetch Google Fonts:', error);
    return [];
  }
}

/**
 * Search Google Fonts by name or category
 */
export async function searchGoogleFonts(
  query: string,
  category?: 'sans-serif' | 'serif' | 'monospace' | 'display' | 'handwriting'
): Promise<FontDefinition[]> {
  const allFonts = await fetchAllGoogleFonts();
  const lowerQuery = query.toLowerCase();

  return allFonts.filter((font) => {
    const matchesQuery = font.name.toLowerCase().includes(lowerQuery) ||
                        font.id.includes(lowerQuery);
    const matchesCategory = !category || font.category === category;
    return matchesQuery && matchesCategory;
  });
}

/**
 * Get fonts by category from the full Google Fonts library
 */
export async function getGoogleFontsByCategory(
  category: 'sans-serif' | 'serif' | 'monospace' | 'display' | 'handwriting',
  limit?: number
): Promise<FontDefinition[]> {
  const allFonts = await fetchAllGoogleFonts();
  const filtered = allFonts.filter((font) => font.category === category);
  return limit ? filtered.slice(0, limit) : filtered;
}

/**
 * Get popular fonts (top N from Google Fonts)
 */
export async function getPopularGoogleFonts(limit: number = 50): Promise<FontDefinition[]> {
  const allFonts = await fetchAllGoogleFonts();
  return allFonts.slice(0, limit);
}

/**
 * Check if a font exists in Google Fonts
 */
export async function isGoogleFontAvailable(fontName: string): Promise<boolean> {
  const allFonts = await fetchAllGoogleFonts();
  return allFonts.some((font) => 
    font.name.toLowerCase() === fontName.toLowerCase()
  );
}

/**
 * Get font by exact name
 */
export async function getGoogleFontByName(fontName: string): Promise<FontDefinition | null> {
  const allFonts = await fetchAllGoogleFonts();
  return allFonts.find((font) => 
    font.name.toLowerCase() === fontName.toLowerCase()
  ) || null;
}

// =====================================================================================
// HELPER FUNCTIONS
// =====================================================================================

/**
 * Convert Google Fonts API item to FontDefinition
 */
function convertGoogleFontToDefinition(font: GoogleFontItem): FontDefinition {
  // Parse weights from variants (e.g., "100", "regular", "700italic")
  const weights = font.variants
    .filter((v) => !v.includes('italic'))
    .map((v) => {
      if (v === 'regular') return 400;
      if (v === 'thin') return 100;
      const parsed = parseInt(v);
      return isNaN(parsed) ? 400 : parsed;
    })
    .filter((w, i, arr) => arr.indexOf(w) === i) // Remove duplicates
    .sort((a, b) => a - b);

  // Check if font has variable version
  const hasVariable = font.variants.some((v) => v.includes('variable'));

  // Map Google Fonts category to our category type
  const category = mapGoogleFontCategory(font.category);

  return {
    id: font.family.toLowerCase().replace(/\s+/g, '-'),
    name: font.family,
    category,
    weights: weights.length > 0 ? weights : [400],
    variable: hasVariable,
    fallback: getCategoryFallback(category)
  };
}

/**
 * Map Google Fonts category to our category type
 */
function mapGoogleFontCategory(
  googleCategory: string
): 'sans-serif' | 'serif' | 'monospace' | 'display' | 'handwriting' {
  switch (googleCategory.toLowerCase()) {
    case 'sans-serif':
      return 'sans-serif';
    case 'serif':
      return 'serif';
    case 'monospace':
      return 'monospace';
    case 'display':
      return 'display';
    case 'handwriting':
      return 'handwriting';
    default:
      return 'sans-serif';
  }
}

/**
 * Get fallback font for category
 */
function getCategoryFallback(
  category: 'sans-serif' | 'serif' | 'monospace' | 'display' | 'handwriting'
): string {
  switch (category) {
    case 'sans-serif':
      return 'system-ui, -apple-system, sans-serif';
    case 'serif':
      return 'Georgia, serif';
    case 'monospace':
      return 'Consolas, Monaco, monospace';
    case 'display':
      return 'Impact, sans-serif';
    case 'handwriting':
      return 'cursive';
    default:
      return 'system-ui, sans-serif';
  }
}
