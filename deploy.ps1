# WasherLab Auto-Deploy Script (PowerShell)
# Run this after generating new content

Write-Host "Starting WasherLab deployment..." -ForegroundColor Green

# Navigate to project directory
Set-Location 

# Generate new content
Write-Host "Generating daily content..." -ForegroundColor Yellow
node scripts/daily-quality-publish.js

# Deploy to Cloudflare
Write-Host "Deploying to Cloudflare..." -ForegroundColor Cyan
npx wrangler deploy

Write-Host "Deployment complete!" -ForegroundColor Green
Write-Host "Visit https://washerlab.top to see changes" -ForegroundColor White