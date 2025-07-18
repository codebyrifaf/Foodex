import VideoSplashScreen from "@/components/VideoSplashScreen";
import useAuthStore from "@/store/auth.store";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Sentry from '@sentry/react-native';
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import './global.css';


Sentry.init({
  dsn: 'https://d32ecf9cd838d512b8ebf6e400b8efd4@o4509684701593601.ingest.de.sentry.io/4509684733968464',

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Configure Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [Sentry.mobileReplayIntegration(), Sentry.feedbackIntegration()],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

export default Sentry.wrap(function RootLayout() {
  const {isLoading, fetchAuthenticatedUser} = useAuthStore();
  const [showVideoSplash, setShowVideoSplash] = useState(true);
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);

  const[fontsLoaded, error] = useFonts({
    "Quicksand-Bold": require("../assets/fonts/Quicksand-Bold.ttf"),
    "Quicksand-Medium": require("../assets/fonts/Quicksand-Medium.ttf"),
    "Quicksand-Regular": require("../assets/fonts/Quicksand-Regular.ttf"),
    "Quicksand-SemiBold": require("../assets/fonts/Quicksand-SemiBold.ttf"),
    "Quicksand-Light": require("../assets/fonts/Quicksand-Light.ttf"),
  });

  useEffect(() => {
    if(error) throw error;
    // Don't hide splash screen here anymore, let video component handle it
  }, [fontsLoaded, error]);

  useEffect(() => {
    fetchAuthenticatedUser()
  },[]);

  // Check if this is first launch
  useEffect(() => {
    const checkFirstLaunch = async () => {
      try {
        const hasLaunchedBefore = await AsyncStorage.getItem('hasLaunchedBefore');
        if (hasLaunchedBefore === null) {
          // First launch
          setIsFirstLaunch(true);
          await AsyncStorage.setItem('hasLaunchedBefore', 'true');
        } else {
          // Not first launch - you can choose to still show video by setting this to true
          setIsFirstLaunch(true); // Change to false if you want video only on first launch
        }
      } catch (error) {
        console.log('Error checking first launch:', error);
        setIsFirstLaunch(true); // Default to showing video
      }
    };

    checkFirstLaunch();
  }, []);

  // Show video splash screen if it's first launch (or every time based on your preference)
  if (showVideoSplash && isFirstLaunch && fontsLoaded) {
    return (
      <VideoSplashScreen 
        onFinish={() => setShowVideoSplash(false)} 
      />
    );
  }

  // Show loading state while fonts are loading or auth is being checked or first launch status is unknown
  if(!fontsLoaded || isLoading || isFirstLaunch === null) {
    return null; // or a loading spinner
  }

  return <Stack screenOptions={{ headerShown: false}} />;
});

Sentry.showFeedbackWidget();