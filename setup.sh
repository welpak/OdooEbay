#!/bin/bash
set -e

echo "Starting Odoo-eBay Sync Engine Setup..."

# 1. Check/Install Docker
if ! command -v docker &> /dev/null; then
    echo "Docker not found. Installing..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    rm get-docker.sh
    # Add user to docker group
    sudo usermod -aG docker $USER
    echo "Docker installed. You may need to log out and back in for group changes to take effect."
fi

# 2. Build and Start Services
echo "Building and starting services..."
docker compose up -d --build

# 3. Wait for DB
echo "Waiting for database to initialize..."
sleep 10

# 4. Run Migrations
echo "Running database migrations..."
docker compose exec backend python manage.py migrate

echo "------------------------------------------------"
echo "Setup Complete!"
echo "Frontend: http://localhost:3000"
echo "Backend API: http://localhost:8000/api/"
echo "------------------------------------------------"
