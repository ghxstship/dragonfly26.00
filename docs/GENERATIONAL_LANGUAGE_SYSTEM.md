# Generational Language System

## Overview

The Generational Language System allows marketing pages to adapt their copy for different generational audiences while maintaining the same core message. This creates a more personalized experience for users of different age groups.

## Brand Voice Mix (Default)

The default brand voice is optimized for Millennials and consists of:
- **85% Millennial Business Casual**: Professional but approachable, collaborative, purpose-driven
- **10% Cinematic Nautical**: Navigation metaphors (chart, sail, voyage, command center)
- **5% Gen Z Dry Humor**: Subtle, self-aware, no cringe

## Generational Variants

### 1. Default (⚓)
- **Target**: All ages
- **Tone**: Balanced professional
- **Example**: "Navigate your projects, crew, assets, and budgets from a single command center"

### 2. Baby Boomer / Classic (🎖️)
- **Age Range**: 1946-1964
- **Tone**: Traditional, formal, value-focused
- **Characteristics**: 
  - Professional terminology
  - Emphasis on proven solutions
  - Formal language structure
- **Example**: "Comprehensive project, workforce, asset, and financial management from a centralized platform"

### 3. Gen X / Pragmatic (🎸)
- **Age Range**: 1965-1980
- **Tone**: Pragmatic, skeptical, no-nonsense
- **Characteristics**:
  - Direct and efficient
  - Skeptical of hype
  - Results-focused
- **Example**: "Manage projects, crew, assets, and budgets without the usual platform bloat"

### 4. Millennial / Collaborative (💼)
- **Age Range**: 1981-1996
- **Tone**: Collaborative, purpose-driven, tech-savvy
- **Characteristics**:
  - Nautical metaphors
  - Team-oriented language
  - Slightly humorous
- **Example**: "Navigate your projects, crew, assets, and budgets from a single command center"

### 5. Gen Z / Authentic (✨)
- **Age Range**: 1997-2012
- **Tone**: Authentic, direct, meme-aware
- **Characteristics**:
  - Casual but professional
  - Self-aware humor
  - Internet culture references (subtle)
- **Example**: "Manage projects, crew, assets, and budgets from one place. No cap, it actually works"

### 6. Gen Alpha / Digital (🚀)
- **Age Range**: 2013+
- **Tone**: Digital-native, visual, gamified
- **Characteristics**:
  - Emojis integrated naturally
  - Gaming terminology
  - Action-oriented language
- **Example**: "Level Up Your Production Game 🚀"

## Implementation

### 1. Context Provider

The `GenerationalLanguageProvider` wraps the marketing layout and provides access to the current variant:

```tsx
import { GenerationalLanguageProvider } from "@/contexts/GenerationalLanguageContext"

<GenerationalLanguageProvider>
  {/* Marketing pages */}
</GenerationalLanguageProvider>
```

### 2. Custom Hook

Use `useGenerationalMarketing()` in marketing components:

```tsx
import { useGenerationalMarketing } from "@/hooks/use-generational-marketing"

export function MyMarketingSection() {
  const { tGen, variant } = useGenerationalMarketing()
  
  return (
    <div>
      <h1>{tGen('hero.headline')}</h1>
      <p>{tGen('hero.subheadline')}</p>
    </div>
  )
}
```

### 3. Translation Structure

Generational variants are stored in `en.json` under `marketingGenerational`:

```json
{
  "marketing": {
    "hero": {
      "headline": "Default copy here"
    }
  },
  "marketingGenerational": {
    "baby-boomer": {
      "hero": {
        "headline": "Baby Boomer variant here"
      }
    },
    "gen-z": {
      "hero": {
        "headline": "Gen Z variant here"
      }
    }
  }
}
```

### 4. Toggle Component

The `GenerationalLanguageToggle` component is integrated into the marketing nav:

```tsx
import { GenerationalLanguageToggle } from "@/components/marketing/GenerationalLanguageToggle"

<GenerationalLanguageToggle />
```

## User Experience

1. **Persistence**: User's preference is saved in `localStorage`
2. **Default**: System defaults to "Default" variant (Millennial-optimized)
3. **Fallback**: If a generational variant doesn't exist for a key, it falls back to default
4. **Visual Feedback**: Current selection is highlighted with a checkmark

## Coverage

Currently implemented for:
- ✅ Hero Section
- ✅ Problem Section
- ✅ Solution Section
- ✅ Testimonials Section

To add to other sections:
1. Replace `useTranslations('marketing')` with `useGenerationalMarketing()`
2. Replace `t('key')` with `tGen('section.key')`
3. Add generational variants to `en.json` under `marketingGenerational`

## Scripts

### Update Default Brand Voice
```bash
node scripts/update-marketing-brand-voice.js
```

### Generate Generational Variants
```bash
node scripts/generate-generational-marketing-copy.js
```

## Best Practices

1. **Maintain Core Message**: All variants should convey the same information
2. **Respect Tone**: Each generation has distinct communication preferences
3. **Avoid Stereotypes**: Use research-backed generational characteristics
4. **Test Readability**: Ensure all variants are clear and professional
5. **Fallback Gracefully**: Always provide default copy as fallback

## Future Enhancements

- [ ] Add A/B testing to measure variant effectiveness
- [ ] Expand coverage to all marketing sections
- [ ] Add analytics to track variant usage
- [ ] Create admin interface for managing variants
- [ ] Support for mixing variants (e.g., 70% Millennial + 30% Gen Z)

## Technical Details

### Files Created
- `/src/types/generational-language.ts` - Type definitions
- `/src/contexts/GenerationalLanguageContext.tsx` - React context
- `/src/hooks/use-generational-marketing.ts` - Custom hook
- `/src/components/marketing/GenerationalLanguageToggle.tsx` - UI component
- `/scripts/update-marketing-brand-voice.js` - Brand voice updater
- `/scripts/generate-generational-marketing-copy.js` - Variant generator

### Files Modified
- `/src/app/[locale]/(marketing)/layout.tsx` - Added provider
- `/src/marketing/components/MarketingNav.tsx` - Added toggle
- `/src/marketing/components/sections/HeroSection.tsx` - Example implementation
- `/src/i18n/messages/en.json` - Added generational variants

## Maintenance

When adding new marketing copy:
1. Add default copy to `marketing` section in `en.json`
2. Generate variants using the script or manually add to `marketingGenerational`
3. Update components to use `tGen()` instead of `t()`
4. Test all variants to ensure proper fallback behavior

## Support

For questions or issues with the generational language system, refer to:
- This documentation
- Type definitions in `/src/types/generational-language.ts`
- Hook implementation in `/src/hooks/use-generational-marketing.ts`
