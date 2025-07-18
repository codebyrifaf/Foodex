import { images } from '@/constants';
import { AVPlaybackStatus, ResizeMode, Video } from 'expo-av';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, Image, StatusBar, StyleSheet, View } from 'react-native';

interface VideoSplashScreenProps {
  onFinish: () => void;
}

const VideoSplashScreen: React.FC<VideoSplashScreenProps> = ({ onFinish }) => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [showFallback, setShowFallback] = useState(false);
  const videoRef = useRef<Video>(null);
  const { width, height } = Dimensions.get('window');

  useEffect(() => {
    // Keep the splash screen visible while we prepare the video
    SplashScreen.preventAutoHideAsync();
    
    // Fallback timeout - if video doesn't load within 3 seconds, show fallback
    const fallbackTimeout = setTimeout(() => {
      if (!isVideoLoaded) {
        console.log('Video taking too long to load, showing fallback');
        setShowFallback(true);
        SplashScreen.hideAsync();
        // Auto-proceed to main app after showing fallback for 2 seconds
        setTimeout(() => {
          onFinish();
        }, 2000);
      }
    }, 3000);
    
    return () => {
      clearTimeout(fallbackTimeout);
      SplashScreen.hideAsync();
    };
  }, [isVideoLoaded, onFinish]);

  const handleVideoLoad = () => {
    setIsVideoLoaded(true);
    // Hide the default splash screen once video is loaded and ready to play
    SplashScreen.hideAsync();
  };

  const handlePlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      // Video finished playing
      if (status.didJustFinish) {
        handleVideoEnd();
      }
    }
  };

  const handleVideoEnd = () => {
    // Call the onFinish callback when video ends
    onFinish();
  };

  const handleVideoError = (error: any) => {
    console.log('Video splash screen error:', error);
    // If video fails to load, show fallback image
    setShowFallback(true);
    SplashScreen.hideAsync();
    // Auto-proceed to main app after showing fallback for 2 seconds
    setTimeout(() => {
      onFinish();
    }, 2000);
  };

  // Show fallback image if video fails or takes too long
  if (showFallback) {
    return (
      <View style={[styles.container, { width, height }]}>
        <StatusBar hidden />
        <Image 
          source={images.logo} 
          style={styles.fallbackImage}
          resizeMode="contain"
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { width, height }]}>
      <StatusBar hidden />
      <Video
        ref={videoRef}
        source={require('../assets/images/vdo.mp4')}
        style={[styles.video, { width, height }]}
        resizeMode={ResizeMode.COVER}
        shouldPlay={true}
        isLooping={false}
        isMuted={false}
        volume={1.0}
        onLoad={handleVideoLoad}
        onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
        onError={handleVideoError}
        useNativeControls={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    flex: 1,
  },
  fallbackImage: {
    width: 200,
    height: 200,
  },
});

export default VideoSplashScreen;
