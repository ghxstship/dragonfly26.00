# Country/Region Localization System - Complete Guide

## Overview

The comprehensive country/region localization system automatically handles:
- **Currency** conversion and formatting
- **Tax calculation** (VAT, GST, Sales Tax, etc.)
- **Compliance** requirements (GDPR, CCPA, age restrictions)
- **Date/time** formatting
- **Measurement** systems (metric/imperial)
- **Payment methods** availability
- **Language** preferences

## Quick Start

### 1. Wrap Your App with LocaleProvider

```tsx
// app/layout.tsx
import { LocaleProvider } from '@/contexts/LocaleContext'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <LocaleProvider defaultCountry="US">
          {children}
        </LocaleProvider>
      </body>
    </html>
  )
}
```

### 2. Use the Hook in Your Components

```tsx
import { useCountrySettings } from '@/hooks/useCountrySettings'

export function MyComponent() {
  const { 
    calculatePrice, 
    formatAmount, 
    setCountry,
    localeState 
  } = useCountrySettings()

  // Calculate price with tax
  const price = calculatePrice(100) // $100 base price
  
  return (
    <div>
      <p>Total: {price.formatted}</p>
      <p>Tax: {formatAmount(price.taxAmount)}</p>
    </div>
  )
}
```

## Core Features

### Currency Management

```tsx
const { formatAmount, localeState } = useCountrySettings()

// Format any amount in local currency
const formatted = formatAmount(99.99)
// US: "$99.99"
// UK: "£99.99"
// EU: "99,99 €"
// JP: "¥100"
```

### Tax Calculation

The system supports multiple tax systems:
- **VAT** (Value Added Tax) - EU, UK
- **GST** (Goods and Services Tax) - Australia, India, Singapore
- **Sales Tax** - US (state-level)
- **GST/PST** - Canada (federal + provincial)
- **IVA** - Mexico
- **Consumption Tax** - Japan
- **Complex** - Brazil (multiple tax layers)

```tsx
const { calculatePrice, getTaxInfo } = useCountrySettings()

// Automatically calculates correct tax
const price = calculatePrice(100)
console.log(price.basePrice)    // 100
console.log(price.taxAmount)    // Varies by country
console.log(price.totalPrice)   // Base + Tax
console.log(price.formatted)    // Localized string

// Get tax system info
const taxInfo = getTaxInfo()
console.log(taxInfo.taxInclusive)  // true/false
console.log(taxInfo.taxRate)       // 0.20 (20%)
console.log(taxInfo.taxSystem)     // 'vat', 'gst', etc.
```

### Date & Time Formatting

```tsx
const { formatLocalDate, formatLocalTime } = useCountrySettings()

const date = new Date()

// US: "11/05/2025"
// UK: "05/11/2025"
// CA: "2025-11-05"
// DE: "05.11.2025"
const formattedDate = formatLocalDate(date)

// US: "9:30 AM"
// UK: "09:30"
// DE: "09:30"
const formattedTime = formatLocalTime(date)
```

### Compliance Checks

```tsx
const { 
  isGDPRRequired, 
  isCCPARequired, 
  getMinimumAge,
  getPaymentMethods 
} = useCountrySettings()

// Check if GDPR compliance needed
if (isGDPRRequired()) {
  // Show cookie consent banner
}

// Check if CCPA compliance needed
if (isCCPARequired()) {
  // Show "Do Not Sell" option
}

// Get minimum age requirement
const minAge = getMinimumAge()
// US: 13, EU: varies 13-16, BR: 18

// Get allowed payment methods
const methods = getPaymentMethods()
// US: ['card', 'paypal', 'apple_pay', 'google_pay', 'ach']
// IN: ['card', 'upi', 'netbanking', 'paytm', 'google_pay']
```

### Postal Code Validation

```tsx
const { validatePostal } = useCountrySettings()

// Validates against country-specific patterns
const isValid = validatePostal('12345')      // US: true
const isValid = validatePostal('SW1A 1AA')   // UK: true
const isValid = validatePostal('K1A 0B1')    // CA: true
```

## Components

### CountrySelector

Dropdown component for selecting country/region:

```tsx
import { CountrySelector } from '@/components/layout/country-selector'

export function Header() {
  return (
    <nav>
      <CountrySelector />
    </nav>
  )
}
```

Features:
- Search functionality
- Grouped by region
- Shows currency and language
- Displays compliance badges (GDPR)
- Responsive design

### GDPRBanner

Automatic cookie consent banner for GDPR-required countries:

```tsx
import { GDPRBanner } from '@/components/compliance/gdpr-banner'

export function Layout({ children }) {
  return (
    <>
      {children}
      <GDPRBanner />
    </>
  )
}
```

Features:
- Only shows in GDPR countries
- Remembers user choice
- Accept all / Essential only options
- Links to privacy policy

### AgeVerification

Age verification modal for age-restricted content:

```tsx
import { AgeVerification } from '@/components/compliance/age-verification'

export function RestrictedContent() {
  const [verified, setVerified] = useState(false)

  if (!verified) {
    return (
      <AgeVerification 
        onVerified={() => setVerified(true)}
        onRejected={() => router.push('/')}
      />
    )
  }

  return <div>Restricted content here</div>
}
```

## Supported Countries

Currently configured countries (10):
- 🇺🇸 United States
- 🇬🇧 United Kingdom
- 🇨🇦 Canada
- 🇩🇪 Germany
- 🇫🇷 France
- 🇦🇺 Australia
- 🇮🇳 India
- 🇯🇵 Japan
- 🇧🇷 Brazil
- 🇲🇽 Mexico

