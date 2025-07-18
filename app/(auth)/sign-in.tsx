import CustomButton from '@/components/CustomButton';
import CustomInput from '@/components/CustomInput';
import { signIn } from '@/lib/appwrite';
import useAuthStore from '@/store/auth.store';
import * as Sentry from '@sentry/react-native';
import { Link, router } from "expo-router";
import { useEffect, useRef, useState } from 'react';
import { Alert, Animated, Text, View } from 'react-native';

const SignIn = () => {
  const { fetchAuthenticatedUser } = useAuthStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });
  
  // Animation values - using useRef to persist across re-renders
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const emailAnim = useRef(new Animated.Value(0)).current;
  const passwordAnim = useRef(new Animated.Value(0)).current;
  const buttonAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start animations when component mounts
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    // Staggered animations for form elements
    Animated.stagger(150, [
      Animated.timing(emailAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(passwordAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(buttonAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const submit = async () => {
    const { email, password } = form; 
    if (!email || !password) return Alert.alert('Error', 'Please enter valid email and password');
    setIsSubmitting(true)

    try {
      await signIn({ email, password });
      
      // After successful log-in, fetch the user data and update auth state
      await fetchAuthenticatedUser();
      
      router.replace('/');
    } catch (error: any) {
      Alert.alert('Error', error.message);
      Sentry.captureEvent(error);
    } finally {
      setIsSubmitting(false);
    }
  }
  return (
    <Animated.View 
      style={{
        opacity: fadeAnim,
        transform: [
          { translateY: slideAnim },
          { scale: scaleAnim }
        ]
      }}
      className='gap-10 bg-white rounded-lg p-5 mt-5'
    >
      <Animated.View 
        style={{
          opacity: emailAnim,
          transform: [{ translateY: Animated.multiply(emailAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [30, 0]
          }), 1) }]
        }}
      >
        <CustomInput
          placeholder="Enter your email"
          value={form.email}
          onChangeText={(text) => setForm((prev) => ({ ...prev, email: text }))}
          label="Email"
          keyboardType="email-address"
        />
      </Animated.View>
      <Animated.View 
        style={{
          opacity: passwordAnim,
          transform: [{ translateY: Animated.multiply(passwordAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [30, 0]
          }), 1) }]
        }}
      >
        <CustomInput
          placeholder="Enter your password"
          value={form.password}
          onChangeText={(text) => setForm((prev) => ({ ...prev, password: text }))}
          label="Password"
          secureTextEntry={true}
        />
      </Animated.View>
      <Animated.View 
        style={{
          opacity: buttonAnim,
          transform: [{ scale: buttonAnim }]
        }}
      >
        <CustomButton
          title="Log In"
          isLoading={isSubmitting}
          onPress={submit}
        />
      </Animated.View>
      <View className="flex justify-center mt-5 flex-row gap-2">
        <Text className="base-reguler text-gray-100">Don't have an account?</Text>
        <Link href="/sign-up" className="base-bold text-primary">
          Sign Up
        </Link>
      </View>
    </Animated.View>
  )
}

export default SignIn
