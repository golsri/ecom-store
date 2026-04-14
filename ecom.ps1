$source = "C:\TecPro\TradePrj\ecom-store"
$dest = "C:\TecPro\TradePrj\store-mvp-clean"

# Create temp directory
New-Item -ItemType Directory -Path $dest -Force

# Copy only necessary files
Get-ChildItem -Path $source -Exclude "node_modules", ".next", ".git", "*.log", ".DS_Store", "Thumbs.db", "dist", "build", "coverage", ".vercel" | Copy-Item -Destination $dest -Recurse -Force

# Create zip
Compress-Archive -Path "$dest\*" -DestinationPath "C:\TecPro\TradePrj\store-mvp-clean.zip" -Force

# Cleanup temp directory
Remove-Item -Path $dest -Recurse -Force

Write-Host "✅ Clean zip created at C:\TecPro\TradePrj\store-mvp-clean.zip"