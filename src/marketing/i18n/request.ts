import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async () => {
  // Marketing site is English-only for now, but infrastructure supports 20 languages
  const locale = 'en';

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default
  };
});
