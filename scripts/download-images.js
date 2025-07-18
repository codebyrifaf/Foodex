const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

// Dummy data directly embedded (since importing TS might be tricky)
const dummyData = {
    menu: [
        {
            name: "Classic Cheeseburger",
            image_url: "https://static.vecteezy.com/system/resources/previews/044/844/600/large_2x/homemade-fresh-tasty-burger-with-meat-and-cheese-classic-cheese-burger-and-vegetable-ai-generated-free-png.png",
        },
        {
            name: "Pepperoni Pizza",
            image_url: "https://static.vecteezy.com/system/resources/previews/023/742/417/large_2x/pepperoni-pizza-isolated-illustration-ai-generative-free-png.png",
        },
        {
            name: "Bean Burrito",
            image_url: "https://static.vecteezy.com/system/resources/previews/055/133/581/large_2x/deliciously-grilled-burritos-filled-with-beans-corn-and-fresh-vegetables-served-with-lime-wedge-and-cilantro-isolated-on-transparent-background-free-png.png",
        },
        {
            name: "BBQ Bacon Burger",
            image_url: "https://static.vecteezy.com/system/resources/previews/060/236/245/large_2x/a-large-hamburger-with-cheese-onions-and-lettuce-free-png.png",
        },
        {
            name: "Chicken Caesar Wrap",
            image_url: "https://static.vecteezy.com/system/resources/previews/048/930/603/large_2x/caesar-wrap-grilled-chicken-isolated-on-transparent-background-free-png.png",
        },
        {
            name: "Grilled Veggie Sandwich",
            image_url: "https://static.vecteezy.com/system/resources/previews/047/832/012/large_2x/grilled-sesame-seed-bread-veggie-sandwich-with-tomato-and-onion-free-png.png",
        },
        {
            name: "Double Patty Burger",
            image_url: "https://static.vecteezy.com/system/resources/previews/060/359/627/large_2x/double-cheeseburger-with-lettuce-tomatoes-cheese-and-sesame-bun-free-png.png",
        },
        {
            name: "Paneer Tikka Wrap",
            image_url: "https://static.vecteezy.com/system/resources/previews/057/913/530/large_2x/delicious-wraps-a-tantalizing-array-of-wraps-filled-with-vibrant-vegetables-succulent-fillings-and-fresh-ingredients-artfully-arranged-for-a-mouthwatering-culinary-experience-free-png.png",
        },
        {
            name: "Mexican Burrito Bowl",
            image_url: "https://static.vecteezy.com/system/resources/previews/057/466/374/large_2x/healthy-quinoa-bowl-with-avocado-tomato-and-black-beans-ingredients-free-png.png",
        },
        {
            name: "Spicy Chicken Sandwich",
            image_url: "https://static.vecteezy.com/system/resources/previews/051/814/008/large_2x/a-grilled-chicken-sandwich-with-lettuce-and-tomatoes-free-png.png",
        },
        {
            name: "Classic Margherita Pizza",
            image_url: "https://static.vecteezy.com/system/resources/previews/058/700/845/large_2x/free-isolated-on-transparent-background-delicious-pizza-topped-with-fresh-tomatoes-basil-and-melted-cheese-perfect-for-food-free-png.png",
        },
        {
            name: "Protein Power Bowl",
            image_url: "https://static.vecteezy.com/system/resources/previews/056/106/379/large_2x/top-view-salad-with-chicken-avocado-tomatoes-and-lettuce-free-png.png",
        },
        {
            name: "Paneer Burrito",
            image_url: "https://static.vecteezy.com/system/resources/previews/056/565/254/large_2x/burrito-with-cauliflower-and-vegetables-free-png.png",
        },
        {
            name: "Chicken Club Sandwich",
            image_url: "https://static.vecteezy.com/system/resources/previews/060/364/135/large_2x/a-flavorful-club-sandwich-with-turkey-bacon-and-fresh-vegetables-sliced-and-isolated-on-a-transparent-background-free-png.png",
        }
    ]
};

const assetsDir = path.join(__dirname, '..', 'assets', 'images');

// Ensure assets/images directory exists
if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
}

function downloadImage(url, filename) {
    return new Promise((resolve, reject) => {
        const parsedUrl = new URL(url);
        const client = parsedUrl.protocol === 'https:' ? https : http;
        
        const filePath = path.join(assetsDir, filename);
        
        console.log(`Downloading: ${filename}`);
        
        client.get(url, (response) => {
            if (response.statusCode === 200) {
                const file = fs.createWriteStream(filePath);
                response.pipe(file);
                
                file.on('finish', () => {
                    file.close();
                    console.log(`✅ Downloaded: ${filename}`);
                    resolve(filename);
                });
                
                file.on('error', (err) => {
                    fs.unlink(filePath, () => {}); // Delete partial file
                    reject(err);
                });
            } else {
                reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
            }
        }).on('error', reject);
    });
}

async function downloadAllImages() {
    const imagePromises = [];
    
    dummyData.menu.forEach((item, index) => {
        if (item.image_url && item.image_url.startsWith('http')) {
            // Create a clean filename from the item name
            const cleanName = item.name
                .toLowerCase()
                .replace(/[^a-z0-9\s]/g, '')
                .replace(/\s+/g, '-');
            
            const filename = `${cleanName}.png`;
            imagePromises.push(downloadImage(item.image_url, filename));
        }
    });
    
    try {
        await Promise.all(imagePromises);
        console.log('🎉 All images downloaded successfully!');
        
        // Generate the updated data file
        generateUpdatedDataFile();
    } catch (error) {
        console.error('❌ Error downloading images:', error);
    }
}

function generateUpdatedDataFile() {
    const updatedMenu = dummyData.menu.map((item) => {
        if (item.image_url && item.image_url.startsWith('http')) {
            const cleanName = item.name
                .toLowerCase()
                .replace(/[^a-z0-9\s]/g, '')
                .replace(/\s+/g, '-');
            
            return {
                ...item,
                image_url: `@/assets/images/${cleanName}.png`
            };
        }
        return item;
    });
    
    const updatedData = {
        ...dummyData,
        menu: updatedMenu
    };
    
    const dataContent = `const dummyData = ${JSON.stringify(updatedData, null, 4)};

export default dummyData;`;
    
    fs.writeFileSync(path.join(__dirname, '..', 'lib', 'data-updated.ts'), dataContent);
    console.log('📝 Generated updated data file: lib/data-updated.ts');
    console.log('💡 Review the file and replace your original data.ts when ready!');
}

// Run the download
console.log('🚀 Starting image download process...');
console.log(`📁 Target directory: ${assetsDir}`);
console.log(`📋 Found ${dummyData.menu.length} menu items to process`);

downloadAllImages().catch(console.error);
