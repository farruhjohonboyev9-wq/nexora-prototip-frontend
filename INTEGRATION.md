# Frontend-Backend Integration Guide

## 📋 Overview
This frontend (Cloudflare Pages) is integrated with the backend (Railway).

### URLs
- **Frontend**: https://nexora-prototip-frontend.pages.dev/feed
- **Backend**: https://nexora-prototype-production.up.railway.app

## 🔌 Environment Variables

### Production (.env)
```env
VITE_API_URL=https://nexora-prototype-production.up.railway.app
VITE_ENV=production
```

### Development (.env.development)
```env
VITE_API_URL=http://localhost:3000
VITE_ENV=development
```

## 🚀 Using the API Client

### Import
```typescript
import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api';
```

### Examples

#### GET Request
```typescript
const users = await apiGet('/api/users');
const user = await apiGet('/api/users/123');
```

#### POST Request
```typescript
const newUser = await apiPost('/api/users', {
  name: 'John Doe',
  email: 'john@example.com'
});
```

#### PUT Request
```typescript
const updated = await apiPut('/api/users/123', {
  name: 'Jane Doe'
});
```

#### DELETE Request
```typescript
await apiDelete('/api/users/123');
```

#### Skip Authentication
```typescript
const public = await apiGet('/api/public', { skipAuth: true });
```

## 🛡️ CORS Configuration

Make sure Backend (Railway) has these CORS settings configured:

```python
# Django/Flask CORS Headers
CORS_ALLOWED_ORIGINS = [
    "https://nexora-prototip-frontend.pages.dev",
    "http://localhost:5173",  # Local development
]

CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_METHODS = [
    "DELETE",
    "GET",
    "OPTIONS",
    "PATCH",
    "POST",
    "PUT",
]

CORS_ALLOW_HEADERS = [
    "accept",
    "accept-encoding",
    "authorization",
    "content-type",
    "dnt",
    "origin",
    "user-agent",
    "x-csrftoken",
    "x-requested-with",
]
```

## 📦 Cloudflare Pages Deployment

### Build Settings
- **Build command**: `npm run build`
- **Build output directory**: `dist`
- **Root directory**: `/`

### Environment Variables in Cloudflare
1. Go to Cloudflare Pages Dashboard
2. Select your project
3. Settings → Environment variables
4. Add: `VITE_API_URL = https://nexora-prototype-production.up.railway.app`

## 🔄 Authentication Token

The API client automatically includes the auth token from localStorage:
```typescript
localStorage.setItem('authToken', 'your_token_here');
```

Token will be sent as: `Authorization: Bearer your_token_here`

## 🧪 Testing

### Local Development
```bash
# Start development server
npm run dev

# Backend should be running on http://localhost:3000
```

### Production
- Frontend automatically points to Railway backend
- All requests go through: `https://nexora-prototype-production.up.railway.app`

## 📝 Notes
- API responses must be JSON format
- Authentication is automatic via localStorage token
- CORS must be enabled on Backend for cross-origin requests
