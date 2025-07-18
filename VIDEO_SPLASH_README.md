# Video Splash Screen Implementation

## Overview
The Foodex app now includes a custom video splash screen that plays the `vdo.mp4` file from the assets/images folder when the app launches.

## Features

### ✅ **Video Playback**
- Plays the 2-second `vdo.mp4` video on app launch
- Full-screen video with proper aspect ratio (COVER resize mode)
- Audio enabled for immersive experience

### ✅ **Fallback Mechanism**
- If video fails to load or takes too long (>3 seconds), shows fallback logo image
- Auto-proceeds to main app after 2 seconds if fallback is shown
- Graceful error handling ensures app never gets stuck

### ✅ **Smart Loading**
- Prevents auto-hide of default splash screen until video is ready
- Smooth transition from default splash to video splash
- Hides status bar during video playback for immersive experience

### ✅ **Performance Optimized**
- Video loads in background while fonts and auth are being initialized
- No blocking of essential app initialization
- Memory efficient with proper cleanup

## Configuration

### Show Video Every Launch
The current configuration shows the video splash on every app launch. This is set in `app/_layout.tsx`:

```typescript
setIsFirstLaunch(true); // Shows video every time
```

### Show Video Only on First Launch
To show video only on first app launch, change the line to:

```typescript
setIsFirstLaunch(false); // Shows video only on first launch
```

## Technical Implementation

### Components
- **VideoSplashScreen** (`components/VideoSplashScreen.tsx`): Main video splash component
- **Root Layout** (`app/_layout.tsx`): Integration with app initialization flow

### Dependencies
- `expo-av`: For video playback
- `@react-native-async-storage/async-storage`: For tracking first launch
- `expo-splash-screen`: For managing default splash screen

### Video Requirements
- **Format**: MP4
- **Location**: `assets/images/vdo.mp4`
- **Duration**: 2 seconds (recommended)
- **Aspect Ratio**: Any (will be scaled to cover full screen)

## Customization

### Video File
Replace `assets/images/vdo.mp4` with your custom video file. Ensure it's:
- MP4 format for maximum compatibility
- Reasonable file size (< 5MB recommended)
- Appropriate duration (1-3 seconds recommended)

### Styling
Modify `components/VideoSplashScreen.tsx` to customize:
- Background color
- Resize mode (COVER, CONTAIN, STRETCH)
- Fallback image
- Timeout duration

### Behavior
Modify `app/_layout.tsx` to customize:
- When to show video (every launch vs first launch only)
- Loading sequence
- Integration with auth flow

## Troubleshooting

### Video Not Playing
1. Check if `vdo.mp4` exists in `assets/images/` folder
2. Verify video file is valid MP4 format
3. Check console for error messages
4. Fallback mechanism will trigger automatically

### Performance Issues
1. Reduce video file size
2. Optimize video encoding
3. Consider shorter duration
4. Check device memory availability

### Build Issues
1. Ensure all dependencies are installed: `npm install`
2. Clear cache: `npx expo start --clear`
3. Rebuild: `npx expo run:android` or `npx expo run:ios`

## Files Modified

- `app/_layout.tsx` - Main integration
- `components/VideoSplashScreen.tsx` - Video splash component  
- `app.json` - Added expo-av plugin
- `package.json` - Added dependencies

The video splash screen provides a professional, branded launch experience while maintaining excellent performance and reliability.
