#!/bin/bash

# Deploy script for OnChain Riddle
echo "🚀 Deploying OnChain Riddle..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found!"
    echo "Please create a .env file with the following variables:"
    echo "VITE_CONTRACT_ADDRESS=0x..."
    echo "VITE_RPC_URL=https://..."
    echo "PRIVATE_KEY=0x..."
    exit 1
fi

# Load environment variables
export $(cat .env | xargs)

# Validate required environment variables
if [ -z "$VITE_CONTRACT_ADDRESS" ] || [ -z "$VITE_RPC_URL" ] || [ -z "$PRIVATE_KEY" ]; then
    echo "❌ Error: Missing required environment variables!"
    echo "Please ensure .env file contains:"
    echo "- VITE_CONTRACT_ADDRESS"
    echo "- VITE_RPC_URL" 
    echo "- PRIVATE_KEY"
    exit 1
fi

echo "📋 Contract Address: $VITE_CONTRACT_ADDRESS"
echo "🌐 RPC URL: $VITE_RPC_URL"
echo "🔗 Network: Sepolia testnet"

# Create logs directory
mkdir -p logs

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose down

# Build and start the application
echo "🔨 Building and starting the application..."
docker-compose up --build -d

# Show status
echo "📊 Container status:"
docker-compose ps

echo "✅ Deployment complete!"
echo "🌐 Application is running at: http://localhost:3564"
echo "📝 Logs are available in the ./logs directory"
echo ""
echo "To view logs:"
echo "  docker-compose logs -f"
echo ""
echo "To stop the application:"
echo "  docker-compose down"