# Stage 1: Build frontend
FROM node:20 AS frontend-build
WORKDIR /app
COPY . .
RUN npm ci && npm run build

# Stage 2: Backend with Python
FROM python:3.11-slim AS backend
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y build-essential && rm -rf /var/lib/apt/lists/*

# Copy backend code and requirements
COPY backend/ ./backend/
COPY requirements.txt ./requirements.txt
COPY runtime.txt ./runtime.txt

# Install Python dependencies
RUN pip install --upgrade pip && pip install -r backend/requirements.txt

# Copy built frontend from previous stage
COPY --from=frontend-build /app/dist ./frontend_dist

# Expose port
EXPOSE $PORT

# Start FastAPI backend
CMD ["python", "-m", "uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "${PORT}"] 