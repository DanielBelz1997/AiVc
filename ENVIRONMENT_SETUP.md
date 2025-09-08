# 🔧 Environment Variables Setup Guide

## Required Environment Variables

### 🎯 **Most Important: OpenAI API Key**

You **MUST** get an OpenAI API key for the system to work:

1. Go to https://platform.openai.com/api-keys
2. Create a new API key
3. Copy the key (starts with `sk-...`)
4. Add it to your backend `.env` file

---

## 🔙 Backend Environment Variables (`vcai-be/.env`)

### ✅ **Already Created - Just Update OpenAI Key**

```bash
# File: vcai-be/.env

# Database
DATABASE_URL=sqlite:///./vcai.db
DATABASE_TEST_URL=sqlite:///./vcai_test.db

# Redis (Optional - for production scaling)
REDIS_URL=redis://localhost:6379

# API Configuration
API_V1_STR=/api/v1
SECRET_KEY=your-secret-key-change-this-in-production
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS - CRITICAL: Add your frontend URLs here
BACKEND_CORS_ORIGINS=["http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:5173", "http://127.0.0.1:3000"]

# OpenAI API (REQUIRED - Get from https://platform.openai.com/api-keys)
OPENAI_API_KEY=sk-your-openai-api-key-here  # ⚠️ CHANGE THIS!
OPENAI_MODEL=gpt-4-turbo-preview

# AutoGen Configuration
AUTOGEN_CACHE_SEED=42
AUTOGEN_WORK_DIR=./autogen_workdir

# Environment
ENVIRONMENT=development
DEBUG=True

# Logging
LOG_LEVEL=INFO
```

### 🔑 **What You MUST Change:**

1. **`OPENAI_API_KEY`** - Replace with your actual OpenAI API key
2. **`SECRET_KEY`** - Change to a secure random string for production

### 📝 **What Each Variable Does:**

#### **Required Variables:**

- `OPENAI_API_KEY` - Your OpenAI API key (essential for AI agents)
- `BACKEND_CORS_ORIGINS` - Frontend URLs allowed to connect

#### **Optional Variables (defaults work):**

- `DATABASE_URL` - SQLite database file location
- `API_V1_STR` - API version prefix
- `SECRET_KEY` - JWT token encryption key
- `OPENAI_MODEL` - Which OpenAI model to use
- `DEBUG` - Enable debug mode
- `LOG_LEVEL` - Logging verbosity

---

## 🎨 Frontend Environment Variables (`vcai-fe/.env`)

### ✅ **Already Created - Should Work as-is**

```bash
# File: vcai-fe/.env

# Backend API Configuration - REQUIRED
VITE_BACKEND_URL=http://localhost:8000

# WebSocket Configuration - REQUIRED
VITE_WS_URL=ws://localhost:8000

# Development settings
VITE_ENV=development
```

### 📝 **What Each Variable Does:**

- `VITE_BACKEND_URL` - Where your Python backend is running
- `VITE_WS_URL` - WebSocket connection URL
- `VITE_ENV` - Development/production mode

### 🔧 **When to Change Frontend Variables:**

- **Different backend port**: Change `8000` to your backend port
- **Production deployment**: Update URLs to your production backend

---

## 🚀 Quick Setup Commands

### 1. **Update Backend OpenAI Key:**

```bash
cd vcai-be
# Edit the .env file
nano .env
# Or use your preferred editor
code .env
```

### 2. **Verify Environment Files Exist:**

```bash
# Check backend .env
cat vcai-be/.env

# Check frontend .env
cat vcai-fe/.env
```

### 3. **Test the Setup:**

```bash
# Start backend
cd vcai-be
source venv/bin/activate
python scripts/start_dev.py

# In another terminal, start frontend
cd vcai-fe
npm run dev
```

---

## 🔍 **Troubleshooting Environment Issues**

### ❌ **"OpenAI API key not found"**

```bash
# Solution: Add your OpenAI API key to vcai-be/.env
OPENAI_API_KEY=sk-your-actual-key-here
```

### ❌ **"CORS error" / "Network error"**

```bash
# Solution: Check BACKEND_CORS_ORIGINS includes your frontend URL
BACKEND_CORS_ORIGINS=["http://localhost:5173", "http://localhost:3000"]
```

### ❌ **"WebSocket connection failed"**

```bash
# Solution: Ensure VITE_WS_URL matches your backend URL
VITE_WS_URL=ws://localhost:8000
```

### ❌ **"Backend not found"**

```bash
# Solution: Check VITE_BACKEND_URL points to running backend
VITE_BACKEND_URL=http://localhost:8000
```

---

## 🔒 **Production Environment Variables**

### Backend Production (vcai-be/.env.production):

```bash
# Database
DATABASE_URL=postgresql://user:pass@host:5432/vcai_prod

# Security
SECRET_KEY=very-long-random-secure-key-here
DEBUG=False

# CORS - Add your production frontend URL
BACKEND_CORS_ORIGINS=["https://your-frontend-domain.com"]

# OpenAI
OPENAI_API_KEY=sk-your-production-key

# Environment
ENVIRONMENT=production
LOG_LEVEL=WARNING
```

### Frontend Production (vcai-fe/.env.production):

```bash
# Backend URLs - Update to your production backend
VITE_BACKEND_URL=https://your-backend-domain.com
VITE_WS_URL=wss://your-backend-domain.com

# Environment
VITE_ENV=production
```

---

## ✅ **Environment Variables Checklist**

### Before Starting:

- [ ] OpenAI API key added to backend `.env`
- [ ] Backend `.env` file exists in `vcai-be/`
- [ ] Frontend `.env` file exists in `vcai-fe/`
- [ ] Frontend URLs in `BACKEND_CORS_ORIGINS`

### Test Setup:

- [ ] Backend starts without errors
- [ ] Frontend connects to backend
- [ ] Can submit test prompt
- [ ] WebSocket connection works
- [ ] AI agents respond

### Common Values:

```bash
# Local development (default)
Backend: http://localhost:8000
Frontend: http://localhost:5173
WebSocket: ws://localhost:8000

# Alternative ports
Backend: http://localhost:8000
Frontend: http://localhost:3000
WebSocket: ws://localhost:8000
```

---

## 🆘 **Quick Fix Commands**

### Reset Environment Files:

```bash
# Recreate backend .env
cd vcai-be
cp .env.example .env

# Recreate frontend .env
cd vcai-fe
cp .env.example .env
```

### Check Environment Loading:

```bash
# Backend - check if variables load
cd vcai-be
source venv/bin/activate
python -c "from app.core.config import settings; print(f'OpenAI key set: {bool(settings.OPENAI_API_KEY)}')"

# Frontend - check if variables load
cd vcai-fe
npm run dev
# Open browser console and type: console.log(import.meta.env)
```

**Remember: The most important variable is your OpenAI API key - everything else has working defaults!**
