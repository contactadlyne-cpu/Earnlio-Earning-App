#!/bin/bash
set -e

echo "=========================================="
echo "🚀 Earnlio Android APK & AAB Build Script"
echo "=========================================="

# 1. Install Java OpenJDK if not present
if ! command -v java &> /dev/null; then
    echo "📦 Installing Java OpenJDK 17..."
    sudo apt-get update -y && sudo apt-get install -y openjdk-17-jdk
fi

# 2. Build Web Application Assets
echo "🔨 Building React SPA web dist..."
npm run build

# 3. Sync Capacitor Android Assets
echo "⚡ Syncing Capacitor Android assets..."
npx cap sync android

# 4. Make gradlew executable
cd android
chmod +x gradlew

# 5. Build Debug APK & Release AAB Bundle for Google Play Console
echo "📱 Building Android Debug APK..."
./gradlew assembleDebug

echo "📦 Building Android Release Bundle (.aab) for Google Play Console..."
./gradlew bundleRelease

echo "=========================================="
echo "✅ BUILD COMPLETE!"
echo "------------------------------------------"
echo "📂 Debug APK location:"
echo "   android/app/build/outputs/apk/debug/app-debug.apk"
echo ""
echo "📂 Google Play Release AAB location:"
echo "   android/app/build/outputs/bundle/release/app-release.aab"
echo "=========================================="
