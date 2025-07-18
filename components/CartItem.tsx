import { images } from "@/constants";
import { useCartStore } from "@/store/cart.store";
import { CartItemType } from "@/type";
import { useEffect, useRef } from "react";
import { Animated, Image, Text, TouchableOpacity, View } from "react-native";

const CartItem = ({ item }: { item: CartItemType }) => {
    const { increaseQty, decreaseQty, removeItem } = useCartStore();
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;
    
    // Use local image from constants instead of external URL
    const imageSource = images[item.image_url as keyof typeof images] || images.logo;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
        }).start();
    }, []);

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.98,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 3,
            useNativeDriver: true,
        }).start();
    };

    return (
        <Animated.View 
            style={{
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }]
            }}
        >
            <TouchableOpacity
                activeOpacity={0.95}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                className="mx-5 mb-4"
            >
                <View className="bg-white rounded-3xl p-4 shadow-sm shadow-gray-200 border border-gray-100">
                    <View className="flex-row items-center">
                        {/* Food Image */}
                        <View className="w-20 h-20 bg-gray-50 rounded-2xl p-2 mr-4">
                            <Image
                                source={imageSource}
                                className="w-full h-full rounded-xl"
                                resizeMode="cover"
                            />
                        </View>

                        {/* Food Details */}
                        <View className="flex-1">
                            <Text className="text-lg font-bold text-gray-800 mb-1">{item.name}</Text>
                            <Text className="text-lg font-semibold text-orange-600 mb-3">
                                ${item.price}
                            </Text>

                            {/* Quantity Controls */}
                            <View className="flex-row items-center">
                                <TouchableOpacity
                                    onPress={() => decreaseQty(item.id, item.customizations!)}
                                    className="w-8 h-8 bg-orange-50 rounded-lg items-center justify-center"
                                >
                                    <Image
                                        source={images.minus}
                                        className="w-4 h-4"
                                        resizeMode="contain"
                                        tintColor="#FF9C01"
                                    />
                                </TouchableOpacity>

                                <View className="mx-4 bg-gray-50 px-3 py-1 rounded-lg">
                                    <Text className="text-base font-bold text-gray-800">{item.quantity}</Text>
                                </View>

                                <TouchableOpacity
                                    onPress={() => increaseQty(item.id, item.customizations!)}
                                    className="w-8 h-8 bg-orange-50 rounded-lg items-center justify-center"
                                >
                                    <Image
                                        source={images.plus}
                                        className="w-4 h-4"
                                        resizeMode="contain"
                                        tintColor="#FF9C01"
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Remove Button */}
                        <TouchableOpacity
                            onPress={() => removeItem(item.id, item.customizations!)}
                            className="w-10 h-10 bg-red-50 rounded-full items-center justify-center ml-2"
                        >
                            <Image 
                                source={images.trash} 
                                className="w-5 h-5" 
                                resizeMode="contain" 
                                tintColor="#EF4444"
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Customizations */}
                    {item.customizations && Object.keys(item.customizations).length > 0 && (
                        <View className="mt-3 pt-3 border-t border-gray-100">
                            <Text className="text-sm text-gray-500 mb-1">Customizations:</Text>
                            {Object.entries(item.customizations).map(([key, value]) => (
                                <Text key={key} className="text-sm text-gray-600">
                                    • {key}: {Array.isArray(value) ? value.join(', ') : String(value)}
                                </Text>
                            ))}
                        </View>
                    )}
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
};

export default CartItem;