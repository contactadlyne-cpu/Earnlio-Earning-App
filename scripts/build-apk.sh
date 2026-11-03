#!/bin/bash
set -e

echo "=========================================="
echo "🚀 Earnlio Android APK Build Script"
echo "=========================================="

# 1. Install Node Dependencies if node_modules or vite is missing
if [ ! -d "node_modules" ] || [ ! -f "node_modules/.bin/vite" ]; then
    echo "📦 Installing npm dependencies (first run in GitHub Codespaces)..."
    npm install
fi

# 2. Install Java OpenJDK if not present
if ! command -v java &> /dev/null; then
    echo "☕ Installing Java OpenJDK 17..."
    sudo apt-get update -y && sudo apt-get install -y openjdk-17-jdk
fi

# 3. Build Web Application Assets
echo "🔨 Building React SPA web dist..."
npm run build

# 4. Sync Capacitor Android Assets
echo "⚡ Syncing Capacitor Android assets..."
npx cap sync android

# 5. Make gradlew executable & build Debug APK
cd android
chmod +x gradlew

echo "📱 Building Android APK for testing..."
./gradlew assembleDebug

echo "=========================================="
echo "✅ BUILD COMPLETE!"
echo "------------------------------------------"
echo "📂 Your Test APK file is located at:"
echo "   android/app/build/outputs/apk/debug/app-debug.apk"
echo "=========================================="
