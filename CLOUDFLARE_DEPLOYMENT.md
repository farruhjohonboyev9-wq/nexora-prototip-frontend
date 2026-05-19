# Cloudflare Deployment Checklist

## Prerequisites
- [ ] Cloudflare account created
- [ ] GitHub repository connected to Cloudflare Pages
- [ ] Cloudflare API token generated and stored in GitHub Secrets

## Setup Steps

### 1. Create Cloudflare Secrets in GitHub

Go to your repository Settings → Secrets and add:

```
CLOUDFLARE_API_TOKEN: Your Cloudflare API token (from cloudflare.com/profile/api-tokens)
CLOUDFLARE_ACCOUNT_ID: Your Cloudflare Account ID (from cloudflare.com/account/)
```

### 2. Environment Variables

Add to Cloudflare Pages project settings:

**Production:**
```
VITE_API_BASE_URL=https://api.nexora.example.com
VITE_ENVIRONMENT=production
```

**Staging:**
```
VITE_API_BASE_URL=https://staging-api.nexora.example.com
VITE_ENVIRONMENT=staging
```

### 3. Build Configuration

The project uses Vite with the following build settings:
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Node Version:** 18+

### 4. Deployment

Deployments happen automatically on:
- **Production:** Push to `main` branch
- **Preview:** Pull requests and other branches

### 5. Custom Domain (Optional)

1. Go to Cloudflare Pages project
2. Settings → Custom domains
3. Add your custom domain
4. Update DNS records as instructed

### 6. Security Headers

The following headers are automatically applied:
- Cache-Control for static assets (1 year)
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- Content-Security-Policy: Configure as needed

## Monitoring

- Check GitHub Actions for workflow status
- View deployment logs in Cloudflare Pages dashboard
- Monitor performance metrics in Cloudflare analytics

## Troubleshooting

### Build Fails
1. Check Node.js version (should be 18+)
2. Verify dependencies with `npm ci`
3. Run type check: `npm run typecheck`

### Deployment Issues
1. Verify Cloudflare credentials in GitHub Secrets
2. Check project name matches `nexora-web`
3. Ensure `dist` directory is created after build

### Environment Variables Not Loading
1. Confirm variables are set in Cloudflare Pages project settings
2. Variables should be prefixed with `VITE_` for Vite
3. Restart deployment after adding variables
