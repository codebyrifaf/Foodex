import { CreateUserParams, GetMenuParams, SignInParams } from "@/type";
import { Account, Avatars, Client, Databases, ID, Query, Storage } from "react-native-appwrite";



export const appwriteConfig = {
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
  platform: "com.rifaf.foodex",
  databaseId: '6878c419000ac2470ac8',
  bucketId: '6879508f001ff0388625',
  userCollectionId: '6878c45f003a0c22b3c7',
  categoriesCollectionId: '687949e6000ee868f9b3',
  menuCollectionId: '68794ad1002011676c31',
  customizationsCollectionId: '68794e49002ba799c5e0',
  menuCustomizationsCollectionId: '68794fa800086d9aa3de',
}


export const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint!)
  .setProject(appwriteConfig.projectId!)
  .setPlatform(appwriteConfig.platform);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
const avatars = new Avatars(client);

export const createUser = async ({ email, password, name, phone, address }: CreateUserParams) => {
  try {
    const newAccount = await account.create(ID.unique(), email, password, name);
    if (!newAccount) throw Error;

    await signIn({ email, password });
    const avatarUrl = avatars.getInitialsURL(name);

    return await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      { email, name, phone, address, accountId: newAccount.$id, avatar: avatarUrl }
    );


  } catch (e) {
    throw new Error(e as string);
  }
}

export const signIn = async ({ email, password }: SignInParams) => {
  try {
    // Check if there's already an active session
    try {
      const currentSession = await account.get();
      if (currentSession) {
        // If there's already a session, delete it first
        await account.deleteSession('current');
      }
    } catch (error) {
      // No active session, which is fine
    }

    const session = await account.createEmailPasswordSession(email, password);
    return session;
  } catch (e) {
    throw new Error(e as string);
  }
}

export const signOut = async () => {
  try {
    await account.deleteSession('current');
  } catch (e) {
    throw new Error(e as string);
  }
}

export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();
    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal('accountId', currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (e) {
    console.log(e);
    throw new Error(e as string);
  }
};

// Map menu item names to local image keys
const getLocalImageKey = (itemName: string): string => {
  const imageMap: { [key: string]: string } = {
    'Classic Cheeseburger': 'classicCheeseburger',
    'Pepperoni Pizza': 'pepperoniPizza',
    'Bean Burrito': 'beanBurrito',
    'BBQ Bacon Burger': 'bbqBaconBurger',
    'Chicken Caesar Wrap': 'chickenCaesarWrap',
    'Grilled Veggie Sandwich': 'grilledVeggieSandwich',
    'Double Patty Burger': 'doublePattyBurger',
    'Paneer Tikka Wrap': 'paneerTikkaWrap',
    'Mexican Burrito Bowl': 'mexicanBurritoBowl',
    'Spicy Chicken Sandwich': 'spicyChickenSandwich',
    'Classic Margherita Pizza': 'classicMargheritaPizza',
    'Protein Power Bowl': 'proteinPowerBowl',
    'Paneer Burrito': 'paneerBurrito',
    'Chicken Club Sandwich': 'chickenClubSandwich',
  };
  
  return imageMap[itemName] || 'logo'; // fallback to logo if not found
};

export const getMenu = async ({ category, query }: GetMenuParams) => {
  try {
    const queries: string[] = [];

    if(category) queries.push(Query.equal('categories', category ));
    if(query) queries.push(Query.search('name', query ));

    const menus = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.menuCollectionId,
      queries
    );

    // If database is empty, return dummy data for testing
    if (menus.documents.length === 0) {
      const dummyData = require('./data').default;
      let filteredMenu: any[] = dummyData.menu;
      
      // Apply category filter
      if (category && category !== 'all') {
        filteredMenu = filteredMenu.filter((item: any) => 
          item.category_name.toLowerCase() === category.toLowerCase()
        );
      }
      
      // Apply search query
      if (query) {
        filteredMenu = filteredMenu.filter((item: any) =>
          item.name.toLowerCase().includes(query.toLowerCase())
        );
      }
      
      // Add required $id field for dummy data
      return filteredMenu.map((item: any, index: number) => ({
        ...item,
        $id: `dummy-${index}`,
      }));
    }

    // Hybrid approach: Use database data but map to local images
    return menus.documents.map((item: any) => ({
      ...item,
      image_url: getLocalImageKey(item.name), // Replace database image URL with local key
    }));
    
  } catch (e) {
    throw new Error(e as string);
  }
}

export const getCategories = async () => {
  try {
    const categories = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.categoriesCollectionId
    );

    // If database is empty, return dummy categories
    if (categories.documents.length === 0) {
      const dummyData = require('./data').default;
      return dummyData.categories.map((category: any, index: number) => ({
        ...category,
        $id: `category-${index}`,
      }));
    }

    return categories.documents;
  } catch (e) {
    throw new Error(e as string);
  }
}
