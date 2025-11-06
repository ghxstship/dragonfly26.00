export type TaxSystem = 'vat' | 'sales_tax' | 'gst' | 'gst_pst' | 'iva' | 'consumption_tax' | 'complex'

export type MeasurementSystem = 'metric' | 'imperial'

export type TimeFormat = '12h' | '24h'

export interface TaxRates {
  federal?: number
  standard?: number
  reduced?: number
  superReduced?: number
  low?: number
  intermediate?: number
  zero?: number
  state?: Record<string, number>
  provincial?: Record<string, number>
  municipal?: number
  border?: number
}

export interface AddressFormat {
  line1: string
  line2: string
  city: string
  state: string
  postalCode: string
  postalCodePattern: string
}

export interface ComplianceRules {
  gdprRequired: boolean
  ccpaRequired: boolean
  pipedaRequired?: boolean
  dpdpaRequired?: boolean
  appiRequired?: boolean
  lgpdRequired?: boolean
  lfpdpppRequired?: boolean
  privacyActRequired?: boolean
  pdpaRequired?: boolean
  pipaRequired?: boolean
  difcRequired?: boolean
  popiaRequired?: boolean
  piplRequired?: boolean
  fzRequired?: boolean
  pdpRequired?: boolean
  kvkkRequired?: boolean
  pdplRequired?: boolean
  fadpRequired?: boolean
  ndprRequired?: boolean
  dpaRequired?: boolean
  ageRestriction: number
  cookieConsent: 'required' | 'optional'
  dataResidency: string
  allowedPaymentMethods: string[]
  shippingRestrictions: string[]
  businessHoursTimezone: string
}

export interface CountryConfig {
  name: string
  code: string
  region: string
  flag: string
  currency: string
  language: string
  alternativeLanguages: string[]
  taxSystem: TaxSystem
  taxRates: TaxRates
  taxInclusive: boolean
  dateFormat: string
  timeFormat: TimeFormat
  measurementSystem: MeasurementSystem
  phoneFormat: string
  addressFormat: AddressFormat
  compliance: ComplianceRules
}

export interface CountryConfigs {
  countries: Record<string, CountryConfig>
}

export interface LocaleState {
  selectedCountry: string
  language: string
  currency: string
  taxRate: number
  complianceRules: ComplianceRules
  dateFormat: string
  timeFormat: TimeFormat
  measurementSystem: MeasurementSystem
}

export interface PriceDisplay {
  basePrice: number
  taxAmount: number
  totalPrice: number
  currency: string
  formatted: string
}
