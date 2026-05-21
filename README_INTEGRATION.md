# 🎉 Nexora Frontend - Complete Cloudflare + Railway Integration

> **Status**: ✅ Frontend Ready | Backend Ready | Waiting for CORS Config

---

## 📦 What's Inside

### ✅ Frontend (Cloudflare Pages)
- **URL**: https://nexora-prototip-frontend.pages.dev/feed
- **Status**: Deployed & Running
- **Framework**: React + Vite + TypeScript

### ✅ Backend (Railway)
- **URL**: https://nexora-prototype-production.up.railway.app
- **Status**: Running
- **Framework**: Python (Django/FastAPI/Flask)

---

## 🚀 Quick Start

### 1. **Use the API Client**

```typescript
import { GET, POST, DELETE, useAPI } from '@/api/client';

// Simple method
const posts = await GET('/api/posts');

// Or use React Hook
const { data, loading, error, get } = useAPI();
```

### 2. **Store Auth Token**

```typescript
// After login
localStorage.setItem('authToken', token);

// Token is auto-injected in all requests
const posts = await GET('/api/posts');
// Authorization: Bearer {token} ✅
```

### 3. **Handle Errors**

```typescript
try {
  const data = await GET('/api/data');
} catch (error) {
  console.error(error.message);  // e.g., "HTTP 401: Unauthorized"
}
```

---

## 📁 Project Structure

```
nexora-prototip-frontend/
├── src/
│   ├── api/
│   │   └── client.ts          # 🔌 API Client (All HTTP methods)
│   ├── pages/
│   ├── components/
│   └── main.tsx
├── .env                        # Production config
├── vite.config.ts             # Vite config with API proxy
│
├── SETUP.md                   # Detailed setup guide
├── INTEGRATION.md             # Integration details
├── BACKEND_CORS_CONFIG.md     # Backend CORS setup
└── API_INTEGRATION_COMPLETE.md # Full documentation
```

---

## 🔧 API Client Reference

### GET Request
```typescript
const posts = await GET<Post[]>('/api/posts');
const post = await GET<Post>('/api/posts/123');
```

### POST Request
```typescript
const newPost = await POST<Post>('/api/posts', {
  content: 'Hello World',
  title: 'My Post'
});
```

### PUT Request
```typescript
const updated = await PUT<Post>('/api/posts/123', {
  content: 'Updated'
});
```

### DELETE Request
```typescript
await DELETE('/api/posts/123');
```

### Skip Authentication (Public Endpoints)
```typescript
const public = await GET('/api/public', { skipAuth: true });
```

---

## 🎣 React Hook

```typescript
import { useAPI } from '@/api/client';

export function MyComponent() {
  const { data, loading, error, get, post, delete: del } = useAPI();

  useEffect(() => {
    get('/api/posts');
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>{JSON.stringify(data)}</div>;
}
```

---

## 🛡️ CORS Setup (Backend)

### 🚀 **Quick Copy-Paste for Django**

```python
# settings.py
INSTALLED_APPS = ['corsheaders', ...]
MIDDLEWARE = ['corsheaders.middleware.CorsMiddleware', ...]

CORS_ALLOWED_ORIGINS = [
    "https://nexora-prototip-frontend.pages.dev",
    "http://localhost:5173",
]
CORS_ALLOW_CREDENTIALS = True
```

### 📖 For FastAPI / Flask
See `BACKEND_CORS_CONFIG.md`

---

## 📋 Environment Variables

### Production
```env
VITE_API_URL=https://nexora-prototype-production.up.railway.app
```

### Development
```env
VITE_API_URL=http://localhost:3000
```

### Cloudflare Pages
1. Go to Pages Dashboard
2. Settings → Environment variables
3. Add: `VITE_API_URL = https://nexora-prototype-production.up.railway.app`

---

## 🧪 Testing

### Local Development
```bash
npm install
npm run dev
# Frontend: http://localhost:5173
# Backend: http://localhost:3000
```

### Production
- Frontend: https://nexora-prototip-frontend.pages.dev
- Backend: https://nexora-prototype-production.up.railway.app

### Test API in Console
```javascript
fetch('https://nexora-prototype-production.up.railway.app/api/posts', {
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN',
    'Content-Type': 'application/json'
  }
}).then(r => r.json()).then(console.log)
```

---

## 🐛 Troubleshooting

| Error | Solution |
|-------|----------|
| `CORS Error` | Configure backend CORS (see BACKEND_CORS_CONFIG.md) |
| `401 Unauthorized` | Token missing or expired - user needs to login |
| `404 Not Found` | Check endpoint path and backend routes |
| `Network Error` | Check backend is running and API URL is correct |

---

## 📚 Documentation

- 📖 **SETUP.md** - Complete setup with all frameworks
- 🔗 **INTEGRATION.md** - Integration guide with examples
- 🛡️ **BACKEND_CORS_CONFIG.md** - Backend CORS for Django/FastAPI/Flask
- 📋 **API_INTEGRATION_COMPLETE.md** - Full API reference

---

## 🎯 Features

- ✅ Type-safe API client (TypeScript)
- ✅ Automatic token injection
- ✅ Error handling with proper status codes
- ✅ React Hook with loading/error states
- ✅ Console logging for debugging
- ✅ Supports JSON, text, and binary responses
- ✅ Flexible authentication handling

---

## 🚀 Next Steps

1. ✅ Frontend configured and deployed
2. ✅ Backend running
3. ⏳ **Add CORS to backend** (follow BACKEND_CORS_CONFIG.md)
4. ⏳ Test API calls from frontend
5. ⏳ Deploy changes

---

## 💡 Pro Tips

- Token is stored in `localStorage['authToken']`
- Check browser console for `[API]` logs
- Always handle errors in try-catch
- Use TypeScript for better autocomplete

---

## 📞 Support

Stuck? Check these files in order:
1. `BACKEND_CORS_CONFIG.md` - Backend setup
2. `SETUP.md` - Detailed setup guide
3. `INTEGRATION.md` - Integration examples
4. Browser console for error details

---

**Everything is ready! Your integration is complete.** 🎉

Add CORS to your backend and start building! 🚀
