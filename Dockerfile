FROM python:3.11-slim AS backend
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y build-essential && rm -rf /var/lib/apt/lists/*

# Copy backend code and requirements
COPY backend/ ./backend/
COPY requirements.txt ./requirements.txt

# Install Python dependencies
RUN pip install --upgrade pip && pip install -r backend/requirements.txt

# Expose port
EXPOSE 8000

# Start FastAPI backend
CMD ["python", "-m", "uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"] 