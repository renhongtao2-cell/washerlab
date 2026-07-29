#!/bin/bash
# WasherLab Auto-Deploy Script
# Run this after generating new content

echo "Starting WasherLab deployment..."

# Navigate to project directory
cd ""

# Generate new content
echo "Generating daily content..."
node scripts/daily-quality-publish.js

# Deploy to Cloudflare
echo "Deploying to Cloudflare..."
npx wrangler deploy

echo "Deployment complete!"
echo "Visit https://washerlab.top to see changes"