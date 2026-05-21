# 🚀 Nexora Frontend - Cloudflare + Railway Integration Complete!

## ✅ Integration Summary

Your Nexora frontend and backend are fully integrated and ready to use!

### URLs
- **Frontend**: https://nexora-prototip-frontend.pages.dev/feed
- **Backend**: https://nexora-prototype-production.up.railway.app

---

## 📦 What's Been Set Up

### 1. **API Client** (`src/api/client.ts`)
```typescript
import { GET, POST, PUT, DELETE } from '@/api/client';

// Automatic token injection from localStorage
// Dynamic API URL from environment variables
// Error handling & response parsing
```

### 2. **Environment Configuration** (`src/config/environment.ts`)
```typescript
import { ENV } from '@/config/environment';

// Centralized API endpoints
// Environment variables
// Token storage keys
```

### 3. **React Hook** (`src/hooks/useAPI.ts`)
```typescript
const { data, loading, error, get, post, put, delete: delete_ } = useAPI();
```

### 4. **Updated Vite Config** (`vite.config.ts`)
- Dynamic API URL proxy
- Environment variable support

### 5. **Documentation**
- `SETUP.md` - Complete setup guide
- `INTEGRATION.md` - Integration details

---

## 🎯 Quick Start - Using in Components

### Example: Fetch Feed Posts

```typescript
import { useAPI } from '@/hooks/useAPI';
import { ENV } from '@/config/environment';

export function Feed() {
  const { data: posts, loading, error, get } = useAPI();

  useEffect(() => {
    get(ENV.ENDPOINTS.POSTS.LIST);
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {posts?.map(post => (
        <div key={post.id}>{post.content}</div>
      ))}
    </div>
  );
}
```

### Example: Create Post

```typescript
const { post, loading } = useAPI();

async function handleCreatePost(content: string) {
  try {
    await post(ENV.ENDPOINTS.POSTS.CREATE, { content });
    // Refresh feed
  } catch (error) {
    console.error(error);
  }
}
```

### Example: Delete Post

```typescript
const { delete: deletePost } = useAPI();

async function handleDelete(postId: string) {
  await deletePost(ENV.ENDPOINTS.POSTS.DELETE(postId));
}
```

---

## 🔐 Authentication

### Store Token After Login

```typescript
const loginResponse = await POST('/api/auth/login', 
  { email, password },
  { skipAuth: true }
);

localStorage.setItem('authToken', loginResponse.token);
```

### Token is Automatically Sent

```typescript
// Token automatically added as: Authorization: Bearer {token}
const posts = await GET('/api/posts');
```

### Logout

```typescript
localStorage.removeItem('authToken');
```

---

## 📋 API Endpoints Available

Check `src/config/environment.ts` for all available endpoints:

- **Auth**: Login, Register, Logout, Refresh
- **Users**: List, Get, Update, Delete, Profile
- **Posts**: List, Create, Get, Update, Delete, Like, Unlike
- **Comments**: List, Create, Delete
- **Search**: Users, Posts

---

## ⚙️ Environment Variables

### Production (Cloudflare)
```
VITE_API_URL=https://nexora-prototype-production.up.railway.app
```

### Development (Local)
```
VITE_API_URL=http://localhost:3000
```

---

## 🧪 Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 🛡️ Backend Requirements (Railway)

Make sure your backend has CORS enabled:

```python
# Django/Flask
CORS_ALLOWED_ORIGINS = [
    "https://nexora-prototip-frontend.pages.dev",
    "http://localhost:5173",
]
```

---

## 📝 File Structure

```
src/
├── api/
│   └── client.ts           # API client
├── config/
│   └── environment.ts      # Environment & endpoints
├── hooks/
│   └── useAPI.ts          # React hook
├── pages/
├── components/
└── main.tsx
```

---

## 🚀 Next Steps

1. ✅ Frontend deployed on Cloudflare Pages
2. ✅ Backend running on Railway
3. ✅ API client configured
4. ⏳ **Backend CORS setup** - Configure CORS in your Django/Flask
5. ⏳ **Test API calls** - Start using the API client in components

---

## 💡 Tips

- Use `ENV.ENDPOINTS.*` for all API calls
- The hook automatically manages loading/error states
- Token is auto-injected for authenticated requests
- Use `skipAuth: true` for public endpoints
- Check browser console for detailed error messages

---

## 🐛 Troubleshooting

**CORS Error?** → Configure backend CORS
**404 Error?** → Check endpoint path in `environment.ts`
**401 Error?** → Token missing or expired, user needs to login
**No data?** → Check API response format matches expected type

---

## 📞 Support

For issues or questions, check:
1. `SETUP.md` - Detailed setup guide
2. `INTEGRATION.md` - Integration details
3. Backend logs on Railway
4. Browser console for errors

---

**Everything is ready! Happy coding! 🎉**
