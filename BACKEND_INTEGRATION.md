# Backend and Frontend Integration Setup

## 🔗 Architecture

```
Frontend (Cloudflare Pages)
    ↓ HTTPS
Backend (Railway)
```

### URLs:
- **Frontend**: https://nexora-prototip-frontend.pages.dev/
- **Backend API**: https://nexora-prototype-production.up.railway.app/

## 🚀 Setup Steps

### 1. Environment Variables

**Cloudflare Pages Settings** (Production):
```
VITE_API_URL=https://nexora-prototype-production.up.railway.app
```

**Local Development** (.env):
```
VITE_API_URL=http://localhost:3000
```

### 2. API Client Configuration

File: `src/lib/api.ts`
- Configured with dynamic API base URL
- Automatic Bearer token handling
- Error handling with 401 redirect

### 3. Service Layer

File: `src/lib/services.ts`
- `authService` - Login, register, profile
- `projectService` - Projects CRUD
- `taskService` - Tasks CRUD

### 4. CORS Configuration

**Backend (Railway) Required:**
```
CORS_ORIGIN=https://nexora-prototip-frontend.pages.dev
CORS_CREDENTIALS=true
```

### 5. Usage in Components

```typescript
import { projectService } from '@/lib/services';

// In component:
const { data: projects } = useQuery({
  queryKey: ['projects'],
  queryFn: () => projectService.getProjects(),
});
```

## 🔐 Security

- ✅ Tokens stored in localStorage
- ✅ Authorization headers auto-added
- ✅ 401 errors auto-redirect to login
- ✅ CORS protection enabled

## 📝 API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/auth/login` | User login |
| POST | `/auth/register` | User registration |
| GET | `/users/profile` | Get user profile |
| PUT | `/users/profile` | Update profile |
| GET | `/projects` | List projects |
| POST | `/projects` | Create project |
| GET | `/projects/:id` | Get project |
| PUT | `/projects/:id` | Update project |
| DELETE | `/projects/:id` | Delete project |
| GET | `/tasks` | List tasks |
| POST | `/tasks` | Create task |
| GET | `/tasks/:id` | Get task |
| PUT | `/tasks/:id` | Update task |
| DELETE | `/tasks/:id` | Delete task |

## ✅ Testing

1. **Local Development:**
   ```bash
   npm run dev
   # API requests go to http://localhost:3000
   ```

2. **Production (Cloudflare Pages):**
   ```bash
   npm run build
   # API requests go to https://nexora-prototype-production.up.railway.app
   ```

## 🐛 Troubleshooting

### CORS Errors
- Check backend CORS settings
- Verify `CORS_ORIGIN` in Railway config

### 401 Unauthorized
- Check token in localStorage
- Verify auth endpoint

### API Not Responding
- Check backend URL is correct
- Verify Railway deployment status
