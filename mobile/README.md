# Portfolio Admin Mobile App

A modern Flutter mobile application for managing portfolio content. Built with clean architecture, Riverpod state management, and an AI-inspired glassmorphism UI.

## Features

✨ **Admin Features:**
- Secure JWT-based authentication
- Dashboard with stats overview
- Manage skills, projects, experience, education, and certifications
- Upload and organize media files
- Edit profile content sections
- Real-time data sync with FastAPI backend

🎨 **UI/UX:**
- AI-inspired dark glassmorphism design
- Neon cyan and purple accent colors
- Smooth animations and transitions
- Fully responsive mobile layout
- Bottom navigation for easy access

## Tech Stack

- **Framework:** Flutter 3.22+
- **Language:** Dart 3.3+
- **State Management:** Riverpod 2.5
- **HTTP Client:** Dio 5.4
- **Navigation:** GoRouter 14.1
- **Secure Storage:** flutter_secure_storage
- **Code Generation:** Freezed + json_serializable

## Prerequisites

### System Requirements

- **Flutter SDK:** >= 3.22.0 (stable channel)
- **Dart SDK:** >= 3.3.0 (bundled with Flutter)
- **Java JDK:** 17+ (for Android)
- **Xcode:** 15+ (for iOS on macOS)
- **Android Studio** or **VS Code** with Flutter extension

### Backend Requirement

- Running FastAPI backend at `http://localhost:8000`
- See d:/Portfolio/backend/README.md for backend setup

## Installation & Setup

### Step 1: Download and Install Flutter

**Windows:**
```bash
# Using Chocolatey (recommended)
choco install flutter

# Or from Microsoft Store
winget install Flutter.Flutter

# Verify installation
flutter --version
flutter doctor
```

**macOS:**
```bash
brew install flutter
```

**Linux:**
Download from https://flutter.dev/docs/get-started/install/linux

### Step 2: Install Dependencies

From within the `d:/Portfolio/mobile/` directory:

```bash
flutter pub get
```

This installs all dependencies defined in `pubspec.yaml`.

### Step 3: Code Generation

Generate freezed models and json serialization code:

```bash
dart run build_runner build --delete-conflicting-outputs
```

Re-run this whenever you add new `@freezed` or `@JsonSerializable` models.

### Step 4: Configure Environment

The `.env` file is already configured with:
```
API_BASE_URL=http://localhost:8000
```

For different network configurations:

**Android Emulator:**
```
API_BASE_URL=http://10.0.2.2:8000
```

**Physical Device (same WiFi):**
```
API_BASE_URL=http://YOUR_MACHINE_IP:8000
```

Replace `YOUR_MACHINE_IP` with your development machine's local IP address (e.g., 192.168.1.100).

### Step 5: Android Configuration

Edit `android/app/build.gradle`:

```gradle
android {
    compileSdk 34
    minSdk 21          // Required for flutter_secure_storage
    targetSdk 34
    // ...
}
```

Edit `android/app/src/main/AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.CAMERA" />

<application android:usesCleartextTraffic="true" ...>
    <!-- Your app config -->
</application>
```

### Step 6: iOS Configuration (macOS only)

Edit `ios/Runner/Info.plist`:

```xml
<key>NSCameraUsageDescription</key>
<string>Upload project images</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>Select media files to upload</string>
<key>NSAppTransportSecurity</key>
<dict>
  <key>NSAllowsArbitraryLoads</key>
  <true/>
</dict>
```

## Running the App

### Start the Backend

```bash
cd d:/Portfolio/backend
source venv/Scripts/activate  # On Windows
python -m uvicorn main:app --reload
```

Backend will run on `http://localhost:8000`.

### Run on Android Emulator

```bash
# Start emulator
flutter emulators --launch <emulator_id>

# List available emulators
flutter emulators

# Run app
flutter run
```

### Run on iOS Simulator (macOS)

```bash
open -a Simulator
flutter run
```

### Run on Physical Device

```bash
# Connect device via USB
# Enable USB Debugging (Android) or Trust Computer (iOS)

flutter run
```

## Login Credentials

Use the admin credentials from your backend:

- **Username:** admin (or as configured in your backend)
- **Password:** admin123 (or as configured in your backend)

See `d:/Portfolio/backend/seed_admin.py` to reset admin credentials.

## Building for Release

### Android APK

```bash
flutter build apk --release
```

Output: `build/app/outputs/flutter-apk/app-release.apk`

**Install on device:**
```bash
adb install build/app/outputs/flutter-apk/app-release.apk
```

### Android App Bundle (Google Play)

```bash
flutter build appbundle --release
```

Output: `build/app/outputs/bundle/release/app-release.aab`

Upload to Google Play Console for distribution.

### iOS (macOS only)

```bash
flutter build ios --release
```

Then:
1. Open `ios/Runner.xcworkspace` in Xcode
2. Select "Product" → "Scheme" → "Runner" (Release)
3. Select your signing team (Signing & Capabilities tab)
4. Product → Build For → Running
5. Product → Archive

Upload archive to App Store Connect via Xcode.

## Deployment Guide

