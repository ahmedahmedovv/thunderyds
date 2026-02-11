# Thunder YDS - Capacitor iOS App

## Project Overview

Thunder YDS is an AI-powered English vocabulary learning application for iOS, built with Capacitor. The app helps users master academic vocabulary for the YDS (Yabancı Dil Sınavı - Foreign Language Exam) through interactive quizzes and flashcard study modes.

The application is a hybrid mobile app that combines:
- **Frontend**: Single-page HTML/JavaScript application with iOS-native design system
- **Native Bridge**: Capacitor 8.x framework for iOS integration
- **Backend**: Netlify serverless function for AI-powered content generation (uses Mistral AI via OpenRouter)

## Technology Stack

### Core Technologies
- **Capacitor 8.x**: Cross-platform native bridge for web apps
  - `@capacitor/core`: Core Capacitor functionality (v8.0.2)
  - `@capacitor/cli`: CLI tools for sync and build (v8.0.2)
  - `@capacitor/ios`: iOS platform integration (v8.0.2)
  - `@capacitor/toast`: Toast notifications plugin (v8.0.0)
- **Native iOS**: Swift-based iOS project using Swift Package Manager
  - Minimum iOS version: 15.0
  - Uses UIKit and WebKit through Capacitor
- **Web Technologies**: Vanilla JavaScript (ES6+), HTML5, CSS3
- **AI Model**: Mistral AI Ministral-8B via OpenRouter API

### iOS Design System
The app implements Apple's iOS Human Interface Guidelines with:
- SF Pro font family (`-apple-system` font stack)
- iOS system colors (blue, green, red, orange, etc.)
- Dynamic Type with `clamp()` for responsive scaling
- iOS spring animations (`cubic-bezier(0.32, 0.72, 0, 1)`)
- Dark mode support via `prefers-color-scheme: dark`
- Safe area insets for notched devices (`env(safe-area-inset-*)`)
- Reduced motion support via `prefers-reduced-motion`

## Project Structure

```
17 Capacitor/
├── capacitor.config.json         # Capacitor configuration
├── package.json                  # Node.js dependencies and scripts
├── www/                          # Web application source
│   ├── index.html               # Single-page application (~2673 lines)
│   ├── privacy.html             # Privacy policy page
│   ├── words.json               # Vocabulary word list (~1000 words)
│   └── capacitor.js             # Capacitor runtime
├── ios/                          # iOS native project
│   ├── App/
│   │   ├── Thunder YDS.xcodeproj/   # Xcode project
│   │   ├── CapApp-SPM/             # Swift Package Manager dependencies
│   │   │   ├── Package.swift       # SPM manifest
│   │   │   └── Sources/
│   │   └── App/
│   │       ├── AppDelegate.swift   # iOS app lifecycle
│   │       ├── Info.plist          # App metadata
│   │       ├── config.xml          # Cordova compatibility
│   │       ├── capacitor.config.json # Capacitor config copy
│   │       ├── public/             # Synced web assets from www/
│   │       ├── Base.lproj/         # Storyboards (Main, LaunchScreen)
│   │       └── Assets.xcassets/    # App icons and splash images
│   └── DerivedData/                # Xcode build artifacts
└── node_modules/                   # npm dependencies
```

## Configuration Files

### `capacitor.config.json`
```json
{
  "appId": "com.ahmedahmedov.thunderyds",
  "appName": "Thunder YDS",
  "webDir": "www",
  "version": "1.0.0",
  "ios": {
    "scheme": "Thunder YDS",
    "contentInset": "always"
  }
}
```

### `package.json`
- **App Name**: thunder-yds
- **Version**: 1.0.0
- **Type**: CommonJS
- **License**: ISC

### `ios/App/CapApp-SPM/Package.swift`
- Swift tools version: 5.9
- Platform: iOS 15+
- Dependencies:
  - `capacitor-swift-pm` (exact version 8.0.2)
  - `CapacitorToast` (local path reference)

## Application Architecture

### Web Application (`www/index.html`)
The entire app is contained in a single HTML file with embedded CSS and JavaScript:

