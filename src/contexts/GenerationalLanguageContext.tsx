"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { GenerationalVariant } from '@/types/generational-language';

interface GenerationalLanguageContextType {
  variant: GenerationalVariant;
  setVariant: (variant: GenerationalVariant) => void;
}

const GenerationalLanguageContext = createContext<GenerationalLanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'atlvs-generational-language';

export function GenerationalLanguageProvider({ children }: { children: React.ReactNode }) {
  const [variant, setVariantState] = useState<GenerationalVariant>('default');
  const [mounted, setMounted] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && isValidVariant(stored)) {
      setVariantState(stored as GenerationalVariant);
    }
  }, []);

  const setVariant = (newVariant: GenerationalVariant) => {
    setVariantState(newVariant);
    if (mounted) {
      localStorage.setItem(STORAGE_KEY, newVariant);
    }
  };

  return (
    <GenerationalLanguageContext.Provider value={{ variant, setVariant }}>
      {children}
    </GenerationalLanguageContext.Provider>
  );
}

export function useGenerationalLanguage() {
  const context = useContext(GenerationalLanguageContext);
  if (context === undefined) {
    throw new Error('useGenerationalLanguage must be used within a GenerationalLanguageProvider');
  }
  return context;
}

function isValidVariant(value: string): boolean {
  return ['default', 'baby-boomer', 'gen-x', 'millennial', 'gen-z', 'gen-alpha'].includes(value);
}
