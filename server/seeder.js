const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./models/product");

dotenv.config();

mongoose.connect(process.env.MONGO_URI);

const products = [
  {
    title: "Apple iPhone 15 Pro Max (256 GB) - Natural Titanium",
    price: 159900,
    image: "https://m.media-amazon.com/images/I/81Os1SDWpcL._AC_UY327_FMwebp_QL65_.jpg",
    images: ["https://m.media-amazon.com/images/I/81Os1SDWpcL._AC_UY327_FMwebp_QL65_.jpg"],
    description: "Forged in titanium and featuring the groundbreaking A17 Pro chip, a customizable Action button, and the most powerful iPhone camera system ever.",
    category: "Electronics",
    stock: 25,
    location: "India",
    locationCode: "IN",
    badges: ["Best Seller"],
    ratings: 4.8,
    numReviews: 1250,
  },
  {
    title: "Sony WH-1000XM5 Wireless Active Noise Cancelling Headphones",
    price: 29990,
    image: "https://m.media-amazon.com/images/I/51aXvjzcukL._AC_UY327_FMwebp_QL65_.jpg",
    images: ["https://m.media-amazon.com/images/I/51aXvjzcukL._AC_UY327_FMwebp_QL65_.jpg"],
    description: "Industry Leading Noise Cancellation.",
    category: "Electronics",
    stock: 50,
    location: "India",
    locationCode: "IN",
    badges: ["Amazon's Choice"],
    ratings: 4.6,
    numReviews: 4320,
  },
  {
    title: "Levi's Men's 511 Slim Fit Jeans",
    price: 1899,
    image: "https://m.media-amazon.com/images/I/81h8f57+xTL._AC_UL480_FMwebp_QL65_.jpg",
    images: ["https://m.media-amazon.com/images/I/81h8f57+xTL._AC_UL480_FMwebp_QL65_.jpg"],
    description: "A modern slim with room to move.",
    category: "Fashion",
    stock: 100,
    location: "India",
    locationCode: "IN",
    badges: [],
    ratings: 4.2,
    numReviews: 540,
  },
  {
    title: "Wakefit Orthopedic Memory Foam Mattress",
    price: 12599,
    image: "https://m.media-amazon.com/images/I/61S-r5OtsVL._AC_UL480_FMwebp_QL65_.jpg",
    images: ["https://m.media-amazon.com/images/I/61S-r5OtsVL._AC_UL480_FMwebp_QL65_.jpg"],
    description: "High-quality memory foam mattress.",
    category: "Home & Living",
    stock: 15,
    location: "India",
    locationCode: "IN",
    badges: ["Best Seller"],
    ratings: 4.4,
    numReviews: 8750,
  }
];

const importData = async () => {
  try {
    await Product.insertMany(products);
    console.log("Amazon.in Mock Data Imported Successfully!");
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

importData();

