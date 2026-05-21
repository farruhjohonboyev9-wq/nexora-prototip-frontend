# 🔧 Backend CORS Configuration for Railway

## ✅ Status
Your Frontend is working! Response shows:
- ✅ `access-control-allow-origin: https://nexora-prototip-frontend.pages.dev`
- ✅ `200 OK` status
- ✅ CORS headers properly configured

**Now we need to ensure consistent CORS setup.**

---

## 🛡️ Django CORS Setup (Recommended)

### 1. Install django-cors-headers
```bash
pip install django-cors-headers
```

### 2. Add to `settings.py`

```python
# INSTALLED APPS
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    'corsheaders',  # Add this
    
    # Your apps
]

# MIDDLEWARE - ADD CORS FIRST
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # Must be first!
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
]

# CORS Configuration
CORS_ALLOWED_ORIGINS = [
    "https://nexora-prototip-frontend.pages.dev",
    "http://localhost:5173",
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

# Allow credentials in CORS requests
CSRF_TRUSTED_ORIGINS = [
    "https://nexora-prototip-frontend.pages.dev",
    "http://localhost:5173",
]
```

---

## 🔗 FastAPI CORS Setup

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://nexora-prototip-frontend.pages.dev",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## 🐍 Flask CORS Setup

```python
from flask import Flask
from flask_cors import CORS

app = Flask(__name__)

CORS(app, 
     origins=[
         "https://nexora-prototip-frontend.pages.dev",
         "http://localhost:5173",
     ],
     supports_credentials=True,
     methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
     allow_headers=["Content-Type", "Authorization"])
```

---

## 🚀 Environment Variables (Railway)

Add to Railway environment variables:

```
CORS_ORIGINS=https://nexora-prototip-frontend.pages.dev,http://localhost:5173
CORS_CREDENTIALS=true
```

Then use in Django:
```python
import os
CORS_ALLOWED_ORIGINS = os.getenv('CORS_ORIGINS', '').split(',')
```

---

## ✅ Testing CORS

### Test from Frontend Console:
```javascript
// In browser console
fetch('https://nexora-prototype-production.up.railway.app/users/me', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN',
    'Content-Type': 'application/json'
  },
  credentials: 'include'
}).then(r => r.json()).then(console.log)
```

---

## 📋 Checklist

- [ ] Install `django-cors-headers` or equivalent
- [ ] Add middleware to INSTALLED_APPS
- [ ] Configure CORS_ALLOWED_ORIGINS
- [ ] Set CORS_ALLOW_CREDENTIALS = True
- [ ] Add to CSRF_TRUSTED_ORIGINS
- [ ] Deploy to Railway
- [ ] Test from Cloudflare Pages
- [ ] Verify response headers

---

## 🐛 Troubleshooting

### Still Getting CORS Error?
1. **Clear browser cache** - Hard refresh (Ctrl+Shift+R)
2. **Check middleware order** - CORS must be first!
3. **Verify domain** - Make sure it's exactly `nexora-prototip-frontend.pages.dev`
4. **Check credentials** - Make sure token is valid

### 401 Unauthorized?
- Token missing or expired
- Check Authorization header format: `Bearer {token}`

### 404 Not Found?
- Check endpoint path
- Verify backend route exists

---

## 🎯 Frontend is Ready!

The frontend API client is now updated with:
- ✅ Better error handling
- ✅ Token detection (Bearer and plain)
- ✅ Console logging for debugging
- ✅ Proper CORS support
- ✅ React Hook with loading/error states

**Just add the CORS config to your Django/FastAPI/Flask backend!**
