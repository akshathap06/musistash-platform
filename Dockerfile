FROM python:3.11-slim

WORKDIR /app

# Install system dependencies required for audio processing libraries
RUN apt-get update && apt-get install -y \
    build-essential \
    gcc \
    g++ \
    pkg-config \
    libaubio-dev \
    libavcodec-dev \
    libavformat-dev \
    libavutil-dev \
    libswresample-dev \
    libsndfile1-dev \
    libsamplerate0-dev \
    libfftw3-dev \
    libasound2-dev \
    portaudio19-dev \
    && rm -rf /var/lib/apt/lists/*

COPY backend/requirements.txt /app/backend/

# Install numpy first to ensure it's available for aubio compilation
RUN pip install --no-cache-dir numpy>=1.21.0

# Then install the rest of the requirements
RUN pip install --no-cache-dir -r /app/backend/requirements.txt

COPY backend/ /app/backend/

ENV PYTHONPATH=/app/backend
ENV PORT=8000

EXPOSE 8000

CMD ["bash", "-c", "cd /app/backend && uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}"] 