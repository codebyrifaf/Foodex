import { images } from "@/constants";
import { useCartStore } from '@/store/cart.store';
import { MenuItem } from "@/type";
import { Image, Platform, Text, TouchableOpacity } from 'react-native';

const MenuCard = ({ item: { $id, image_url, name, price }}: { item: MenuItem}) => {
    // Use local image from constants instead of external URL
    const imageSource = images[image_url as keyof typeof images] || images.logo;
    const { addItem } = useCartStore();

    return (
        <TouchableOpacity className="menu-card" style={Platform.OS === 'android' ? { elevation: 10, shadowColor: '#878787'}: {}}>
            <Image source={imageSource} className="size-32 absolute -top-10" resizeMode="contain" />
            <Text className="text-center base-bold text-dark-100 mb-2" numberOfLines={1}>{name}</Text>
            <Text className="body-regular text-gray-200 mb-4">From ${price}</Text>
            <TouchableOpacity onPress={() => addItem({ id: $id, name, price, image_url: image_url, customizations: []})}>
                <Text className="paragraph-bold text-primary">Add to Cart +</Text>
            </TouchableOpacity>
        </TouchableOpacity>
    )
}

export default MenuCard