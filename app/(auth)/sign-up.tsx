import CustomButton from '@/components/CustomButton';
import CustomInput from '@/components/CustomInput';
import { createUser } from '@/lib/appwrite';
import useAuthStore from '@/store/auth.store';
import { Link, router } from "expo-router";
import { useState } from 'react';
import { Alert, Text, View } from 'react-native';

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
    <View className='gap-10 bg-white rounded-lg p-5 mt-5'>
      <CustomInput
        placeholder="Enter your full name"
        value={form.name}
        onChangeText={(text) => setForm((prev) => ({ ...prev, name: text }))}
        label="Full Name"
      />
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
      <CustomInput
        placeholder="Enter your phone number"
        value={form.phone}
        onChangeText={(text) => setForm((prev) => ({ ...prev, phone: text }))}
        label="Phone Number"
        keyboardType="phone-pad"
      />
      <CustomInput
        placeholder="Enter your address"
        value={form.address}
        onChangeText={(text) => setForm((prev) => ({ ...prev, address: text }))}
        label="Address"
      />
      <CustomButton
        title="Sign Up"
        isLoading={isSubmitting}
        onPress={submit}
      />
      <View className="flex justify-center mt-5 flex-row gap-2">
        <Text className="base-reguler text-gray-100">Already have an account?</Text>
        <Link href="/sign-in" className="base-bold text-primary">
          Sign In
        </Link>
      </View>
    </View>
  )
}

export default SignUp
