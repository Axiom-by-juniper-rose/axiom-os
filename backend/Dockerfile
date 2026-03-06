
# Use an official Python runtime as a parent image
FROM python:3.10-slim

# Set the working directory to /app
WORKDIR /app

# P1-2: Copy requirements first so pip layer is cached independently of source changes
COPY requirements.txt .

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application source
COPY . .

# P1-1: Run as non-root user for security
RUN adduser --disabled-password --gecos "" appuser && chown -R appuser /app
USER appuser

# Expose port 8000
EXPOSE 8000

# Define environment variable
ENV PORT=8000

# P1-3: Use multiple workers for production concurrency
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "4"]
