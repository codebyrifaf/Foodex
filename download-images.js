const https = require('https');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting image download...');

const images = [
    { name: 'classic-cheeseburger', url: 'https://static.vecteezy.com/system/resources/previews/044/844/600/large_2x/homemade-fresh-tasty-burger-with-meat-and-cheese-classic-cheese-burger-and-vegetable-ai-generated-free-png.png' },
    { name: 'pepperoni-pizza', url: 'https://static.vecteezy.com/system/resources/previews/023/742/417/large_2x/pepperoni-pizza-isolated-illustration-ai-generative-free-png.png' },
    { name: 'bean-burrito', url: 'https://static.vecteezy.com/system/resources/previews/055/133/581/large_2x/deliciously-grilled-burritos-filled-with-beans-corn-and-fresh-vegetables-served-with-lime-wedge-and-cilantro-isolated-on-transparent-background-free-png.png' },
    { name: 'bbq-bacon-burger', url: 'https://static.vecteezy.com/system/resources/previews/060/236/245/large_2x/a-large-hamburger-with-cheese-onions-and-lettuce-free-png.png' },
    { name: 'chicken-caesar-wrap', url: 'https://static.vecteezy.com/system/resources/previews/048/930/603/large_2x/caesar-wrap-grilled-chicken-isolated-on-transparent-background-free-png.png' },
    { name: 'grilled-veggie-sandwich', url: 'https://static.vecteezy.com/system/resources/previews/047/832/012/large_2x/grilled-sesame-seed-bread-veggie-sandwich-with-tomato-and-onion-free-png.png' },
    { name: 'double-patty-burger', url: 'https://static.vecteezy.com/system/resources/previews/060/359/627/large_2x/double-cheeseburger-with-lettuce-tomatoes-cheese-and-sesame-bun-free-png.png' },
    { name: 'paneer-tikka-wrap', url: 'https://static.vecteezy.com/system/resources/previews/057/913/530/large_2x/delicious-wraps-a-tantalizing-array-of-wraps-filled-with-vibrant-vegetables-succulent-fillings-and-fresh-ingredients-artfully-arranged-for-a-mouthwatering-culinary-experience-free-png.png' },
    { name: 'mexican-burrito-bowl', url: 'https://static.vecteezy.com/system/resources/previews/057/466/374/large_2x/healthy-quinoa-bowl-with-avocado-tomato-and-black-beans-ingredients-free-png.png' },
    { name: 'spicy-chicken-sandwich', url: 'https://static.vecteezy.com/system/resources/previews/051/814/008/large_2x/a-grilled-chicken-sandwich-with-lettuce-and-tomatoes-free-png.png' },
    { name: 'classic-margherita-pizza', url: 'https://static.vecteezy.com/system/resources/previews/058/700/845/large_2x/free-isolated-on-transparent-background-delicious-pizza-topped-with-fresh-tomatoes-basil-and-melted-cheese-perfect-for-food-free-png.png' },
    { name: 'protein-power-bowl', url: 'https://static.vecteezy.com/system/resources/previews/056/106/379/large_2x/top-view-salad-with-chicken-avocado-tomatoes-and-lettuce-free-png.png' },
    { name: 'paneer-burrito', url: 'https://static.vecteezy.com/system/resources/previews/056/565/254/large_2x/burrito-with-cauliflower-and-vegetables-free-png.png' },
    { name: 'chicken-club-sandwich', url: 'https://static.vecteezy.com/system/resources/previews/060/364/135/large_2x/a-flavorful-club-sandwich-with-turkey-bacon-and-fresh-vegetables-sliced-and-isolated-on-a-transparent-background-free-png.png' }
];

function downloadImage(imageData) {
    return new Promise((resolve, reject) => {
        const filePath = path.join('assets', 'images', `${imageData.name}.png`);
        
        console.log(`📥 Downloading: ${imageData.name}.png`);
        
        https.get(imageData.url, (response) => {
            if (response.statusCode === 200) {
                const file = fs.createWriteStream(filePath);
                response.pipe(file);
                
                file.on('finish', () => {
                    file.close();
                    console.log(`✅ Downloaded: ${imageData.name}.png`);
                    resolve();
                });
            } else {
                reject(new Error(`Failed: ${response.statusCode}`));
            }
        }).on('error', reject);
    });
}

async function downloadAll() {
    for (const image of images) {
        try {
            await downloadImage(image);
            await new Promise(resolve => setTimeout(resolve, 500)); // Small delay
        } catch (error) {
            console.error(`❌ Failed to download ${image.name}:`, error.message);
        }
    }
    console.log('🎉 All downloads completed!');
}

downloadAll();
