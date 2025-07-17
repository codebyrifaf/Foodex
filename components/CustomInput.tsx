import { CustomInputProps } from '@/type'
import { View, Text } from 'react-native'

const CustomInput = ({
  placeholder = 'Enter text',
  value,
  onChangeText,
  label,
  secureTextEntry = false,
  keyboardType = "default"
}: CustomInputProps) => {
  return (
    <View className="w-full">
      <Text className="label">{label}</Text>

      
    </View>
  )
}

export default CustomInput
