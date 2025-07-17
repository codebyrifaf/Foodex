import CustomButton from '@/components/CustomButton';
import CustomInput from '@/components/CustomInput';
import { Link, router } from "expo-router";
import { useState } from 'react';
import { Alert, Text, View } from 'react-native';
import { signIn } from '@/lib/appwrite'; // Ensure this function is defined in your appwrite.ts
import * as Sentry from '@sentry/react-native'; // Import Sentry for error tracking

const SignIn = () => {


  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });

  const submit = async () => {
    const { email, password } = form; 
    if (!email || !password) return Alert.alert('Error', 'Please enter valid email and password');
    setIsSubmitting(true)

    try {
      await signIn({ email, password });

      router.replace('/');
    } catch (error: any) {
      Alert.alert('Error', error.message);
      Sentry.captureEvent(error);
    } finally {
      setIsSubmitting(false);
    }
  }
  return (
    <View className='gap-10 bg-white rounded-lg p-5 mt-5'>
      <CustomInput
        placeholder="Enter your email"
        value={form.email}
        onChangeText={(text) => setForm((prev) => ({ ...prev, email: text }))}
        label="Email"
        keyboardType="email-address"
      />
      <CustomInput
        placeholder="Enter your password"
        value={form.password}
        onChangeText={(text) => setForm((prev) => ({ ...prev, password: text }))}
        label="Password"
        secureTextEntry={true}
      />
      <CustomButton
        title="Sign In"
        isLoading={isSubmitting}
        onPress={submit}
      />
      <View className="flex justify-center mt-5 flex-row gap-2">
        <Text className="base-reguler text-gray-100">Don't have an account?</Text>
        <Link href="/sign-up" className="base-bold text-primary">
          Sign Up
        </Link>
      </View>
    </View>
  )
}

export default SignIn