#### UI Sections
1. **Welcome Screen** (`welcome-minimal`): App intro with mode selection
2. **Quiz Mode** (`appPage`): Fill-in-the-blank vocabulary questions
3. **Flashcard Mode** (`flashcardPage`): Tinder-style swipe study cards

#### Core JavaScript Modules
- **Data Loading**: Loads vocabulary from `words.json` asynchronously
- **CONFIG**: Application configuration (API settings, retry logic, prompts)
- **AppState**: Global state management for quiz mode
- **FlashcardState**: State for flashcard study mode
- **StreakState**: Daily streak tracking with localStorage + native storage bridge
- **NativeStorage**: Bridge to native iOS storage via WKScriptMessageHandler

#### Word Database
The app loads vocabulary from `www/words.json` containing ~1000 academic English words/phrases including:
- Single words: "Abnormal", "Abundant", "Academic", etc.
- Phrasal verbs: "Account for", "Break down", "Bring up", etc.
- Prepositional phrases: "In accordance with", "In terms of", etc.

### API Integration
```javascript
API_CONFIG = {
    endpoint: 'https://thunder.yds.today/.netlify/functions/generate-question',
    timeout: { wifi: 30000, cellular: 60000 }
}
```

The backend uses Mistral AI Ministral-8B model to generate:
- Contextual fill-in-the-blank questions for quiz mode
- 5 multiple-choice options with distractors
- Explanations for each option
- Flashcard definitions and example sentences

### iOS Native Integration

#### AppDelegate.swift
Standard Capacitor `AppDelegate` that:
- Uses `@UIApplicationMain` attribute
- Extends `UIResponder` and implements `UIApplicationDelegate`
- Handles URL schemes and Universal Links via `ApplicationDelegateProxy`
- Standard lifecycle methods (minimal customization)

#### Info.plist
- Bundle display name: "Thunder YDS"
- Supports multiple orientations (portrait, landscape)
- Uses Main.storyboard for UI (CAPBridgeViewController)
- Uses LaunchScreen.storyboard for splash screen
- Includes Capacitor debug configuration

