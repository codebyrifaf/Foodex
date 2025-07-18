import CustomButton from '@/components/CustomButton'
import { images, sides, toppings } from '@/constants'
import { getMenu } from '@/lib/appwrite'
import { useCartStore } from '@/store/cart.store'
import { MenuItem } from '@/type'
import { router, useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import { Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native'

const MenuItemDetail = () => {
  const { id } = useLocalSearchParams<{ id: string }>()
  const [item, setItem] = useState<MenuItem | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [selectedToppings, setSelectedToppings] = useState<string[]>([])
  const [selectedSides, setSelectedSides] = useState<string[]>([])
  const { addItem } = useCartStore()

  useEffect(() => {
    fetchMenuItem()
  }, [id])

  const fetchMenuItem = async () => {
    try {
      const menuItems = await getMenu({ category: '', query: '' })
      const foundItem = menuItems.find((menuItem: MenuItem) => menuItem.$id === id)
      if (foundItem) {
        setItem(foundItem)
      }
    } catch (error) {
      console.log('Error fetching menu item:', error)
    }
  }

  const toggleTopping = (toppingName: string) => {
    setSelectedToppings(prev => 
      prev.includes(toppingName) 
        ? prev.filter(t => t !== toppingName)
        : [...prev, toppingName]
    )
  }

  const toggleSide = (sideName: string) => {
    setSelectedSides(prev => 
      prev.includes(sideName) 
        ? prev.filter(s => s !== sideName)
        : [...prev, sideName]
    )
  }

  const calculateTotalPrice = () => {
    if (!item) return 0
    
    let total = item.price * quantity
    
    // Add topping prices
    selectedToppings.forEach(toppingName => {
      const topping = toppings.find(t => t.name === toppingName)
      if (topping) total += topping.price * quantity
    })
    
    // Add side prices
    selectedSides.forEach(sideName => {
      const side = sides.find(s => s.name === sideName)
      if (side) total += side.price * quantity
    })
    
    return total
  }

  const handleAddToCart = () => {
    if (!item) return
    
    const customizations = [
      ...selectedToppings.map(name => ({ id: name, name, price: toppings.find(t => t.name === name)?.price || 0, type: 'topping' })),
      ...selectedSides.map(name => ({ id: name, name, price: sides.find(s => s.name === name)?.price || 0, type: 'side' }))
    ]

    for (let i = 0; i < quantity; i++) {
      addItem({
        id: item.$id,
        name: item.name,
        price: item.price,
        image_url: item.image_url,
        customizations
      })
    }

    router.back()
  }

  if (!item) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 justify-center items-center">
          <Text>Loading...</Text>
        </View>
      </SafeAreaView>
    )
  }

  const imageSource = images[item.image_url as keyof typeof images] || images.logo

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-5 py-4">
          <TouchableOpacity onPress={() => router.back()}>
            <Image 
              source={images.arrowBack} 
              className="w-6 h-6" 
              resizeMode="contain" 
            />
          </TouchableOpacity>
          <Image 
            source={images.search} 
            className="w-6 h-6" 
            resizeMode="contain" 
          />
        </View>

        {/* Hero Image */}
        <View className="items-center px-5 mb-8">
          <Image 
            source={imageSource}
            className="w-80 h-80"
            resizeMode="contain"
          />
        </View>

        {/* Item Info */}
        <View className="px-5 mb-6">
          <Text className="text-2xl font-bold text-gray-800 mb-2">{item.name}</Text>
          <Text className="text-gray-500 text-base mb-4">{item.description || 'Delicious menu item'}</Text>
          
          {/* Rating */}
          <View className="flex-row items-center mb-4">
            {[1,2,3,4,5].map((star) => (
              <Image 
                key={star}
                source={images.star} 
                className="w-4 h-4 mr-1" 
                resizeMode="contain"
                tintColor={star <= (item.rating || 4.9) ? "#FF9C01" : "#E5E5E5"}
              />
            ))}
            <Text className="text-gray-600 ml-2">{item.rating || 4.9}/5</Text>
          </View>

          {/* Price */}
          <Text className="text-3xl font-bold text-gray-800 mb-6">${item.price.toFixed(2)}</Text>

          {/* Info Cards */}
          <View className="flex-row justify-between mb-8">
            <View className="bg-orange-50 px-4 py-3 rounded-lg flex-1 mr-2 items-center">
              <Image source={images.dollar} className="w-5 h-5 mb-1" tintColor="#FF9C01" />
              <Text className="text-xs text-gray-600">Free Delivery</Text>
            </View>
            <View className="bg-orange-50 px-4 py-3 rounded-lg flex-1 mx-2 items-center">
              <Image source={images.clock} className="w-5 h-5 mb-1" tintColor="#FF9C01" />
              <Text className="text-xs text-gray-600">20 - 30 mins</Text>
            </View>
            <View className="bg-orange-50 px-4 py-3 rounded-lg flex-1 ml-2 items-center">
              <Image source={images.star} className="w-5 h-5 mb-1" tintColor="#FF9C01" />
              <Text className="text-xs text-gray-600">4.5</Text>
            </View>
          </View>

          {/* Nutrition Info */}
          <View className="flex-row justify-between mb-8">
            <View>
              <Text className="text-gray-500 text-sm">Calories</Text>
              <Text className="text-gray-800 font-semibold">{item.calories || 365} Cal</Text>
            </View>
            <View>
              <Text className="text-gray-500 text-sm">Protein</Text>
              <Text className="text-gray-800 font-semibold">{item.protein || 35}g</Text>
            </View>
            <View>
              <Text className="text-gray-500 text-sm">Bun Type</Text>
              <Text className="text-gray-800 font-semibold">Whole Wheat</Text>
            </View>
          </View>

          {/* Description */}
          <Text className="text-gray-600 text-sm leading-6 mb-8">
            The {item.name} is a classic fast food item that packs a punch of flavor in every bite. 
            Made with premium ingredients and cooked to perfection, it's topped with fresh vegetables 
            and savory sauces that create the perfect combination.
          </Text>
        </View>

        {/* Toppings */}
        <View className="px-5 mb-8">
          <Text className="text-lg font-semibold text-gray-800 mb-4">Toppings</Text>
          <View className="flex-row flex-wrap">
            {toppings.slice(0, 4).map((topping) => {
              const isSelected = selectedToppings.includes(topping.name)
              return (
                <TouchableOpacity
                  key={topping.name}
                  onPress={() => toggleTopping(topping.name)}
                  className="mr-4 mb-4 items-center"
                >
                  <View className="w-16 h-16 bg-gray-100 rounded-lg items-center justify-center mb-2 relative">
                    <Image 
                      source={topping.image} 
                      className="w-10 h-10" 
                      resizeMode="contain" 
                    />
                    {isSelected && (
                      <View className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full items-center justify-center">
                        <Image source={images.plus} className="w-3 h-3" tintColor="white" />
                      </View>
                    )}
                  </View>
                  <Text className="text-xs text-gray-800 text-center">{topping.name}</Text>
                </TouchableOpacity>
              )
            })}
          </View>
        </View>

        {/* Side Options */}
        <View className="px-5 mb-8">
          <Text className="text-lg font-semibold text-gray-800 mb-4">Side options</Text>
          <View className="flex-row flex-wrap">
            {sides.slice(0, 4).map((side) => {
              const isSelected = selectedSides.includes(side.name)
              return (
                <TouchableOpacity
                  key={side.name}
                  onPress={() => toggleSide(side.name)}
                  className="mr-4 mb-4 items-center"
                >
                  <View className="w-16 h-16 bg-gray-100 rounded-lg items-center justify-center mb-2 relative">
                    <Image 
                      source={side.image} 
                      className="w-10 h-10" 
                      resizeMode="contain" 
                    />
                    {isSelected && (
                      <View className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full items-center justify-center">
                        <Image source={images.plus} className="w-3 h-3" tintColor="white" />
                      </View>
                    )}
                  </View>
                  <Text className="text-xs text-gray-800 text-center">{side.name}</Text>
                </TouchableOpacity>
              )
            })}
          </View>
        </View>

        {/* Bottom Section */}
        <View className="px-5 pb-8">
          <View className="flex-row items-center justify-between mb-6">
            {/* Quantity Controls */}
            <View className="flex-row items-center">
              <TouchableOpacity 
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 bg-gray-100 rounded-lg items-center justify-center"
              >
                <Image source={images.minus} className="w-4 h-4" />
              </TouchableOpacity>
              <Text className="text-xl font-semibold text-gray-800 mx-6">{quantity}</Text>
              <TouchableOpacity 
                onPress={() => setQuantity(quantity + 1)}
                className="w-10 h-10 bg-gray-100 rounded-lg items-center justify-center"
              >
                <Image source={images.plus} className="w-4 h-4" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Add to Cart Button */}
          <CustomButton
            title={`Add to cart ($${calculateTotalPrice().toFixed(2)})`}
            onPress={handleAddToCart}
            style="bg-orange-500"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default MenuItemDetail
