import React, { useRef } from 'react'
import { ActivityIndicator, Animated, Text, TouchableOpacity, View } from 'react-native'

import { CustomButtonProps } from '@/type'
import cn from 'clsx'

const CustomButton = ({
  onPress,
  title = "Click Me",
  style,
  textStyle,
  leftIcon,
  isLoading = false,
}: CustomButtonProps) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity 
        className={cn('custom-btn', style)} 
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.8}
        style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}
      >
        {leftIcon}
        <View className="flex-1 items-center justify-center">
          {isLoading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text className={cn('paragraph-semibold', textStyle || 'text-white-100')}>{title}</Text>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  )
}

export default CustomButton
