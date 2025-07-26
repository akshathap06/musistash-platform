# 🎵 Hybrid Audio Analysis System

This document explains the hybrid audio analysis system that allows MusiStash to work with both simplified and full audio processing capabilities.

## 🎯 Overview

The hybrid approach provides two deployment options:

1. **Simplified Analysis** - Works on Railway/cloud platforms without system audio libraries
2. **Full Analysis** - Complete audio processing with all libraries (requires Docker)

## 🏗️ Architecture

### Core Components

- **Audio Analysis Factory** (`backend/audio_analysis_factory.py`)

  - Manages switching between analysis modes
  - Handles graceful fallbacks
  - Provides capability information

- **Simplified Analyzer** (`backend/simplified_audio_analysis.py`)

  - Works without system audio libraries
  - Generates realistic audio features
  - Perfect for cloud deployment

- **Full Analyzer** (`backend/full_audio_analysis.py`)
  - Complete audio processing capabilities
  - Uses librosa, aubio, pyAudioAnalysis, etc.
  - Requires Docker with system dependencies

## 🚀 Deployment Options

### Option 1: Railway Deployment (Simplified)

**Use Case:** Quick deployment, cloud hosting, no system dependencies

```bash
# Deploy to Railway with simplified analysis
./deploy-railway.sh
```

**Environment Variables:**

```bash
AUDIO_ANALYSIS_MODE=simplified
ENABLE_FULL_AUDIO_ANALYSIS=false
```

**Features:**

- ✅ Fast deployment
- ✅ No system dependencies
- ✅ Works on Railway/Heroku/Vercel
- ⚠️ Simplified audio analysis
- ⚠️ Estimated features instead of real analysis

### Option 2: Docker Deployment (Full Audio)

**Use Case:** Local development, advanced audio processing, complete analysis

```bash
# Deploy with Docker for full audio processing
./deploy-docker.sh
```

**Environment Variables:**

```bash
AUDIO_ANALYSIS_MODE=full
ENABLE_FULL_AUDIO_ANALYSIS=true
```

**Features:**

- ✅ Complete audio analysis
- ✅ Real audio processing
- ✅ All libraries available
- ⚠️ Requires Docker
- ⚠️ Larger deployment size

## 📁 File Structure

```
backend/
├── audio_analysis_factory.py      # Factory for switching analysis modes
├── simplified_audio_analysis.py   # Simplified analysis (current)
├── full_audio_analysis.py         # Full analysis with all libraries
├── requirements.txt               # Simplified requirements (Railway)
├── requirements_full.txt          # Full requirements (Docker)
└── main.py                       # Updated to use factory

Dockerfile.simplified              # Docker for simplified analysis
Dockerfile.full-audio             # Docker for full audio analysis
deploy-railway.sh                 # Railway deployment script
deploy-docker.sh                  # Docker deployment script
```

## 🔧 Configuration

### Environment Variables

| Variable                     | Values                       | Description                      |
| ---------------------------- | ---------------------------- | -------------------------------- |
| `AUDIO_ANALYSIS_MODE`        | `simplified`, `full`, `auto` | Analysis mode preference         |
| `ENABLE_FULL_AUDIO_ANALYSIS` | `true`, `false`              | Force full analysis if available |

### API Endpoints

#### Health Check

```bash
GET /health
```

Returns service status including audio factory availability.

#### Audio Analysis Capabilities

```bash
GET /api/audio-analysis-capabilities
```

Returns detailed information about available analysis capabilities.

**Response Example:**

```json
{
  "mode": "simplified",
  "enable_full": false,
  "analyzer_type": "SimplifiedAudioAnalyzer",
  "available_libraries": {
    "librosa": false,
    "aubio": false,
    "pyAudioAnalysis": false
  },
  "analysis_quality": "simplified"
}
```

## 🎵 Audio Analysis Features

### Simplified Analysis

- Duration estimation from file size
- Realistic BPM, key, mode generation
- Energy, valence, arousal simulation
- Commercial score calculation
- Target audience analysis
- Production quality assessment

### Full Analysis

- Real audio file processing
- Librosa spectral analysis
- Aubio tempo and pitch detection
- PyAudioAnalysis comprehensive features
- Music21 theoretical analysis
- Gemini AI insights integration

## 🔄 Migration Guide

### From Current Setup to Hybrid

1. **Backup current setup:**

   ```bash
   git checkout -b backup-current-setup
   ```

2. **Deploy simplified version:**

   ```bash
   ./deploy-railway.sh
   ```

3. **Test simplified analysis:**

   ```bash
   curl http://localhost:8000/api/audio-analysis-capabilities
   ```

4. **Optional: Deploy full version locally:**
   ```bash
   ./deploy-docker.sh
   ```

### Switching Between Modes

#### Railway (Simplified → Full)

Currently not supported on Railway due to system dependencies.

#### Docker (Simplified → Full)

```bash
# Stop simplified container
docker stop musistash-simplified

# Start full audio container
./deploy-docker.sh
```

## 🧪 Testing

### Test Simplified Analysis

```bash
# Test capabilities endpoint
curl http://localhost:8000/api/audio-analysis-capabilities

# Test audio upload (simplified)
curl -X POST http://localhost:8000/api/agent/upload-track \
  -F "file=@test.mp3" \
  -F "artist_id=test123"
```

### Test Full Analysis

```bash
# Build and run Docker container
./deploy-docker.sh

# Test capabilities endpoint
curl http://localhost:8000/api/audio-analysis-capabilities

# Test audio upload (full)
curl -X POST http://localhost:8000/api/agent/upload-track \
  -F "file=@test.mp3" \
  -F "artist_id=test123"
```

## 🐛 Troubleshooting

### Common Issues

#### Railway Deployment Fails

- Check that `requirements.txt` doesn't include audio packages
- Verify environment variables are set correctly
- Check Railway logs for specific errors

#### Docker Build Fails

- Ensure Docker is running
- Check system has enough disk space
- Verify all system dependencies are available

#### Audio Analysis Not Working

- Check `/api/audio-analysis-capabilities` endpoint
- Verify environment variables
- Check application logs for import errors

### Debug Commands

```bash
# Check analysis capabilities
curl http://localhost:8000/api/audio-analysis-capabilities

# Check health status
curl http://localhost:8000/health

# View Docker logs
docker logs musistash-full-audio

# Check environment variables
docker exec musistash-full-audio env | grep AUDIO
```

## 📈 Performance Comparison

| Metric                | Simplified | Full Audio  |
| --------------------- | ---------- | ----------- |
| Deployment Speed      | ⚡ Fast    | 🐌 Slow     |
| Analysis Quality      | ⚠️ Basic   | ✅ Advanced |
| System Dependencies   | ❌ None    | ✅ Required |
| File Size             | 📦 Small   | 📦 Large    |
| Cloud Compatibility   | ✅ Yes     | ❌ Limited  |
| Real Audio Processing | ❌ No      | ✅ Yes      |

## 🔮 Future Enhancements

1. **Progressive Enhancement**

   - Start with simplified analysis
   - Upgrade to full analysis when available

2. **Cloud Audio Processing**

   - External audio processing service
   - API-based analysis

3. **Hybrid Mode**

   - Use simplified for basic features
   - Use full analysis for advanced features

4. **Performance Optimization**
   - Caching analysis results
   - Background processing
   - Batch analysis

## 📞 Support

For issues with the hybrid audio analysis system:

1. Check the troubleshooting section
2. Review application logs
3. Test with the capabilities endpoint
4. Verify environment configuration

---

**Note:** This hybrid approach ensures MusiStash can be deployed quickly while maintaining the option for advanced audio processing when needed.
