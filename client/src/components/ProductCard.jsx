import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { Star, Heart, ShoppingBag } from "lucide-react";
import axios from "axios";

function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (user && user.wishlist) {
      setIsLiked(user.wishlist.includes(product._id));
    }
  }, [user, product._id]);

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
    toast.success(`${product.title} added to cart!`);
  };

  const handleLikeToggle = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.info("Please sign in to add to wishlist.");
      return;
    }
    setIsLiked(!isLiked);
    try {
      const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
      await axios.post(`${import.meta.env.VITE_API_URL}/api/users/wishlist`, { productId: product._id }, config);
      toast.success(!isLiked ? "Added to Wishlist" : "Removed from Wishlist");
    } catch (error) {
      setIsLiked(isLiked);
      toast.error("Failed to update wishlist.");
    }
  };

  const rating = product.ratings || 4.5;
  const reviewsCount = product.numReviews || Math.floor(Math.random() * 500) + 10;
  
  // Create a realistic price display
  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(product.price);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      whileHover={{ y: -6, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
      transition={{ duration: 0.2 }}
      className="group relative flex flex-col h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden transition-all duration-300"
    >
      {/* Badges & Wishlist */}
      <div className="absolute top-3 w-full px-3 flex justify-between items-start z-10">
        <div className="flex flex-col gap-1">
          {product.badges && product.badges.length > 0 ? (
            <span className="bg-primary-500 text-white text-[10px] uppercase font-bold px-2 py-1 rounded-sm tracking-wider shadow-sm">
              {product.badges[0]}
            </span>
          ) : (
            product.stock < 5 && (
              <span className="bg-red-500 text-white text-[10px] uppercase font-bold px-2 py-1 rounded-sm tracking-wider shadow-sm">
                Only {product.stock} left
              </span>
            )
          )}
        </div>
        
        <button 
          onClick={handleLikeToggle} 
          className="p-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full shadow-sm hover:scale-110 transition-transform"
          aria-label="Add to wishlist"
        >
          <Heart 
            size={18} 
            className={`transition-colors ${isLiked ? "fill-red-500 text-red-500" : "text-slate-400 dark:text-slate-300"}`} 
          />
        </button>
      </div>

      <Link to={`/product/${product._id}`} className="flex-grow flex flex-col pt-4">
        {/* Image Container with Skeleton */}
        <div className="relative h-56 w-full flex items-center justify-center p-6 mb-2 overflow-hidden bg-white dark:bg-slate-900">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-t-2xl" />
          )}
          <motion.img 
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.4 }}
            src={product.image} 
            alt={product.title} 
            onLoad={() => setImageLoaded(true)}
            className={`max-h-full max-w-full object-contain transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`} 
          />
        </div>

        {/* Content */}
        <div className="px-5 pb-5 flex flex-col flex-grow">
          {/* Category */}
          <span className="text-xs font-semibold tracking-wider text-slate-400 dark:text-slate-500 uppercase mb-1">
            {product.category}
          </span>
          
          {/* Title */}
          <h2 className="text-sm md:text-base font-semibold leading-tight line-clamp-2 text-slate-800 dark:text-slate-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            {product.title}
          </h2>

          {/* Ratings */}
          <div className="flex items-center mt-2 mb-3">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  size={14} 
                  fill={i < Math.floor(rating) ? "currentColor" : "none"} 
                  className={i < Math.floor(rating) ? "" : "text-slate-300 dark:text-slate-600"} 
                />
              ))}
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 ml-2 font-medium hover:underline cursor-pointer">
              ({reviewsCount})
            </span>
          </div>

          <div className="mt-auto">
            {/* Price */}
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-xl md:text-2xl font-bold font-heading text-slate-900 dark:text-white">
                {formattedPrice}
              </span>
              {/* Optional: Add an MRP strikethrough if you have an original price field */}
              <span className="text-sm text-slate-400 line-through">
                {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(product.price * 1.2)}
              </span>
            </div>

            {/* Add to Cart Button */}
            <button 
              onClick={handleAddToCart} 
              className="w-full flex items-center justify-center gap-2 py-2.5 mt-auto rounded-xl text-sm font-semibold text-white bg-slate-900 hover:bg-primary-600 dark:bg-primary-600 dark:hover:bg-primary-500 shadow-md hover:shadow-lg transition-all duration-300 transform active:scale-95"
            >
              <ShoppingBag size={16} />
              Add to Cart
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default ProductCard;

