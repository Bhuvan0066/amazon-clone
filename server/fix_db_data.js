const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config({ path: './.env' });
mongoose.connect(process.env.MONGO_URI);

const imageMap = {
  'iphone': 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&q=80&w=800',
  'headphones': 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=800',
  'jeans': 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=800',
  'mattress': 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80&w=800',
  'macbook': 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800',
  'laptop': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=800',
  'chopper': 'https://images.unsplash.com/photo-1585237731778-b118b6fc8e03?auto=format&fit=crop&q=80&w=800',
  'polo': 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&q=80&w=800',
  'strix': 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=80&w=800'
};

const run = async () => {
  try {
    const products = await Product.find({});
    for (let product of products) {
      let title = product.title.toLowerCase();
      let newImage = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800'; // default product
      
      for (const [key, url] of Object.entries(imageMap)) {
        if (title.includes(key)) {
          newImage = url;
          break;
        }
      }
      
      product.image = newImage;
      product.images = [newImage];
      
      if (product.description && product.description.includes('modern design fits any decor') && product.title.includes('Solly')) {
         product.description = "A classic and comfortable polo t-shirt for everyday wear.";
      }

      await product.save();
    }
    console.log('Successfully updated all products.');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run();
