import { View, Text, TouchableOpacity, ActivityIndicator, Animated } from 'react-native'
import React, { useRef } from 'react'

import cn from 'clsx'
import { CustomButtonProps } from '@/type'

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
      >
        {leftIcon}
        <View className="flex-center flex-row">
          {isLoading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text className={cn('text-white-100 paragraph-semibold', textStyle)}>{title}</Text>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  )
}

export default CustomButton
