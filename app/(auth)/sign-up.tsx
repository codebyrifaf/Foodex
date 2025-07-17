import { View, Text, Button } from 'react-native'
import React from 'react'
import { router } from "expo-router";   

const signUp = () => {
  return (
    <View>
      <Text>Sign Up</Text>
      <Button title="Sign Up" onPress={() => router.push("/sign-in")} />
    </View>
  )
}

export default signUp