### Google Play Store (Android)

1. **Create a keystore:**
   ```bash
   keytool -genkey -v -keystore ~/key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias portfolio
   ```

2. **Configure build signing:** Edit `android/app/build.gradle`:
   ```gradle
   signingConfigs {
       release {
           keyAlias 'portfolio'
           keyPassword 'your_password'
           storeFile file('path/to/key.jks')
           storePassword 'your_password'
       }
   }

   buildTypes {
       release {
           signingConfig signingConfigs.release
       }
   }
   ```

3. **Build release APK/Bundle:**
   ```bash
   flutter build appbundle --release
   ```

4. **Upload to Play Console:**
   - Go to https://play.google.com/console
   - Create new app → Fill metadata
   - Upload your `.aab` file
   - Set pricing and distribution
   - Submit for review

### App Store (iOS - macOS only)

1. **Configure app in Xcode:**
   - Open `ios/Runner.xcworkspace`
   - Select Runner project
   - Set Bundle ID, Team ID, Version
   - Enable provisioning profiles

2. **Build for release:**
   ```bash
   flutter build ios --release
   ```

3. **Create archive in Xcode:**
   - Product → Archive
   - Distribute App → App Store Connect
   - Follow prompts

4. **Submit via App Store Connect:**
   - Go to https://appstoreconnect.apple.com
   - Add build to version
   - Fill required metadata
   - Submit for review

## Project Structure

```
lib/
├── main.dart                 # App entry point
├── app.dart                  # MaterialApp configuration
├── core/
│   ├── config/              # API config & endpoints
│   ├── network/             # Dio client & interceptors
│   ├── storage/             # Secure token storage
│   ├── router/              # GoRouter configuration
│   ├── theme/               # Color palette & theme
│   └── widgets/             # Reusable components
├── models/                  # Data models (freezed)
├── repositories/            # API layer (CRUD)
├── providers/               # Riverpod state management
└── features/                # Feature screens
    ├── auth/
    ├── dashboard/
    ├── skills/
    ├── projects/
    ├── experience/
    ├── education/
    ├── certifications/
    ├── profile/
    └── media/
```

## Key API Endpoints

All endpoints require Bearer token in Authorization header.

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/admin/auth/login` | Authenticate |
| GET | `/api/admin/content/skills` | List skills |
| POST | `/api/admin/content/skills` | Create skill |
| PUT | `/api/admin/content/skills/{id}` | Update skill |
| DELETE | `/api/admin/content/skills/{id}` | Delete skill |
| POST | `/api/admin/media/upload` | Upload file |
| GET | `/api/admin/media/files` | List files |
| DELETE | `/api/admin/media/files/{id}` | Delete file |

See backend API documentation for complete endpoint list.

## Troubleshooting

### "flutter: command not found"
- Ensure Flutter is in your PATH
- Run `flutter doctor` to verify installation
- Restart terminal after installation

### "Android SDK not found"
```bash
flutter doctor --android-licenses
flutter doctor
```

### "Gradle build failed"
```bash
cd android
./gradlew clean
cd ..
flutter clean
flutter pub get
flutter build apk
```

### "Emulator connection refused"
- Ensure backend is running on `localhost:8000`
- Check `.env` has correct `API_BASE_URL`
- On Android emulator, use `10.0.2.2` instead of `localhost`

### "Platform exception: Keychain error"
- iOS keychain access issue
- Clean build: `flutter clean && flutter pub get`
- Try on physical device instead of simulator

## Environment Variables

Edit `.env` to configure:

```
API_BASE_URL=http://localhost:8000
```

Available variables:
- `API_BASE_URL` — Backend API base URL

## Code Generation

Whenever you modify models with `@freezed` or `@JsonSerializable`:

```bash
dart run build_runner build --delete-conflicting-outputs
```

Or in watch mode (auto-regenerate on save):

```bash
dart run build_runner watch
```

## Testing

Run linter:
```bash
flutter analyze
```

Run tests (once added):
```bash
flutter test
```

## Performance Tips

1. **Release Builds:** Always test with `flutter run --release`
2. **Image Caching:** Uses `cached_network_image` for optimization
3. **State Management:** Riverpod provides efficient rebuilds
4. **Code Splitting:** Features are modular and lazy-loaded

## Contributing

Follow these guidelines:
- Use `dart format .` to format code
- Run `flutter analyze` before commits
- Keep commits focused and descriptive
- Test on both Android and iOS

## License

Proprietary - All rights reserved

## Support

For issues:
1. Check the troubleshooting section
2. Run `flutter doctor` to diagnose environment
3. Check backend logs: `d:/Portfolio/backend/`
4. Review API response in network logs

## Next Steps

1. ✅ Flutter project created
2. ✅ Core architecture implemented
3. ✅ UI theme configured
4. ⏳ **Build APK and test on device**
5. ⏳ Enhance form screens (currently minimal)
6. ⏳ Add image picker for skill icons
7. ⏳ Implement search/filtering
8. ⏳ Add Firebase analytics (optional)
9. ⏳ Deploy to Google Play & App Store

---

**Built with ❤️ using Flutter**
