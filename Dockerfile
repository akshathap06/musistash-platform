FROM python:3.11-slim

WORKDIR /app

COPY backend/requirements.txt /app/backend/
RUN pip install --no-cache-dir -r /app/backend/requirements.txt

COPY backend/ /app/backend/

ENV PYTHONPATH=/app/backend
ENV PORT=8000

EXPOSE 8000

CMD ["bash", "-c", "uvicorn backend.main:app --host 0.0.0.0 --port $PORT"] 