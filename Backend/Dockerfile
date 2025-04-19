# ---------- 1. Base image ----------
FROM python:3.11-slim

# ---------- 2. OS packages your wheels may need ----------
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        build-essential \
        libsqlite3-dev \
    && rm -rf /var/lib/apt/lists/*

# ---------- 3. Working directory ----------
WORKDIR /app

# ---------- 4. Install Python deps ----------
# copy only requirements first so Docker can cache this layer
# this is a good practice to speed up builds
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN flask --app flaskr init-db

# ---------- 5. Copy application code ----------
COPY . .

# ---------- 6. Runtime env vars ----------
ENV FLASK_APP=flaskr:create_app \
    FLASK_ENV=production \
    PYTHONUNBUFFERED=1

# ---------- 7. Expose & start ----------
EXPOSE 5000
CMD ["gunicorn", "flaskr:app", "-b", "0.0.0.0:5000", "-w", "3"]



