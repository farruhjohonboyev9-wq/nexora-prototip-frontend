# Cloudflare + Railway Integration Setup

## 🎯 Architecture

```
Frontend (Cloudflare Pages)
    ↓
HTTPS Request
    ↓
Backend (Railway) API
    ↓
Database
```

---

## 🔧 Configuration

### Frontend Environment
**File: `.env` (Already configured)**
```env
VITE_API_URL=https://nexora-prototype-production.up.railway.app
```

### Cloudflare Pages Environment Variables

1. Go to: **Cloudflare Dashboard → Pages → nexora-prototip-frontend**
2. Settings → Environment variables
3. Add Production variable:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://nexora-prototype-production.up.railway.app`

---

## 🛡️ CORS Setup (Backend)

### Python (Django/Flask)

```python
# settings.py (Django) or config (Flask)

# Install: pip install django-cors-headers
INSTALLED_APPS = [
    ...
    'corsheaders',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    ...
]

CORS_ALLOWED_ORIGINS = [
    "https://nexora-prototip-frontend.pages.dev",
    "http://localhost:5173",  # Local development
    "http://127.0.0.1:5173",
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

### FastAPI
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://nexora-prototip-frontend.pages.dev",
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## 📝 API Client Usage

### Import in Components
```typescript
import { GET, POST, PUT, DELETE } from '@/api/client';
```

### Examples

**Get Posts:**
```typescript
const posts = await GET('/api/posts');
```

**Create Post:**
```typescript
const newPost = await POST('/api/posts', {
  content: 'Hello World',
  title: 'My First Post'
});
```

**Update Post:**
```typescript
const updated = await PUT('/api/posts/123', {
  content: 'Updated content'
});
```

**Delete Post:**
```typescript
await DELETE('/api/posts/123');
```

**Skip Authentication (Public Endpoints):**
```typescript
const public = await GET('/api/public', { skipAuth: true });
```

---

## 🔐 Authentication Flow

1. User logs in on Frontend
2. Backend returns auth token
3. Store token: `localStorage.setItem('authToken', token)`
4. API client automatically adds: `Authorization: Bearer {token}`
5. Backend validates token and returns data

### Example Login
```typescript
const loginResponse = await POST('/api/auth/login', {
  email: 'user@example.com',
  password: 'password123'
}, { skipAuth: true });

localStorage.setItem('authToken', loginResponse.token);
```

---

## 🧪 Testing

### Development
```bash
npm run dev
# Frontend: http://localhost:5173
# Backend: http://localhost:3000
```

### Production
- Frontend: `https://nexora-prototip-frontend.pages.dev/feed`
- Backend: `https://nexora-prototype-production.up.railway.app`

---

## 🐛 Troubleshooting

### CORS Error
**Error**: `Access to XMLHttpRequest at 'https://...' from origin 'https://nexora-prototip-frontend.pages.dev' has been blocked by CORS policy`

**Solution**: 
- Ensure backend has correct CORS headers
- Check `CORS_ALLOWED_ORIGINS` includes Cloudflare domain
- Verify `credentials: true` is set

### 404 Error
**Error**: `GET /api/posts 404 Not Found`

**Solution**:
- Check backend routes exist
- Verify `VITE_API_URL` is correct
- Check endpoint path is correct

### 401 Unauthorized
**Error**: `401 Unauthorized`

**Solution**:
- Check token is stored in localStorage
- Verify token format: `Bearer {token}`
- Token might be expired - user needs to re-login

---

## 📊 API Client File Location
- **Location**: `src/api/client.ts`
- **Methods**: GET, POST, PUT, PATCH, DELETE
- **Auth**: Automatic token injection
- **Environment**: Uses `VITE_API_URL`

---

## 🚀 Deployment Checklist

- [ ] Environment variables set in Cloudflare
- [ ] Backend CORS configured
- [ ] Backend running on Railway
- [ ] Frontend deployed on Cloudflare Pages
- [ ] Token storage working
- [ ] API calls returning data
- [ ] No console errors
