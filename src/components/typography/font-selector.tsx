'use client';

/**
 * Font Selector Component
 * 
 * Dynamic font selector with access to all 1,500+ Google Fonts
 * Features search, filter by category, and live preview
 */

import { useState, useEffect, useMemo } from 'react';
import { Check, Search, Loader2 } from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { AVAILABLE_FONTS, FONT_CATEGORIES, type FontDefinition } from '@/lib/google-fonts';
import { fetchAllGoogleFonts, getPopularGoogleFonts } from '@/lib/google-fonts-api';

interface FontSelectorProps {
  value: string;
  onChange: (fontName: string) => void;
  category?: 'sans-serif' | 'serif' | 'monospace' | 'display' | 'handwriting';
  label?: string;
  disabled?: boolean;
}

export function FontSelector({
  value,
  onChange,
  category,
  label = 'Select font',
  disabled = false
}: FontSelectorProps) {
  const [open, setOpen] = useState(false);
  const [allFonts, setAllFonts] = useState<FontDefinition[]>(AVAILABLE_FONTS);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [useFullLibrary, setUseFullLibrary] = useState(false);

  // Load popular fonts on mount
  useEffect(() => {
    loadPopularFonts();
  }, []);

  const loadPopularFonts = async () => {
    try {
      setIsLoading(true);
      const popular = await getPopularGoogleFonts(100);
      if (popular.length > 0) {
        setAllFonts(popular);
      }
    } catch (error) {
      console.error('Failed to load popular fonts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadAllFonts = async () => {
    try {
      setIsLoading(true);
      setUseFullLibrary(true);
      const fonts = await fetchAllGoogleFonts();
      if (fonts.length > 0) {
        setAllFonts(fonts);
      }
    } catch (error) {
      console.error('Failed to load all fonts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter fonts by category and search query
  const filteredFonts = useMemo(() => {
    let fonts = allFonts;

    // Filter by category if specified
    if (category) {
      fonts = fonts.filter((font) => font.category === category);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      fonts = fonts.filter((font) =>
        font.name.toLowerCase().includes(query) ||
        font.id.includes(query)
      );
    }

    return fonts;
  }, [allFonts, category, searchQuery]);

  // Group fonts by category
  const groupedFonts = useMemo(() => {
    const groups: Record<string, FontDefinition[]> = {};

    filteredFonts.forEach((font) => {
      if (!groups[font.category]) {
        groups[font.category] = [];
      }
      groups[font.category].push(font);
    });

    return groups;
  }, [filteredFonts]);

  const selectedFont = allFonts.find((font) => font.name === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label={label}
          disabled={disabled}
          className="w-full justify-between"
        >
          <span
            style={{ fontFamily: selectedFont?.name || value }}
            className="truncate"
          >
            {value || label}
          </span>
          <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" aria-hidden="true" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search fonts..."
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList className="max-h-[300px]">
            {isLoading ? (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                <span className="ml-2 text-sm text-muted-foreground">
                  Loading fonts...
                </span>
              </div>
            ) : filteredFonts.length === 0 ? (
              <CommandEmpty>No fonts found.</CommandEmpty>
            ) : (
              <>
                {Object.entries(groupedFonts).map(([cat, fonts]) => (
                  <CommandGroup
                    key={cat}
                    heading={FONT_CATEGORIES[cat as keyof typeof FONT_CATEGORIES]}
                  >
                    {fonts.slice(0, 20).map((font) => (
                      <CommandItem
                        key={font.id}
                        value={font.name}
                        onSelect={() => {
                          onChange(font.name);
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            'mr-2 h-4 w-4',
                            value === font.name ? 'opacity-100' : 'opacity-0'
                          )}
                          aria-hidden="true"
                        />
                        <span
                          style={{ fontFamily: font.name }}
                          className="truncate"
                        >
                          {font.name}
                        </span>
                        {font.variable && (
                          <span className="ml-auto text-xs text-muted-foreground">
                            Variable
                          </span>
                        )}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                ))}

                {!useFullLibrary && (
                  <div className="border-t p-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={loadAllFonts}
                      disabled={isLoading}
                      className="w-full"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                          Loading...
                        </>
                      ) : (
                        <>Load all 1,500+ fonts</>
                      )}
                    </Button>
                  </div>
                )}
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
