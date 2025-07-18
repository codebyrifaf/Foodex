import CustomButton from '@/components/CustomButton'
import { images } from '@/constants'
import { signOut } from '@/lib/appwrite'
import useAuthStore from '@/store/auth.store'
import { router } from 'expo-router'
import { useEffect, useRef } from 'react'
import { Animated, Dimensions, Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native'

const { width: screenWidth } = Dimensions.get('window')

const ProfileCard = ({ icon, label, value, gradient = false }: {
  icon: any;
  label: string;
  value: string;
  gradient?: boolean;
}) => (
  <Animated.View className="mb-4">
    <View className={`rounded-3xl p-5 ${gradient ? 'bg-gradient-to-r from-orange-400 to-orange-600' : 'bg-white'} shadow-lg shadow-gray-200`}>
      <View className="flex-row items-center">
        <View className={`w-12 h-12 rounded-2xl items-center justify-center ${gradient ? 'bg-white/20' : 'bg-orange-50'}`}>
          <Image 
            source={icon} 
            className="w-6 h-6" 
            resizeMode="contain" 
            tintColor={gradient ? "black" : "#FF9C01"} 
          />
        </View>
        <View className="flex-1 ml-4">
          <Text className={`text-sm mb-1 ${gradient ? 'text-black/80' : 'text-gray-500'}`}>{label}</Text>
          <Text className={`text-base font-semibold ${gradient ? 'text-black' : 'text-gray-800'}`}>{value}</Text>
        </View>
      </View>
    </View>
  </Animated.View>
)

const StatsCard = ({ title, count, icon }: { title: string; count: string; icon: any }) => (
  <View className="flex-1 bg-white rounded-2xl p-4 mx-2 shadow-sm shadow-gray-200">
    <View className="items-center">
      <View className="w-10 h-10 bg-orange-50 rounded-xl items-center justify-center mb-2">
        <Image source={icon} className="w-5 h-5" resizeMode="contain" tintColor="#FF9C01" />
      </View>
      <Text className="text-xl font-bold text-gray-800">{count}</Text>
      <Text className="text-xs text-gray-500">{title}</Text>
    </View>
  </View>
)

const Profile = () => {
  const { user, setIsAuthenticated, setUser } = useAuthStore()

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(30)).current
  const scaleAnim = useRef(new Animated.Value(0.9)).current

  useEffect(() => {
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
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start()
  }, [])

  const handleLogout = async () => {
    try {
      await signOut(); // Properly sign out from Appwrite
      setIsAuthenticated(false)
      setUser(null)
      router.replace('/sign-in')
    } catch (error) {
      console.log('Logout error:', error);
      // Even if logout fails, clear local state
      setIsAuthenticated(false)
      setUser(null)
      router.replace('/sign-in')
    }
  }

  const handleEditProfile = () => {
    router.push('/edit-profile')
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView 
        className="flex-1" 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
      >
        {/* Header with Gradient Background */}
        <View className="pt-4 pb-12 relative overflow-hidden" style={{ backgroundColor: '#FF9C01' }}>
          {/* Decorative circles */}
          <View className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full" />
          <View className="absolute -bottom-5 -left-5 w-20 h-20 bg-white/10 rounded-full" />
          
          <View className="flex-row items-center justify-between px-6 mb-8">
            <View className="w-10 h-10" />
            <Text className="text-xl font-bold text-white">My Profile</Text>
            <TouchableOpacity className="w-10 h-10 bg-white/20 rounded-full items-center justify-center">
              <Image 
                source={images.pencil} 
                className="w-5 h-5" 
                resizeMode="contain" 
                tintColor="white"
              />
            </TouchableOpacity>
          </View>

          {/* Profile Avatar Section */}
          <Animated.View 
            style={{
              opacity: fadeAnim,
              transform: [
                { translateY: slideAnim },
                { scale: scaleAnim }
              ]
            }}
            className="items-center"
          >
            <View className="relative mb-4">
              <View className="w-28 h-28 bg-white rounded-full p-1 shadow-xl">
                <Image 
                  source={user?.avatar ? { uri: user.avatar } : images.avatar}
                  className="w-full h-full rounded-full"
                  resizeMode="cover"
                />
              </View>
              <TouchableOpacity 
                className="absolute -bottom-1 -right-1 bg-white w-9 h-9 rounded-full items-center justify-center shadow-lg"
                onPress={handleEditProfile}
              >
                <Image 
                  source={images.pencil} 
                  className="w-4 h-4" 
                  resizeMode="contain" 
                  tintColor="#FF9C01"
                />
              </TouchableOpacity>
            </View>
            <Text className="text-2xl font-bold text-white mb-1">{user?.name || "Adrian Hajdin"}</Text>
            <Text className="text-white/80 text-sm">Food Enthusiast</Text>
          </Animated.View>
        </View>

        {/* Stats Cards */}
        <View className="flex-row px-4 -mt-8 mb-6">
          <StatsCard title="Orders" count="12" icon={images.bag} />
          <StatsCard title="Reviews" count="8" icon={images.star} />
          <StatsCard title="Points" count="240" icon={images.dollar} />
        </View>

        {/* Profile Information */}
        <View className="px-4 mb-6">
          <Text className="text-lg font-bold text-gray-800 mb-4">Personal Information</Text>
          
          <View className="bg-white rounded-2xl p-4 shadow-sm shadow-gray-200">
            <View className="flex-row items-center py-3 border-b border-gray-100">
              <View className="w-10 h-10 bg-orange-50 rounded-lg items-center justify-center mr-3">
                <Image 
                  source={images.user} 
                  className="w-5 h-5" 
                  resizeMode="contain" 
                  tintColor="#FF9C01" 
                />
              </View>
              <View className="flex-1">
                <Text className="text-sm text-gray-500 mb-1">Full Name</Text>
                <Text className="text-base font-semibold text-gray-800">{user?.name || "Adrian Hajdin"}</Text>
              </View>
            </View>
            
            <View className="flex-row items-center py-3 border-b border-gray-100">
              <View className="w-10 h-10 bg-orange-50 rounded-lg items-center justify-center mr-3">
                <Image 
                  source={images.envelope} 
                  className="w-5 h-5" 
                  resizeMode="contain" 
                  tintColor="#FF9C01" 
                />
              </View>
              <View className="flex-1">
                <Text className="text-sm text-gray-500 mb-1">Email Address</Text>
                <Text className="text-base font-semibold text-gray-800">{user?.email || "adrian@jsmastery.com"}</Text>
              </View>
            </View>
            
            <View className="flex-row items-center py-3 border-b border-gray-100">
              <View className="w-10 h-10 bg-orange-50 rounded-lg items-center justify-center mr-3">
                <Image 
                  source={images.phone} 
                  className="w-5 h-5" 
                  resizeMode="contain" 
                  tintColor="#FF9C01" 
                />
              </View>
              <View className="flex-1">
                <Text className="text-sm text-gray-500 mb-1">Phone Number</Text>
                <Text className="text-base font-semibold text-gray-800">{user?.phone || "+1 555 123 4567"}</Text>
              </View>
            </View>
            
            <View className="flex-row items-center py-3">
              <View className="w-10 h-10 bg-orange-50 rounded-lg items-center justify-center mr-3">
                <Image 
                  source={images.location} 
                  className="w-5 h-5" 
                  resizeMode="contain" 
                  tintColor="#FF9C01" 
                />
              </View>
              <View className="flex-1">
                <Text className="text-sm text-gray-500 mb-1">Home Address</Text>
                <Text className="text-base font-semibold text-gray-800">{user?.address || "123 Main Street, Springfield, IL 62704"}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="px-4 mb-20">
          <View className="space-y-4">
            <CustomButton
              title="Edit Profile"
              onPress={handleEditProfile}
              style="bg-white border-2 border-orange-200 shadow-lg"
              textStyle="text-black font-semibold"
            />
            
            <CustomButton
              title="Sign Out"
              onPress={handleLogout}
              style="bg-red-500"
              textStyle="text-white font-semibold"
              leftIcon={
                <Image 
                  source={images.logout} 
                  className="w-5 h-5 mr-2" 
                  resizeMode="contain" 
                  tintColor="white"
                />
              }
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Profile