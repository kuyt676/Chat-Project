FROM python:3.10-slim

# Set environment variables
ENV PYTHONUNBUFFERED=1

# Set work directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install
COPY requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt

# Install Uvicorn for FastAPI serving
RUN pip install uvicorn

# Copy project files
COPY . .

# Set environment variables from .env if present
# (You may want to use docker-compose for this in production)
EXPOSE 5002

# Default command
CMD ["uvicorn", "inference:app", "--host", "0.0.0.0", "--port", "5002"]
