FROM python:3.12-slim

# Create non-root user early
RUN useradd -m -u 1000 appuser

WORKDIR /app

# Install system dependencies including libmagic1 for python-magic
RUN apt-get update && apt-get install -y \
    gcc \
    postgresql-client \
    curl \
    libmagic1 \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

# Copy requirements first for better caching
COPY --chown=appuser:appuser requirements.txt .
RUN pip install --no-cache-dir --user -r requirements.txt && \
    rm requirements.txt

# Copy application code
COPY --chown=appuser:appuser . .

USER appuser

# Expose port 8989 (根据项目规范)
EXPOSE 8989

# Health check - 使用正确的端口
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl --fail http://localhost:8989/health || exit 1

# Run the application - 使用端口 8989
CMD ["sh", "-c", "python -c 'from app.utils.security_utils import generate_secret_key; print(\"SECRET_KEY:\", generate_secret_key(64))' && exec uvicorn app.main:app --host 0.0.0.0 --port 8989"]
