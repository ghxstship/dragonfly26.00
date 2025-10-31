"use client";

import { useTranslations } from 'next-intl';
import { useGenerationalLanguage } from '@/contexts/GenerationalLanguageContext';
import type { GenerationalVariant } from '@/types/generational-language';

/**
 * Hook for accessing generational marketing copy
 * 
 * Returns marketing copy adapted to the selected generational variant.
 * Falls back to default marketing copy if generational variant not available.
 * 
 * @example
 * const { t, tGen, variant } = useGenerationalMarketing();
 * const headline = tGen('hero.headline'); // Gets generational variant if available
 * const fallback = t('hero.headline'); // Gets default copy
 */
export function useGenerationalMarketing() {
  const t = useTranslations('marketing');
  const tGenerational = useTranslations('marketing.generational');
  const { variant } = useGenerationalLanguage();
  
  /**
   * Get generational variant of marketing copy
   * Falls back to default if variant not available
   */
  const tGen = (key: string): string => {
    // For default and millennial, use standard marketing copy
    if (variant === 'default' || variant === 'millennial') {
      return t(key);
    }
    
    // Try to get generational variant
    try {
      // Attempt to access the generational variant
      // Format: marketing.generational.{variant}.{key}
      const generationalKey = `${variant}.${key}`;
      const value = tGenerational(generationalKey as any);
      
      // next-intl returns the full key path when translation is missing
      // e.g., "marketing.generational.gen-z.integrations.title"
      // We need to detect this and fall back to the base translation
      const fullKeyPath = `marketing.generational.${generationalKey}`;
      
      // If the returned value is the key path itself, the translation doesn't exist
      if (value === fullKeyPath || value === generationalKey) {
        return t(key);
      }
      
      // If we got a valid translation (doesn't look like a key path), return it
      if (value && typeof value === 'string') {
        return value;
      }
    } catch (error) {
      // Fallback to default on any error (variant not found)
      // This is expected behavior when generational variants aren't available
    }
    
    // Fallback to default marketing copy
    return t(key);
  };
  
  return {
    t,        // Standard marketing translations
    tGen,     // Generational variant translations
    variant   // Current generational variant
  };
}