### Adding New Countries

Edit `/src/config/countries.ts`:

```typescript
export const countries: Record<string, CountryConfig> = {
  // ... existing countries
  
  NL: {
    name: 'Netherlands',
    code: 'NL',
    region: 'Europe',
    flag: '🇳🇱',
    currency: 'EUR',
    language: 'nl',
    alternativeLanguages: ['en'],
    taxSystem: 'vat',
    taxRates: { standard: 0.21, reduced: 0.09, zero: 0 },
    taxInclusive: true,
    dateFormat: 'DD-MM-YYYY',
    timeFormat: '24h',
    measurementSystem: 'metric',
    phoneFormat: '+31 X XXXX XXXX',
    addressFormat: {
      line1: 'Straat en Huisnummer',
      line2: 'Toevoeging (optioneel)',
      city: 'Plaats',
      state: 'Provincie (optioneel)',
      postalCode: 'Postcode',
      postalCodePattern: '^\\d{4}\\s?[A-Z]{2}$'
    },
    compliance: {
      gdprRequired: true,
      ccpaRequired: false,
      ageRestriction: 16,
      cookieConsent: 'required',
      dataResidency: 'EU',
      allowedPaymentMethods: ['card', 'ideal', 'paypal'],
      shippingRestrictions: [],
      businessHoursTimezone: 'Europe/Amsterdam'
    }
  }
}
```

## State/Province Support

For countries with state/province-level taxes (US, Canada):

```tsx
const { setCountry } = useCountrySettings()

// Set country with state
setCountry('US', 'CA')  // California
setCountry('CA', 'ON')  // Ontario

// Tax rates automatically adjust
```

## Integration with Existing i18n

The system integrates with your existing next-intl setup:

```tsx
// When country changes, language can auto-update
const { setCountry, localeState } = useCountrySettings()

// Changing to Germany automatically suggests German
setCountry('DE')  // Sets language to 'de'

// But user can still manually change language
// via the existing LanguageSwitcher component
```

## Best Practices

### 1. Always Show Tax Breakdown

```tsx
<div>
  <div>Subtotal: {formatAmount(price.basePrice)}</div>
  <div>Tax: {formatAmount(price.taxAmount)}</div>
  <div>Total: {price.formatted}</div>
</div>
```

### 2. Respect Tax Display Preferences

```tsx
const { getTaxInfo } = useCountrySettings()
const { taxInclusive } = getTaxInfo()

if (taxInclusive) {
  // Show: "$120 (incl. tax)"
} else {
  // Show: "$100 + $20 tax"
}
```

### 3. Check Compliance Before Collecting Data

```tsx
if (isGDPRRequired()) {
  // Must get explicit consent
  // Must provide data export
  // Must honor deletion requests
}

if (isCCPARequired()) {
  // Must provide "Do Not Sell" option
  // Must disclose data collection
}
```

### 4. Validate Forms Based on Country

```tsx
const { validatePostal, countryConfig } = useCountrySettings()

// Use country-specific validation
<Input
  pattern={countryConfig?.addressFormat.postalCodePattern}
  onBlur={(e) => {
    if (!validatePostal(e.target.value)) {
      setError('Invalid postal code format')
    }
  }}
/>
```

## Testing

```tsx
// Test with different countries
const { setCountry } = useCountrySettings()

// Test US sales tax
setCountry('US', 'CA')

// Test EU VAT
setCountry('DE')

// Test Canadian GST/PST
setCountry('CA', 'ON')

// Test GDPR compliance
setCountry('GB')  // Should show GDPR banner

// Test age restrictions
setCountry('BR')  // 18+ requirement
setCountry('US')  // 13+ requirement
```

## API Reference

### useCountrySettings()

Returns:
- `localeState`: Current locale state
- `countryConfig`: Full country configuration
- `stateOrProvince`: Current state/province
- `setCountry(code, state?)`: Change country
- `calculatePrice(basePrice)`: Calculate with tax
- `formatAmount(amount)`: Format currency
- `formatLocalDate(date)`: Format date
- `formatLocalTime(date)`: Format time
- `validatePostal(code)`: Validate postal code
- `isGDPRRequired()`: Check GDPR
- `isCCPARequired()`: Check CCPA
- `getMinimumAge()`: Get age restriction
- `getPaymentMethods()`: Get allowed methods
- `isPaymentMethodAllowed(method)`: Check method
- `getTaxInfo()`: Get tax system info

## Files Created

- `/src/types/country.ts` - TypeScript types
- `/src/config/countries.ts` - Country configurations
- `/src/utils/localization.ts` - Utility functions
- `/src/contexts/LocaleContext.tsx` - React context
- `/src/hooks/useCountrySettings.ts` - Custom hook
- `/src/components/layout/country-selector.tsx` - UI component
- `/src/components/compliance/gdpr-banner.tsx` - GDPR component
- `/src/components/compliance/age-verification.tsx` - Age verification
- `/src/components/examples/pricing-display-example.tsx` - Example usage

## Next Steps

1. Add more countries as needed
2. Integrate with payment processing
3. Connect to currency exchange API for real-time rates
4. Add more compliance components (CCPA banner, etc.)
5. Implement data residency routing
6. Add analytics tracking by region
7. Create admin panel for managing country configs

## Support

For questions or issues, refer to the codebase or create an issue in the repository.
