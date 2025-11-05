import type { CountryConfig } from '@/types/country'

export const countries: Record<string, CountryConfig> = {
  US: {
    name: 'United States',
    code: 'US',
    region: 'North America',
    flag: '🇺🇸',
    currency: 'USD',
    language: 'en',
    alternativeLanguages: ['es', 'zh', 'vi', 'ko', 'fr'],
    taxSystem: 'sales_tax',
    taxRates: {
      federal: 0,
      state: {
        CA: 0.0725, NY: 0.04, TX: 0.0625, FL: 0.06, IL: 0.0625,
        PA: 0.06, OH: 0.0575, GA: 0.04, NC: 0.0475, MI: 0.06
      }
    },
    taxInclusive: false,
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',
    measurementSystem: 'imperial',
    phoneFormat: '+1 (XXX) XXX-XXXX',
    addressFormat: {
      line1: 'Street Address',
      line2: 'Apt/Suite (optional)',
      city: 'City',
      state: 'State',
      postalCode: 'ZIP Code',
      postalCodePattern: '^\\d{5}(-\\d{4})?$'
    },
    compliance: {
      gdprRequired: false,
      ccpaRequired: true,
      ageRestriction: 13,
      cookieConsent: 'optional',
      dataResidency: 'US',
      allowedPaymentMethods: ['card', 'paypal', 'apple_pay', 'google_pay', 'ach'],
      shippingRestrictions: [],
      businessHoursTimezone: 'America/New_York'
    }
  },
  GB: {
    name: 'United Kingdom',
    code: 'GB',
    region: 'Europe',
    flag: '🇬🇧',
    currency: 'GBP',
    language: 'en',
    alternativeLanguages: ['pl', 'ur', 'bn'],
    taxSystem: 'vat',
    taxRates: { standard: 0.20, reduced: 0.05, zero: 0 },
    taxInclusive: true,
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    measurementSystem: 'metric',
    phoneFormat: '+44 XXXX XXXXXX',
    addressFormat: {
      line1: 'Address Line 1',
      line2: 'Address Line 2 (optional)',
      city: 'Town/City',
      state: 'County (optional)',
      postalCode: 'Postcode',
      postalCodePattern: '^[A-Z]{1,2}\\d{1,2}[A-Z]?\\s?\\d[A-Z]{2}$'
    },
    compliance: {
      gdprRequired: true,
      ccpaRequired: false,
      ageRestriction: 13,
      cookieConsent: 'required',
      dataResidency: 'EU',
      allowedPaymentMethods: ['card', 'paypal', 'apple_pay', 'google_pay', 'bank_transfer'],
      shippingRestrictions: [],
      businessHoursTimezone: 'Europe/London'
    }
  },
  CA: {
    name: 'Canada',
    code: 'CA',
    region: 'North America',
    flag: '🇨🇦',
    currency: 'CAD',
    language: 'en',
    alternativeLanguages: ['fr', 'zh', 'pa', 'es'],
    taxSystem: 'gst_pst',
    taxRates: {
      federal: 0.05,
      provincial: {
        ON: 0.08, QC: 0.09975, BC: 0.07, AB: 0, MB: 0.07,
        SK: 0.06, NS: 0.10, NB: 0.10, NL: 0.10, PE: 0.10
      }
    },
    taxInclusive: false,
    dateFormat: 'YYYY-MM-DD',
    timeFormat: '12h',
    measurementSystem: 'metric',
    phoneFormat: '+1 (XXX) XXX-XXXX',
    addressFormat: {
      line1: 'Street Address',
      line2: 'Unit/Apt (optional)',
      city: 'City',
      state: 'Province',
      postalCode: 'Postal Code',
      postalCodePattern: '^[A-Z]\\d[A-Z]\\s?\\d[A-Z]\\d$'
    },
    compliance: {
      gdprRequired: false,
      ccpaRequired: false,
      pipedaRequired: true,
      ageRestriction: 13,
      cookieConsent: 'optional',
      dataResidency: 'CA',
      allowedPaymentMethods: ['card', 'paypal', 'apple_pay', 'google_pay', 'interac'],
      shippingRestrictions: [],
      businessHoursTimezone: 'America/Toronto'
    }
  },
  DE: {
    name: 'Germany',
    code: 'DE',
    region: 'Europe',
    flag: '🇩🇪',
    currency: 'EUR',
    language: 'de',
    alternativeLanguages: ['en', 'tr', 'ru'],
    taxSystem: 'vat',
    taxRates: { standard: 0.19, reduced: 0.07, zero: 0 },
    taxInclusive: true,
    dateFormat: 'DD.MM.YYYY',
    timeFormat: '24h',
    measurementSystem: 'metric',
    phoneFormat: '+49 XXX XXXXXXX',
    addressFormat: {
      line1: 'Straße und Hausnummer',
      line2: 'Adresszusatz (optional)',
      city: 'Stadt',
      state: 'Bundesland (optional)',
      postalCode: 'Postleitzahl',
      postalCodePattern: '^\\d{5}$'
    },
    compliance: {
      gdprRequired: true,
      ccpaRequired: false,
      ageRestriction: 16,
      cookieConsent: 'required',
      dataResidency: 'EU',
      allowedPaymentMethods: ['card', 'paypal', 'apple_pay', 'google_pay', 'sepa', 'sofort'],
      shippingRestrictions: [],
      businessHoursTimezone: 'Europe/Berlin'
    }
  },
  FR: {
    name: 'France',
    code: 'FR',
    region: 'Europe',
    flag: '🇫🇷',
    currency: 'EUR',
    language: 'fr',
    alternativeLanguages: ['en', 'ar', 'es'],
    taxSystem: 'vat',
    taxRates: { standard: 0.20, reduced: 0.055, intermediate: 0.10, zero: 0 },
    taxInclusive: true,
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    measurementSystem: 'metric',
    phoneFormat: '+33 X XX XX XX XX',
    addressFormat: {
      line1: 'Numéro et nom de rue',
      line2: 'Complément d\'adresse (optionnel)',
      city: 'Ville',
      state: 'Région (optionnel)',
      postalCode: 'Code postal',
      postalCodePattern: '^\\d{5}$'
    },
    compliance: {
      gdprRequired: true,
      ccpaRequired: false,
      ageRestriction: 15,
      cookieConsent: 'required',
      dataResidency: 'EU',
      allowedPaymentMethods: ['card', 'paypal', 'apple_pay', 'google_pay', 'sepa'],
      shippingRestrictions: [],
      businessHoursTimezone: 'Europe/Paris'
    }
  },
  AU: {
    name: 'Australia',
    code: 'AU',
    region: 'Oceania',
    flag: '🇦🇺',
    currency: 'AUD',
    language: 'en',
    alternativeLanguages: ['zh', 'vi', 'ar', 'it'],
    taxSystem: 'gst',
    taxRates: { standard: 0.10, zero: 0 },
    taxInclusive: true,
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '12h',
    measurementSystem: 'metric',
    phoneFormat: '+61 X XXXX XXXX',
    addressFormat: {
      line1: 'Street Address',
      line2: 'Unit/Apt (optional)',
      city: 'Suburb',
      state: 'State',
      postalCode: 'Postcode',
      postalCodePattern: '^\\d{4}$'
    },
    compliance: {
      gdprRequired: false,
      ccpaRequired: false,
      privacyActRequired: true,
      ageRestriction: 13,
      cookieConsent: 'optional',
      dataResidency: 'AU',
      allowedPaymentMethods: ['card', 'paypal', 'apple_pay', 'google_pay', 'bpay'],
      shippingRestrictions: [],
      businessHoursTimezone: 'Australia/Sydney'
    }
  },
  IN: {
    name: 'India',
    code: 'IN',
    region: 'Asia',
    flag: '🇮🇳',
    currency: 'INR',
    language: 'hi',
    alternativeLanguages: ['en', 'bn', 'te', 'mr', 'ta', 'ur'],
    taxSystem: 'gst',
    taxRates: { standard: 0.18, reduced: 0.05, intermediate: 0.12, zero: 0 },
    taxInclusive: true,
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '12h',
    measurementSystem: 'metric',
    phoneFormat: '+91 XXXXX XXXXX',
    addressFormat: {
      line1: 'House/Building No., Street',
      line2: 'Locality/Area (optional)',
      city: 'City',
      state: 'State',
      postalCode: 'PIN Code',
      postalCodePattern: '^\\d{6}$'
    },
    compliance: {
      gdprRequired: false,
      ccpaRequired: false,
      dpdpaRequired: true,
      ageRestriction: 18,
      cookieConsent: 'optional',
      dataResidency: 'IN',
      allowedPaymentMethods: ['card', 'upi', 'netbanking', 'paytm', 'google_pay'],
      shippingRestrictions: [],
      businessHoursTimezone: 'Asia/Kolkata'
    }
  },
  JP: {
    name: 'Japan',
    code: 'JP',
    region: 'Asia',
    flag: '🇯🇵',
    currency: 'JPY',
    language: 'ja',
    alternativeLanguages: ['en'],
    taxSystem: 'consumption_tax',
    taxRates: { standard: 0.10, reduced: 0.08, zero: 0 },
    taxInclusive: true,
    dateFormat: 'YYYY/MM/DD',
    timeFormat: '24h',
    measurementSystem: 'metric',
    phoneFormat: '+81 XX XXXX XXXX',
    addressFormat: {
      line1: 'Building, Room Number',
      line2: 'Street Address',
      city: 'City/Ward',
      state: 'Prefecture',
      postalCode: 'Postal Code',
      postalCodePattern: '^\\d{3}-\\d{4}$'
    },
    compliance: {
      gdprRequired: false,
      ccpaRequired: false,
      appiRequired: true,
      ageRestriction: 13,
      cookieConsent: 'optional',
      dataResidency: 'JP',
      allowedPaymentMethods: ['card', 'konbini', 'bank_transfer', 'paypay'],
      shippingRestrictions: [],
      businessHoursTimezone: 'Asia/Tokyo'
    }
  },
  BR: {
    name: 'Brazil',
    code: 'BR',
    region: 'South America',
    flag: '🇧🇷',
    currency: 'BRL',
    language: 'pt',
    alternativeLanguages: ['en', 'es'],
    taxSystem: 'complex',
    taxRates: { federal: 0.165, municipal: 0.05 },
    taxInclusive: true,
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    measurementSystem: 'metric',
    phoneFormat: '+55 (XX) XXXXX-XXXX',
    addressFormat: {
      line1: 'Rua, Número',
      line2: 'Complemento (opcional)',
      city: 'Cidade',
      state: 'Estado',
      postalCode: 'CEP',
      postalCodePattern: '^\\d{5}-\\d{3}$'
    },
    compliance: {
      gdprRequired: false,
      ccpaRequired: false,
      lgpdRequired: true,
      ageRestriction: 18,
      cookieConsent: 'required',
      dataResidency: 'BR',
      allowedPaymentMethods: ['card', 'pix', 'boleto', 'paypal'],
      shippingRestrictions: [],
      businessHoursTimezone: 'America/Sao_Paulo'
    }
  },
  MX: {
    name: 'Mexico',
    code: 'MX',
    region: 'North America',
    flag: '🇲🇽',
    currency: 'MXN',
    language: 'es',
    alternativeLanguages: ['en'],
    taxSystem: 'iva',
    taxRates: { standard: 0.16, border: 0.08, zero: 0 },
    taxInclusive: true,
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '12h',
    measurementSystem: 'metric',
    phoneFormat: '+52 XX XXXX XXXX',
    addressFormat: {
      line1: 'Calle y Número',
      line2: 'Colonia',
      city: 'Ciudad',
      state: 'Estado',
      postalCode: 'Código Postal',
      postalCodePattern: '^\\d{5}$'
    },
    compliance: {
      gdprRequired: false,
      ccpaRequired: false,
      lfpdpppRequired: true,
      ageRestriction: 18,
      cookieConsent: 'optional',
      dataResidency: 'MX',
      allowedPaymentMethods: ['card', 'oxxo', 'spei', 'paypal'],
      shippingRestrictions: [],
      businessHoursTimezone: 'America/Mexico_City'
    }
  }
}

export const countryList = Object.values(countries).sort((a, b) => a.name.localeCompare(b.name))

export const regionGroups = {
  'North America': ['US', 'CA', 'MX'],
  'Europe': ['GB', 'DE', 'FR'],
  'Asia': ['IN', 'JP'],
  'Oceania': ['AU'],
  'South America': ['BR']
}
