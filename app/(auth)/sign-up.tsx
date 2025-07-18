import CustomButton from '@/components/CustomButton';
import CustomInput from '@/components/CustomInput';
import { createUser } from '@/lib/appwrite';
import useAuthStore from '@/store/auth.store';
import { Link, router } from "expo-router";
import { useState, useEffect, useRef } from 'react';
import { Alert, Text, View, Animated } from 'react-native';

const SignUp = () => {
  const { fetchAuthenticatedUser } = useAuthStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    phone: '', 
    address: '' 
  });

  // Animation values - using useRef to persist across re-renders
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const nameAnim = useRef(new Animated.Value(0)).current;
  const emailAnim = useRef(new Animated.Value(0)).current;
  const passwordAnim = useRef(new Animated.Value(0)).current;
  const phoneAnim = useRef(new Animated.Value(0)).current;
  const addressAnim = useRef(new Animated.Value(0)).current;
  const buttonAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start container animations
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
    Animated.stagger(100, [
      Animated.timing(nameAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
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
      Animated.timing(phoneAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(addressAnim, {
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
    const { name, email, password, phone, address } = form; 
    if (!name || !email || !password) {
      return Alert.alert('Error', 'Please fill in name, email and password');
    }
    setIsSubmitting(true)

    try {
      await createUser({
        email,
        password,
        name,
        phone,
        address
      });
      
      // Show success message
      Alert.alert('Success', 'Signed up successfully! Welcome to Foodex!');
      
      // After successful account creation, fetch the user data and update auth state
      await fetchAuthenticatedUser();
      
      router.replace('/');
    } catch (error: any) {
      Alert.alert('Error', error.message);
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
          opacity: nameAnim,
          transform: [{ translateY: Animated.multiply(nameAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [30, 0]
          }), 1) }]
        }}
      >
        <CustomInput
          placeholder="Enter your full name"
          value={form.name}
          onChangeText={(text) => setForm((prev) => ({ ...prev, name: text }))}
          label="Full Name"
        />
      </Animated.View>
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
          opacity: phoneAnim,
          transform: [{ translateY: Animated.multiply(phoneAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [30, 0]
          }), 1) }]
        }}
      >
        <CustomInput
          placeholder="Enter your phone number"
          value={form.phone}
          onChangeText={(text) => setForm((prev) => ({ ...prev, phone: text }))}
          label="Phone Number"
          keyboardType="phone-pad"
        />
      </Animated.View>
      <Animated.View 
        style={{
          opacity: addressAnim,
          transform: [{ translateY: Animated.multiply(addressAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [30, 0]
          }), 1) }]
        }}
      >
        <CustomInput
          placeholder="Enter your address"
          value={form.address}
          onChangeText={(text) => setForm((prev) => ({ ...prev, address: text }))}
          label="Address"
        />
      </Animated.View>
      <Animated.View 
        style={{
          opacity: buttonAnim,
          transform: [{ scale: buttonAnim }]
        }}
      >
        <CustomButton
          title="Sign Up"
          isLoading={isSubmitting}
          onPress={submit}
        />
      </Animated.View>
      <View className="flex justify-center mt-5 flex-row gap-2">
        <Text className="base-reguler text-gray-100">Already have an account?</Text>
        <Link href="/sign-in" className="base-bold text-primary">
          Log In
        </Link>
      </View>
    </Animated.View>
  )
}

export default SignUp
