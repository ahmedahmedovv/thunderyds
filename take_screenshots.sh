#!/bin/bash
# Thunder YDS Screenshot Helper

echo "======================================"
echo "Thunder YDS Screenshot Helper"
echo "======================================"
echo ""
echo "This script will help you take screenshots"
echo "with the correct dimensions (1284×2778px)"
echo ""

# Check if Simulator is running
if ! pgrep -x "Simulator" > /dev/null; then
    echo "Starting iOS Simulator..."
    open -a Simulator
    sleep 3
fi

# Boot iPhone 14 Pro Max
echo "Selecting iPhone 14 Pro Max..."
xcrun simctl boot "iPhone 14 Pro Max" 2>/dev/null || echo "iPhone 14 Pro Max already booted"

# Open Xcode project
echo ""
echo "Opening Xcode..."
cd "$(dirname "$0")/ios/App"
open "Thunder YDS.xcodeproj" 2>/dev/null || open "App.xcodeproj" 2>/dev/null

echo ""
echo "======================================"
echo "NEXT STEPS:"
echo "======================================"
echo "1. In Xcode, select 'iPhone 14 Pro Max' as target"
echo "2. Click Run (▶) to start the app"
echo "3. Navigate to each screen:"
echo ""
echo "   Screen 1: Welcome screen (Quiz/Flashcard buttons)"
echo "   Screen 2: Quiz question with options"
echo "   Screen 3: Answer explanation"
echo "   Screen 4: Flashcard mode"
echo ""
echo "4. Press Cmd+S for each screen"
echo "5. Screenshots save to: ~/Desktop/"
echo ""
echo "======================================"
echo "VERIFY SCREENSHOTS:"
echo "======================================"
echo "Run this command to check dimensions:"
echo "  file ~/Desktop/Simulator*.png"
echo ""
echo "Should show: 1284 x 2778"
echo ""
