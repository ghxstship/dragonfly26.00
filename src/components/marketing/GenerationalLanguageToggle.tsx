"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useGenerationalLanguage } from '@/contexts/GenerationalLanguageContext';
import { GENERATIONAL_VARIANTS, type GenerationalVariant } from '@/types/generational-language';
import { Button } from '@/components/ui/button';
import { ChevronDown, Check } from 'lucide-react';

export function GenerationalLanguageToggle() {
  const { variant, setVariant } = useGenerationalLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const locale = useLocale();

  const currentConfig = GENERATIONAL_VARIANTS[variant];
  const isEnglish = locale === 'en';

  const handleVariantChange = (newVariant: GenerationalVariant) => {
    setVariant(newVariant);
    setIsOpen(false);
    // Use router refresh instead of full page reload for smoother transition
    router.refresh();
  };

  return (
    <div className="relative w-full sm:w-auto">
      <Button
        variant="outline"
        size="sm"
        onClick={() => isEnglish && setIsOpen(!isOpen)}
        disabled={!isEnglish}
        className="flex items-center gap-2 font-tech text-sm w-full sm:w-auto justify-between sm:justify-start"
        aria-label={isEnglish ? "Change generational language variant" : "Generational variants only available in English"}
        aria-expanded={isOpen}
        aria-haspopup="true"
        title={!isEnglish ? "Generational variants only available in English" : undefined}
      >
        <span className="flex items-center gap-2">
          <span className="text-base" aria-hidden="true">{currentConfig.icon}</span>
          <span className="sm:inline">{currentConfig.label}</span>
        </span>
        <ChevronDown aria-hidden="true" className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
             role="button" tabIndex={0} onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          
          {/* Dropdown */}
          <div 
            className="absolute left-0 sm:left-auto sm:right-0 top-full mt-2 w-[calc(100vw-2rem)] sm:w-72 max-w-md rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg z-50 overflow-hidden"
            role="menu"
            aria-label="Generational language options"
          >
            <div className="p-2 sm:p-3 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-heading text-xs sm:text-sm uppercase text-gray-900 dark:text-gray-100">
                Language Style
              </h3>
              <p className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 mt-0.5 sm:mt-1">
                Choose how you want to read our content
              </p>
            </div>
            
            <div className="max-h-[60vh] sm:max-h-96 overflow-y-auto">
              {Object.values(GENERATIONAL_VARIANTS).map((config) => (
                <button
                  key={config.variant}
                  onClick={() => handleVariantChange(config.variant)}
                  className={`w-full px-3 sm:px-4 py-2 sm:py-3 flex items-start gap-2 sm:gap-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                    variant === config.variant ? 'bg-gray-50 dark:bg-gray-700/50' : ''
                  }`}
                  role="menuitem"
                  aria-label={`Switch to ${config.label} language style`}
                >
                  <span className="text-xl sm:text-2xl flex-shrink-0 mt-0.5" aria-hidden="true">
                    {config.icon}
                  </span>
                  
                  <div className="flex-1 text-left min-w-0">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <span className="font-heading text-xs sm:text-sm uppercase text-gray-900 dark:text-gray-100 truncate">
                        {config.label}
                      </span>
                      {variant === config.variant && (
                        <Check aria-hidden="true" className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600 dark:text-blue-400 flex-shrink-0" aria-label="Currently selected" />
                      )}
                    </div>
                    <p className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 mt-0.5 line-clamp-2">
                      {config.description}
                    </p>
                    <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-500 mt-0.5">
                      {config.ageRange}
                    </p>
                  </div>
                </button>
              ))}
            </div>
            
            <div className="p-2 sm:p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              <p className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400">
                Your preference is saved locally and won&apos;t affect other users
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