#### Storyboards
- **Main.storyboard**: Single scene with `CAPBridgeViewController` (Capacitor's web view container)
- **LaunchScreen.storyboard**: Splash screen with centered image view

## Build Commands

### Development
```bash
# Install dependencies
npm install

# Sync web assets to iOS project (REQUIRED after any www/ changes)
npm run sync
# Or: npx cap sync

# Open iOS project in Xcode
npm run ios
# Or: npx cap open ios
```

### Running the App
```bash
# Run on connected iOS device or simulator
npm run ios:run
# Or: npx cap run ios
```

### Build
```bash
# No build step required (static HTML app)
npm run build
# Output: "No build step needed for this simple app"
```

## Development Workflow

### Making Changes to Web App
1. Edit files in `www/` directory (index.html, words.json, privacy.html)
2. Run `npm run sync` to copy changes to iOS project (`ios/App/App/public/`)
3. Run `npm run ios` to open Xcode and test on device/simulator

### Making Changes to Native iOS Code
1. Edit Swift files in `ios/App/App/`
2. Open Xcode with `npm run ios`
3. Build and run directly from Xcode

### iOS Build Process
1. `npx cap sync` copies `www/` to `ios/App/App/public/`
2. Swift Package Manager resolves dependencies (Capacitor, Toast plugin)
3. Xcode builds the Swift wrapper and bundles web assets
4. Capacitor runtime bridges JavaScript to native APIs via WKWebView

## Key Features

### Quiz Mode
- AI-generated fill-in-the-blank questions
- 5 multiple choice options (A-E)
- Keyboard support (1-5, A-E, Enter, Escape)
- Detailed answer explanations
- Streak tracking (20 words per day goal)
- Circuit breaker pattern for API failures
- Retry logic with exponential backoff

### Flashcard Mode
- Tinder-style swipe interface
- Swipe right = "Know", Swipe left = "Don't Know"
- AI-generated definitions and example sentences
- Gesture and button controls
- Prefetching for smooth UX

### User Experience
- Offline detection with visual indicator
- Error boundaries for crash recovery
- Loading states and spinners
- Debounced button clicks (300ms)
- Rate limiting and circuit breaker protection
- Accessibility support (keyboard navigation, ARIA labels)
- Haptic feedback ready (via Capacitor plugin)

## Security Considerations

### Input Sanitization
- `sanitizeHtml()` function prevents XSS
- Word length limits (100 chars)
- Sentence truncation at 300 characters
- Option truncation at 60 characters
- Explanation truncation at 200 characters

### API Safety
- Request timeout handling (30s WiFi, 60s cellular)
- Circuit breaker pattern (5 failures triggers 60s cooldown)
- AbortController for request cancellation
- Retry logic with exponential backoff (3 attempts)
- CORS error detection and user-friendly messages

### Data Storage
- `NativeStorage` bridge for iOS Keychain/UserDefaults
- Fallback to localStorage for web preview
- Stores only streak data (no personal information)
- Data is local-only, never sent to servers

## Privacy

See `www/privacy.html` for the full privacy policy. Key points:
- **No personal data collection**: All data stays on device
- Anonymous AI requests: Only vocabulary words sent to API
- Third-party services: OpenRouter API (AI), Netlify (hosting)
- iCloud backup: Data may be included if user has iCloud backup enabled

## Performance Optimizations

- **Prefetching**: Next question/flashcard loaded while viewing current
- **Connection Detection**: Different timeouts for WiFi/cellular
- **Debouncing**: 300ms delay on button clicks
- **Animation**: Hardware-accelerated CSS transforms
- **Overscroll**: Disabled with `overscroll-behavior-y: none`
- **Responsive**: Uses `clamp()` for fluid typography and spacing

## Testing Strategy

The project currently has no automated tests. Testing is manual via:
- Xcode Simulator (iPhone/iPad various sizes)
- Physical iOS devices
- Safari Web Inspector for debugging

## Deployment

### iOS App Store
1. Update version in:
   - `package.json`
   - `capacitor.config.json`
   - Xcode project settings (if needed)
2. Run `npm run sync` to update web assets
3. Open Xcode with `npm run ios`
4. Configure signing and provisioning profiles
5. Archive build: Product → Archive
6. Submit via App Store Connect

### Web Updates
Since web assets are bundled, any `www/` changes require:
1. `npm run sync`
2. Rebuild and resubmit to App Store

## Dependencies

### Production
```json
{
  "@capacitor/cli": "^8.0.2",
  "@capacitor/core": "^8.0.2",
  "@capacitor/ios": "^8.0.2",
  "@capacitor/toast": "^8.0.0"
}
```

### Swift Package Manager
- `capacitor-swift-pm` (exact: 8.0.2)
- Local `CapacitorToast` plugin

## Code Style Guidelines

### JavaScript
- Use ES6+ features (async/await, arrow functions, destructuring)
- Section headers with boxed comments (`/* ═════════════════════════════════════ */`)
- State objects use getter/setter pattern for DOM elements
- Error handling with try/catch and meaningful messages
- Console logging with prefixes: `[Data]`, `[Config]`, `[API]`, etc.

### CSS
- CSS custom properties (variables) for theming
- Mobile-first responsive design with `clamp()`
- BEM-like naming for component classes
- Hardware acceleration hints: `will-change`, `transform: translateZ(0)`
- Dark mode via `prefers-color-scheme` media query

### Swift
- Standard Capacitor patterns
- Minimal native code (JavaScript handles most logic)

## Notes for AI Agents

- This is a **single-file web app** - all logic is in `www/index.html`
- Words are loaded from `words.json`, not hardcoded
- Changes to iOS native code should be minimal (Capacitor handles most bridging)
- **Always run `npx cap sync` after modifying `www/` files**
- The app uses a remote AI API - network connectivity is required for content generation
- Streak data is stored via `NativeStorage` bridge (falls back to localStorage)
- The app supports dark mode automatically based on system preference
- Minimum iOS version is 15.0 (set in Package.swift)
- Bundle identifier: `com.ahmedahmedov.thunderyds`
