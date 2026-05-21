#!/bin/bash
# Cloudflare Pages va Railway Backend integratsiyasi setup skripti

echo "🚀 Nexora Frontend-Backend Integration Setup"
echo "==========================================="
echo ""

# 1. Environment variables o'rnatish
echo "📝 Environment variables sozlanmoqda..."
cat > .env.production << 'EOF'
# Production environment variables
VITE_API_URL=https://nexora-prototype-production.up.railway.app
VITE_ENV=production
EOF

cat > .env.development << 'EOF'
# Development environment variables
VITE_API_URL=http://localhost:3000
VITE_ENV=development
EOF

echo "✅ Environment variables yaratildi"
echo ""

# 2. Cloudflare Pages environment variables o'rnatish
echo "🔐 Cloudflare Pages uchun environment variables:"
echo "VITE_API_URL = https://nexora-prototype-production.up.railway.app"
echo ""

# 3. Build sozlamalari
echo "🔨 Build sozlamalari:"
echo "- Build command: npm run build"
echo "- Build output: dist"
echo "- Root directory: /"
echo ""

# 4. CORS sozlamalari (Backend da kerak)
echo "🛡️  CORS sozlamalarini Backend da o'rnatish kerak:"
echo "Backend (Railway):"
echo "  - ALLOWED_ORIGINS: https://nexora-prototip-frontend.pages.dev"
echo "  - ALLOWED_METHODS: GET, POST, PUT, DELETE, PATCH, OPTIONS"
echo "  - ALLOWED_HEADERS: Content-Type, Authorization"
echo ""

echo "✅ Setup tugallandi!"
