import CustomButton from '@/components/CustomButton'
import { images } from '@/constants'
import { signOut } from '@/lib/appwrite'
import useAuthStore from '@/store/auth.store'
import { router } from 'expo-router'
import { Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native'

const ProfileField = ({ icon, label, value, isLast = false }: {
  icon: any;
  label: string;
  value: string;
  isLast?: boolean;
}) => (
  <View className={`flex-row items-center px-4 py-4 ${!isLast ? 'border-b border-gray-100' : ''}`}>
    <Image source={icon} className="w-5 h-5 mr-4" resizeMode="contain" tintColor="#FF9C01" />
    <View className="flex-1">
      <Text className="text-gray-400 text-sm mb-1">{label}</Text>
      <Text className="text-gray-800 text-base font-medium">{value}</Text>
    </View>
  </View>
)

const Profile = () => {
  const { user, setIsAuthenticated, setUser } = useAuthStore()

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
    // TODO: Implement edit profile functionality
    console.log('Edit profile pressed')
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="bg-white pt-4 pb-8">
          <View className="flex-row items-center justify-between px-5 mb-6">
            <TouchableOpacity onPress={() => router.back()}>
              <Image 
                source={images.arrowBack} 
                className="w-6 h-6" 
                resizeMode="contain" 
              />
            </TouchableOpacity>
            <Text className="text-lg font-semibold text-gray-800">Profile</Text>
            <Image 
              source={images.search} 
              className="w-6 h-6" 
              resizeMode="contain" 
            />
          </View>

          {/* Profile Avatar */}
          <View className="items-center mb-8">
            <View className="relative">
              <Image 
                source={user?.avatar ? { uri: user.avatar } : images.avatar}
                className="w-24 h-24 rounded-full"
                resizeMode="cover"
              />
              <TouchableOpacity 
                className="absolute -bottom-1 -right-1 bg-orange-500 w-8 h-8 rounded-full items-center justify-center"
                onPress={handleEditProfile}
              >
                <Image 
                  source={images.pencil} 
                  className="w-4 h-4" 
                  resizeMode="contain" 
                  tintColor="white"
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Profile Information Card */}
        <View className="mx-4 mb-6">
          <View className="bg-white rounded-2xl border border-blue-200 overflow-hidden">
            <ProfileField 
              icon={images.user}
              label="Full Name"
              value={user?.name || "Adrian Hajdin"}
            />
            <ProfileField 
              icon={images.envelope}
              label="Email"
              value={user?.email || "adrian@jsmastery.com"}
            />
            <ProfileField 
              icon={images.phone}
              label="Phone number"
              value={user?.phone || "+1 555 123 4567"}
            />
            <ProfileField 
              icon={images.location}
              label="Address • (Home)"
              value={user?.address || "123 Main Street, Springfield, IL 62704"}
              isLast={true}
            />
          </View>
        </View>

        {/* Action Buttons */}
        <View className="px-4 space-y-4 mb-8">
          <CustomButton
            title="Edit Profile"
            onPress={handleEditProfile}
            style="bg-orange-100 border border-orange-200"
            textStyle="text-orange-600"
          />
          
          <CustomButton
            title="Logout"
            onPress={handleLogout}
            style="bg-red-50 border border-red-200"
            textStyle="text-red-600"
            leftIcon={
              <Image 
                source={images.logout} 
                className="w-5 h-5 mr-2" 
                resizeMode="contain" 
                tintColor="#EF4444"
              />
            }
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Profile