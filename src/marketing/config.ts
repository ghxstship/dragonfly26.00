// Marketing site configuration
export const marketingConfig = {
  // App URL - defaults to production domain, can be overridden with env var
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://app.atlvs.one',
  
  // Auth URLs
  signupUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'https://app.atlvs.one'}/en/signup`,
  loginUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'https://app.atlvs.one'}/en/login`,
}
