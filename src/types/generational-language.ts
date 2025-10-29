/**
 * Generational Language Types
 * 
 * Defines the generational language system for marketing pages
 */

export type GenerationalVariant = 
  | 'default'      // 85% millennial business casual, 10% cinematic nautical, 5% Gen Z dry humor
  | 'baby-boomer'  // Traditional, formal, value-focused
  | 'gen-x'        // Pragmatic, skeptical, no-nonsense
  | 'millennial'   // Collaborative, purpose-driven, tech-savvy
  | 'gen-z'        // Authentic, direct, meme-aware
  | 'gen-alpha';   // Digital-native, visual, gamified

export interface GenerationalLanguageConfig {
  variant: GenerationalVariant;
  label: string;
  description: string;
  icon: string;
  ageRange: string;
}

export const GENERATIONAL_VARIANTS: Record<GenerationalVariant, GenerationalLanguageConfig> = {
  'default': {
    variant: 'default',
    label: 'Default',
    description: 'Balanced professional tone',
    icon: '⚓',
    ageRange: 'All ages'
  },
  'baby-boomer': {
    variant: 'baby-boomer',
    label: 'Classic',
    description: 'Traditional and proven',
    icon: '🎖️',
    ageRange: '1946-1964'
  },
  'gen-x': {
    variant: 'gen-x',
    label: 'Pragmatic',
    description: 'No-nonsense and direct',
    icon: '🎸',
    ageRange: '1965-1980'
  },
  'millennial': {
    variant: 'millennial',
    label: 'Collaborative',
    description: 'Purpose-driven and connected',
    icon: '💼',
    ageRange: '1981-1996'
  },
  'gen-z': {
    variant: 'gen-z',
    label: 'Authentic',
    description: 'Real and unfiltered',
    icon: '✨',
    ageRange: '1997-2012'
  },
  'gen-alpha': {
    variant: 'gen-alpha',
    label: 'Digital',
    description: 'Interactive and visual',
    icon: '🚀',
    ageRange: '2013+'
  }
};
