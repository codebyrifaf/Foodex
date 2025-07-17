import { getCategories, getMenu } from '@/lib/appwrite';
import seed from '@/lib/seed'
import useAppwrite from '@/lib/useAppwrite';
import { useLocalSearchParams } from 'expo-router';
import { use } from 'react';
import { View, Text, Button } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const Search = () => {

  const params = useLocalSearchParams<{query?: string; category?: string}>();

  const {data, refetch, loading}= useAppwrite({
    fn: getMenu,
    params:{
      category:'',
      query: '',
      limit:6,
    }
  });

  const {data: categories} = useAppwrite({ fn: getCategories });



console.log(data);

  return (
    <SafeAreaView>
      <Text>Search</Text>

      
    </SafeAreaView>
  )
}

export default Search