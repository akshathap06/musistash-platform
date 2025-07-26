FROM python:3.11-slim

WORKDIR /app

# Install basic system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

COPY backend/requirements.txt /app/backend/

# Install requirements
RUN pip install --no-cache-dir -r /app/backend/requirements.txt

COPY backend/ /app/backend/

ENV PYTHONPATH=/app/backend
ENV PORT=8000

EXPOSE 8000

CMD ["bash", "-c", "cd /app/backend && uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}"] 