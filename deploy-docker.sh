#!/bin/bash

echo "🐳 Building Docker image with full audio processing..."

# Set environment variables for full audio analysis
export AUDIO_ANALYSIS_MODE=full
export ENABLE_FULL_AUDIO_ANALYSIS=true

echo "📋 Environment variables set:"
echo "  AUDIO_ANALYSIS_MODE=$AUDIO_ANALYSIS_MODE"
echo "  ENABLE_FULL_AUDIO_ANALYSIS=$ENABLE_FULL_AUDIO_ANALYSIS"

# Check if we're in the right directory
if [ ! -f "Dockerfile.full-audio" ]; then
    echo "❌ Error: Dockerfile.full-audio not found. Make sure you're in the musistash-platform directory."
    exit 1
fi

# Build the Docker image
echo "🔨 Building Docker image..."
docker build -f Dockerfile.full-audio -t musistash-full-audio .

if [ $? -eq 0 ]; then
    echo "✅ Docker image built successfully!"
    
    # Run the container
    echo "🚀 Starting container..."
    docker run -d \
        --name musistash-full-audio \
        -p 8000:8000 \
        --env-file .env \
        -e AUDIO_ANALYSIS_MODE=full \
        -e ENABLE_FULL_AUDIO_ANALYSIS=true \
        musistash-full-audio
    
    echo "✅ Container started!"
    echo "🔗 Application available at: http://localhost:8000"
    echo "📊 Health check: http://localhost:8000/health"
    
    # Show container logs
    echo "📋 Container logs:"
    docker logs musistash-full-audio
else
    echo "❌ Docker build failed!"
    exit 1
fi 