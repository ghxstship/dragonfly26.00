// Marketing site configuration
export const marketingConfig = {
  // App URL - defaults to Vercel URL, can be overridden with env var
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://atlvs-app.vercel.app',
  
  // Auth URLs
  signupUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'https://atlvs-app.vercel.app'}/en/signup`,
  loginUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'https://atlvs-app.vercel.app'}/en/login`,
}
