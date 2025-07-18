import CartItem from '@/components/CartItem';
import CustomButton from "@/components/CustomButton";
import { images } from '@/constants';
import { useCartStore } from "@/store/cart.store";
import { PaymentInfoStripeProps } from '@/type';
import cn from "clsx";
import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, Dimensions, FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get('window');

const PaymentInfoStripe = ({ label,  value,  labelStyle,  valueStyle, }: PaymentInfoStripeProps) => (
    <View className="flex-between flex-row my-2">
        <Text className={cn("text-base text-gray-600", labelStyle)}>
            {label}
        </Text>
        <Text className={cn("text-base font-semibold text-gray-800", valueStyle)}>
            {value}
        </Text>
    </View>
);

const EmptyCart = () => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;

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
        ]).start();
    }, []);

    return (
        <Animated.View 
            style={{
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
            }}
            className="flex-1 items-center justify-center px-8"
        >
            <View className="w-32 h-32 bg-orange-50 rounded-full items-center justify-center mb-6">
                <Image 
                    source={images.bag} 
                    className="w-16 h-16" 
                    resizeMode="contain" 
                    tintColor="#FF9C01"
                />
            </View>
            <Text className="text-2xl font-bold text-gray-800 mb-3">Your cart is empty</Text>
            <Text className="text-center text-gray-500 mb-8 leading-6">
                Looks like you haven't added anything to your cart yet. Start exploring our delicious menu!
            </Text>
            <CustomButton 
                title="Start Shopping" 
                style="bg-orange-500 px-8 py-4 rounded-2xl items-center justify-center"
                textStyle="text-white font-semibold text-center"
                onPress={() => router.push('/')}
            />
        </Animated.View>
    );
};

const Cart = () => {
    const { items, getTotalItems, getTotalPrice } = useCartStore();
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const totalItems = getTotalItems();
    const totalPrice = getTotalPrice();
    const deliveryFee = 5.00;
    const discount = 0.50;
    const finalTotal = totalPrice + deliveryFee - discount;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
        }).start();
    }, []);

    const renderHeader = () => (
        <View className="px-5 pt-4 pb-2">
            <View className="flex-row items-center justify-between mb-4">
                <Text className="text-2xl font-bold text-gray-800">Your Cart</Text>
                <View className="bg-orange-100 px-3 py-1 rounded-full">
                    <Text className="text-orange-600 font-semibold">{totalItems} items</Text>
                </View>
            </View>
        </View>
    );

    const renderFooter = () => totalItems > 0 && (
        <Animated.View 
            style={{ opacity: fadeAnim }}
            className="px-5 pb-6"
        >
            {/* Order Summary Card */}
            <View className="bg-white rounded-3xl p-6 shadow-lg shadow-gray-200 border border-gray-100 mb-6">
                <View className="flex-row items-center mb-4">
                    <View className="w-8 h-8 bg-orange-100 rounded-lg items-center justify-center mr-3">
                        <Image 
                            source={images.dollar} 
                            className="w-4 h-4" 
                            resizeMode="contain" 
                            tintColor="#FF9C01"
                        />
                    </View>
                    <Text className="text-lg font-bold text-gray-800">Order Summary</Text>
                </View>

                <PaymentInfoStripe
                    label={`Subtotal (${totalItems} items)`}
                    value={`$${totalPrice.toFixed(2)}`}
                />
                <PaymentInfoStripe
                    label="Delivery Fee"
                    value={`$${deliveryFee.toFixed(2)}`}
                />
                <PaymentInfoStripe
                    label="Discount"
                    value={`-$${discount.toFixed(2)}`}
                    valueStyle="!text-green-600 font-semibold"
                />
                
                <View className="border-t border-gray-200 my-4" />
                
                <PaymentInfoStripe
                    label="Total"
                    value={`$${finalTotal.toFixed(2)}`}
                    labelStyle="!text-lg !font-bold !text-gray-800"
                    valueStyle="!text-lg !font-bold !text-orange-600"
                />
            </View>

            {/* Action Buttons */}
            <View className="space-y-3">
                <CustomButton 
                    title={`Checkout • $${finalTotal.toFixed(2)}`}
                    style="bg-orange-500 py-4 rounded-2xl shadow-lg"
                    textStyle="text-white text-lg font-bold"
                />
                
                <TouchableOpacity 
                    className="bg-gray-100 py-4 rounded-2xl items-center"
                    onPress={() => router.push('/')}
                >
                    <Text className="text-gray-700 font-semibold">Continue Shopping</Text>
                </TouchableOpacity>
            </View>
        </Animated.View>
    );

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            {totalItems === 0 ? (
                <EmptyCart />
            ) : (
                <FlatList
                    data={items}
                    renderItem={({ item, index }) => (
                        <Animated.View
                            style={{
                                opacity: fadeAnim,
                                transform: [{
                                    translateY: fadeAnim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [50, 0]
                                    })
                                }]
                            }}
                        >
                            <CartItem item={item} />
                        </Animated.View>
                    )}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                    ListHeaderComponent={renderHeader}
                    ListFooterComponent={renderFooter}
                    contentContainerStyle={{ paddingBottom: 20 }}
                />
            )}
        </SafeAreaView>
    )
}

export default Cart