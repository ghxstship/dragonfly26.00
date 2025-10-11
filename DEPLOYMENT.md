# Deployment Guide

This guide covers deploying your ClickUp clone to production.

## Prerequisites

- Node.js 18+ installed
- A Supabase account
- A Stripe account
- A Vercel account (recommended) or another hosting provider

## 1. Supabase Setup

### Create a New Project

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Click "New Project"
3. Enter project details:
   - Name: `clickup-clone-prod`
   - Database Password: (generate secure password)
   - Region: Choose closest to your users

### Run Database Migrations

1. Install Supabase CLI:
```bash
npm install -g supabase
```

2. Link your project:
```bash
supabase link --project-ref your-project-ref
```

3. Run migrations:
```bash
supabase db push
```

Or manually run the SQL from `/supabase/migrations/001_initial_schema.sql` in the SQL Editor.

### Get API Keys

1. Go to Project Settings → API
2. Copy:
   - Project URL
   - `anon` public key
   - `service_role` secret key

### Configure Auth Providers (Optional)

1. Go to Authentication → Providers
2. Enable providers (Google, GitHub, etc.)
3. Configure OAuth credentials

## 2. Stripe Setup

### Create Products & Prices

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to Products → Add Product

Create 4 subscription products:

**Free Tier**
- Name: Free
- Price: $0/month
- Copy Price ID (starts with `price_`)

**Pro Tier**
- Name: Pro
- Price: $10/month
- Copy Price ID

**Business Tier**
- Name: Business
- Price: $25/month
- Copy Price ID

**Enterprise Tier**
- Name: Enterprise
- Custom pricing (contact sales)

### Enable Webhooks

1. Go to Developers → Webhooks
2. Add endpoint: `https://yourdomain.com/api/stripe/webhook`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.paid`
   - `invoice.payment_failed`
4. Copy Webhook Signing Secret

### Get API Keys

1. Go to Developers → API Keys
2. Copy:
   - Publishable key (starts with `pk_`)
   - Secret key (starts with `sk_`)

**Note**: Use test keys for development, live keys for production.

## 3. Vercel Deployment

### Install Vercel CLI

```bash
npm install -g vercel
```

### Connect Repository

1. Push code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository

### Configure Environment Variables

In Vercel project settings, add these environment variables:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://yourproject.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# App
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### Deploy

```bash
vercel --prod
```

Or push to your `main` branch for automatic deployment.

## 4. Alternative Deployments

### Self-Hosted (Docker)

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

Build and run:

```bash
docker build -t clickup-clone .
docker run -p 3000:3000 --env-file .env clickup-clone
```

### AWS (Amplify/App Runner)

1. Connect GitHub repository
2. Configure build settings:
   - Build command: `npm run build`
   - Output directory: `.next`
3. Add environment variables
4. Deploy

### DigitalOcean App Platform

1. Create new app from GitHub
2. Configure:
   - Build Command: `npm run build`
   - Run Command: `npm start`
3. Add environment variables
4. Deploy

## 5. Domain Configuration

### Custom Domain Setup

1. In Vercel: Settings → Domains
2. Add your domain (e.g., `app.yourdomain.com`)
3. Update DNS records:
   - Type: CNAME
   - Name: app
   - Value: cname.vercel-dns.com

### SSL Certificate

Vercel automatically provisions SSL certificates. For self-hosted:

```bash
# Using Let's Encrypt
sudo certbot --nginx -d app.yourdomain.com
```

## 6. Post-Deployment Configuration

### Update Stripe Webhook URL

1. Go to Stripe Dashboard → Webhooks
2. Update endpoint URL to production domain
3. Update webhook secret in environment variables

### Update Supabase Auth URLs

1. Go to Supabase Dashboard → Authentication → URL Configuration
2. Set:
   - Site URL: `https://yourdomain.com`
   - Redirect URLs: `https://yourdomain.com/auth/callback`

### Configure CORS

In Supabase Dashboard → API Settings:
- Add your production domain to allowed origins

## 7. Monitoring & Analytics

### Vercel Analytics

Enable in Vercel Dashboard → Analytics

### Error Tracking (Sentry - Optional)

1. Create Sentry account
2. Install SDK:
```bash
npm install @sentry/nextjs
```

3. Add to `next.config.js`:
```javascript
const { withSentryConfig } = require('@sentry/nextjs')

module.exports = withSentryConfig(nextConfig, {
  org: 'your-org',
  project: 'clickup-clone',
})
```

### Performance Monitoring

- Enable Vercel Speed Insights
- Configure Web Vitals tracking
- Monitor Supabase performance metrics

## 8. Security Checklist

- [ ] All API keys stored in environment variables
- [ ] Row Level Security (RLS) enabled on all Supabase tables
- [ ] Stripe webhook signatures validated
- [ ] HTTPS enforced
- [ ] CSP headers configured
- [ ] Rate limiting on API routes
- [ ] Input validation on all forms
- [ ] SQL injection protection (parameterized queries)
- [ ] XSS protection (React escapes by default)
- [ ] Regular dependency updates

## 9. Scaling Considerations

### Database

- **Supabase**: Upgrade to Pro ($25/month) for better performance
- **Connection Pooling**: Enable PgBouncer in Supabase
- **Read Replicas**: For high-traffic applications

### Caching

Add Redis for caching:
- Session data
- Frequently accessed data
- Rate limiting

### CDN

Vercel includes global CDN automatically. For assets:
- Use Supabase Storage for files
- Enable CDN on storage buckets

### Monitoring

Set up alerts for:
- API response times > 1s
- Error rates > 1%
- Database connection pool exhaustion
- High memory usage

## 10. Backup Strategy

### Database Backups

Supabase Pro includes:
- Daily automated backups
- Point-in-time recovery

Manual backup:
```bash
pg_dump -h your-project.supabase.co -U postgres -d postgres > backup.sql
```

### Application Code

- Keep Git repository up to date
- Tag production releases
- Maintain changelog

## 11. Troubleshooting

### Build Failures

Check build logs for:
- Missing environment variables
- TypeScript errors
- Dependency conflicts

### Runtime Errors

Common issues:
- **"Module not found"**: Check imports and paths
- **Supabase errors**: Verify RLS policies
- **Stripe errors**: Check API keys and webhook signatures

### Performance Issues

- Enable Next.js debug mode: `DEBUG=* npm start`
- Check Vercel function logs
- Monitor Supabase query performance

## 12. Maintenance

### Regular Updates

```bash
# Update dependencies
npm update

# Check for security vulnerabilities
npm audit

# Update Next.js
npm install next@latest react@latest react-dom@latest
```

### Database Maintenance

```bash
# Run migrations
supabase db push

# Vacuum database (Supabase handles this automatically)
```

## Support

For deployment issues:
- Vercel: https://vercel.com/support
- Supabase: https://supabase.com/support
- Stripe: https://support.stripe.com

For application issues, check:
- GitHub Issues
- Documentation
- Community Discord
