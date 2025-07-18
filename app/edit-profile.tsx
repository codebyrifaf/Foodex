import CustomButton from '@/components/CustomButton'
import CustomInput from '@/components/CustomInput'
import { images } from '@/constants'
import { updateUser } from '@/lib/appwrite'
import useAuthStore from '@/store/auth.store'
import { UpdateUserParams } from '@/type'
import { router } from 'expo-router'
import { useEffect, useRef, useState } from 'react'
import { Alert, Animated, Image, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native'

const EditProfile = () => {
  const { user, setUser, fetchAuthenticatedUser } = useAuthStore()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || ''
  })

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(30)).current
  const nameAnim = useRef(new Animated.Value(0)).current
  const phoneAnim = useRef(new Animated.Value(0)).current
  const addressAnim = useRef(new Animated.Value(0)).current
  const buttonAnim = useRef(new Animated.Value(0)).current

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
    ]).start()

    // Staggered animations for form elements
    Animated.stagger(150, [
      Animated.timing(nameAnim, {
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
    ]).start()
  }, [])

  const handleSave = async () => {
    if (!user) {
      Alert.alert('Error', 'User not found')
      return
    }

    // Check if any fields have changed
    const hasChanges = 
      form.name !== user.name ||
      form.phone !== user.phone ||
      form.address !== user.address

    if (!hasChanges) {
      Alert.alert('No Changes', 'No changes were made to your profile.')
      return
    }

    // Validate required fields
    if (!form.name.trim()) {
      Alert.alert('Error', 'Name is required')
      return
    }

    setIsSubmitting(true)

    try {
      const updateData: UpdateUserParams = {}
      
      // Only include changed fields
      if (form.name !== user.name) updateData.name = form.name.trim()
      if (form.phone !== user.phone) updateData.phone = form.phone.trim()
      if (form.address !== user.address) updateData.address = form.address.trim()

      await updateUser(user.$id, updateData)
      
      // Refresh user data
      await fetchAuthenticatedUser()
      
      Alert.alert('Success', 'Profile updated successfully!', [
        { text: 'OK', onPress: () => router.replace('/(tabs)/profile') }
      ])
    } catch (error: any) {
      console.error('Update profile error:', error)
      Alert.alert('Error', error.message || 'Failed to update profile. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        {/* Header */}
        <View className="flex-row items-center justify-between px-6 py-4 border-b border-gray-100">
          <TouchableOpacity onPress={() => router.replace('/(tabs)/profile')}>
            <Image 
              source={images.arrowBack} 
              className="w-6 h-6" 
              resizeMode="contain" 
              tintColor="#1F2937"
            />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-800">Edit Profile</Text>
          <View className="w-6" />
        </View>

        <ScrollView 
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }}
            className="flex-1 px-6"
          >
            {/* Profile Avatar Section */}
            <View className="items-center py-8">
              <View className="relative">
                <View className="w-32 h-32 bg-gray-100 rounded-full p-1">
                  <Image 
                    source={user?.avatar ? { uri: user.avatar } : images.avatar}
                    className="w-full h-full rounded-full"
                    resizeMode="cover"
                  />
                </View>
                <TouchableOpacity 
                  className="absolute -bottom-2 -right-2 bg-orange-500 w-10 h-10 rounded-full items-center justify-center shadow-lg"
                >
                  <Image 
                    source={images.pencil} 
                    className="w-5 h-5" 
                    resizeMode="contain" 
                    tintColor="white"
                  />
                </TouchableOpacity>
              </View>
              <Text className="text-lg font-semibold text-gray-800 mt-4">{user?.name}</Text>
              <Text className="text-sm text-gray-500">{user?.email}</Text>
            </View>

            {/* Form Fields */}
            <View className="space-y-6">
              <Animated.View style={{ opacity: nameAnim }}>
                <CustomInput
                  label="Full Name"
                  placeholder="Enter your full name"
                  value={form.name}
                  onChangeText={(text) => setForm({ ...form, name: text })}
                />
              </Animated.View>

              <Animated.View style={{ opacity: phoneAnim }}>
                <CustomInput
                  label="Phone Number"
                  placeholder="Enter your phone number"
                  value={form.phone}
                  onChangeText={(text) => setForm({ ...form, phone: text })}
                  keyboardType="phone-pad"
                />
              </Animated.View>

              <Animated.View style={{ opacity: addressAnim }}>
                <CustomInput
                  label="Home Address"
                  placeholder="Enter your home address"
                  value={form.address}
                  onChangeText={(text) => setForm({ ...form, address: text })}
                />
              </Animated.View>
            </View>

            {/* Save Button */}
            <Animated.View 
              style={{ opacity: buttonAnim }}
              className="mt-8 mb-8"
            >
              <CustomButton
                title="Save Changes"
                onPress={handleSave}
                isLoading={isSubmitting}
                style="bg-orange-500"
                textStyle="text-white font-semibold"
              />
            </Animated.View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default EditProfile
