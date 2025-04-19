# 1. Base
FROM python:3.11-slim

# 2. Install Poetry
ENV POETRY_VERSION=1.7.1
RUN pip install --no-cache-dir "poetry==${POETRY_VERSION}"

# 3. App setup
WORKDIR /app
COPY pyproject.toml poetry.lock ./

# 4. Install deps (no dev, no isolated venv)
RUN poetry config virtualenvs.create false \
 && poetry install --no-root --no-dev --no-interaction --no-ansi

# 5. Copy source
COPY . .

# 6. Flask env
ENV FLASK_APP=flaskr
ENV FLASK_ENV=production

# 7. Expose & run
EXPOSE 5000
CMD ["flask", "run", "--host=0.0.0.0"]

