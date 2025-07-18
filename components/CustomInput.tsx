import { CustomInputProps } from '@/type'
import { useState, useRef } from 'react';
import { View, Text, TextInput, Animated } from 'react-native'
import cn from 'clsx';

const CustomInput = ({
    placeholder = 'Enter text',
    value,
    onChangeText,
    label,
    secureTextEntry = false,
    keyboardType = "default"
}: CustomInputProps) => {
    const [isFocused, setIsFocused] = useState(false);
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const borderColorAnim = useRef(new Animated.Value(0)).current;

    const handleFocus = () => {
        setIsFocused(true);
        Animated.parallel([
            Animated.spring(scaleAnim, {
                toValue: 1.02,
                useNativeDriver: true,
            }),
            Animated.timing(borderColorAnim, {
                toValue: 1,
                duration: 200,
                useNativeDriver: false,
            }),
        ]).start();
    };

    const handleBlur = () => {
        setIsFocused(false);
        Animated.parallel([
            Animated.spring(scaleAnim, {
                toValue: 1,
                useNativeDriver: true,
            }),
            Animated.timing(borderColorAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: false,
            }),
        ]).start();
    };

    return (
        <View className="w-full">
            <Text className="label">{label}</Text>
            <Animated.View 
                style={{
                    transform: [{ scale: scaleAnim }],
                }}
            >
                <TextInput
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={value}
                    onChangeText={onChangeText}
                    secureTextEntry={secureTextEntry}
                    keyboardType={keyboardType}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    placeholder={placeholder}
                    placeholderTextColor="#888"
                    className={cn('input', isFocused ? 'border-primary' : 'border-gray-300')}
                />
            </Animated.View>
        </View>
    )
}

export default CustomInput
