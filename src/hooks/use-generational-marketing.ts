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
      const generationalKey = `${variant}.${key}`;
      const messages = (t as any).raw('');
      
      // Navigate to the generational variant
      const parts = generationalKey.split('.');
      let value: any = messages;
      
      // First check if marketingGenerational exists
      if (messages.marketingGenerational && messages.marketingGenerational[variant]) {
        value = messages.marketingGenerational[variant];
        
        // Navigate through remaining parts
        for (let i = 0; i < parts.length - 1; i++) {
          if (value && typeof value === 'object' && parts[i + 1] in value) {
            value = value[parts[i + 1]];
          } else {
            // Fallback to default
            return t(key);
          }
        }
        
        if (typeof value === 'string') {
          return value;
        }
      }
    } catch (error) {
      // Fallback to default on any error
      console.warn(`Generational variant not found for ${variant}.${key}, using default`);
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
