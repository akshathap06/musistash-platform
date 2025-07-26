# 🚀 Railway Deployment Guide

This guide explains how to deploy MusiStash to Railway using the buildpack approach (simplified audio analysis).

## 🎯 Quick Deploy

### Option 1: Using Railway CLI

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Deploy
railway up
```

### Option 2: Using Git Push

```bash
# Add Railway as remote (if not already added)
railway link

# Push to Railway
git push railway main
```

### Option 3: Using Railway Dashboard

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Create new project
3. Connect GitHub repository
4. Railway will automatically detect Python and deploy

## 🔧 Configuration Files

### railway.toml

```toml
[build]
builder = "nixpacks"

[deploy]
startCommand = "uvicorn backend.main:app --host 0.0.0.0 --port $PORT"
healthcheckPath = "/health"
healthcheckTimeout = 300
restartPolicyType = "on_failure"

[env]
AUDIO_ANALYSIS_MODE = "simplified"
ENABLE_FULL_AUDIO_ANALYSIS = "false"
PYTHONPATH = "/app"
```

### nixpacks.toml

```toml
[phases.setup]
nixPkgs = ["python311", "gcc"]

[phases.install]
cmds = [
    "pip install --no-cache-dir -r backend/requirements.txt"
]

[phases.build]
cmds = [
    "echo 'Build completed successfully'"
]

[start]
cmd = "uvicorn backend.main:app --host 0.0.0.0 --port $PORT"

[variables]
AUDIO_ANALYSIS_MODE = "simplified"
ENABLE_FULL_AUDIO_ANALYSIS = "false"
PYTHONPATH = "/app"
```

### Procfile

```
web: uvicorn backend.main:app --host 0.0.0.0 --port $PORT
```

### runtime.txt

```
python-3.11.0
```

## 🌍 Environment Variables

Set these in Railway dashboard or via CLI:

```bash
AUDIO_ANALYSIS_MODE=simplified
ENABLE_FULL_AUDIO_ANALYSIS=false
PYTHONPATH=/app
```

## 📊 Health Check

After deployment, check the health endpoint:

```bash
curl https://your-app.railway.app/health
```

Expected response:

```json
{
  "status": "healthy",
  "message": "Backend server is running successfully",
  "services": {
    "supabase": true,
    "ml_service": true,
    "audio_factory": true,
    "billboard": false
  },
  "timestamp": "2024-01-01T00:00:00.000000"
}
```

## 🔍 Troubleshooting

### Build Fails

1. Check Railway logs for specific errors
2. Verify `requirements.txt` doesn't contain audio packages
3. Ensure all configuration files are present

### Audio Analysis Not Working

1. Check `/api/audio-analysis-capabilities` endpoint
2. Verify environment variables are set
3. Check application logs

### Port Issues

1. Ensure `$PORT` environment variable is used
2. Check Railway assigns port correctly
3. Verify health check endpoint works

## 🚀 Deployment Commands

### Full Deployment Process

```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login to Railway
railway login

# 3. Link project (if not already linked)
railway link

# 4. Set environment variables
railway variables set AUDIO_ANALYSIS_MODE=simplified
railway variables set ENABLE_FULL_AUDIO_ANALYSIS=false
railway variables set PYTHONPATH=/app

# 5. Deploy
railway up
```

### Check Deployment Status

```bash
# View logs
railway logs

# Check status
railway status

# Open in browser
railway open
```

## 📈 Monitoring

### Health Check

```bash
curl https://your-app.railway.app/health
```

### Audio Analysis Capabilities

```bash
curl https://your-app.railway.app/api/audio-analysis-capabilities
```

### Application Logs

```bash
railway logs --follow
```

## 🔄 Updating Deployment

### Automatic Updates

Railway automatically deploys when you push to the main branch.

### Manual Updates

```bash
# Force redeploy
railway up

# Deploy specific branch
railway up --branch feature-branch
```

## 💡 Tips

1. **Use Railway CLI** for easier management
2. **Monitor logs** during deployment
3. **Set environment variables** in Railway dashboard
4. **Use health checks** to verify deployment
5. **Keep requirements.txt clean** (no audio packages)

## 🆘 Support

If deployment fails:

1. Check Railway logs
2. Verify configuration files
3. Test locally first
4. Contact Railway support if needed

---

**Note:** This deployment uses the simplified audio analysis mode, which works without system audio libraries and is perfect for Railway's buildpack environment.
