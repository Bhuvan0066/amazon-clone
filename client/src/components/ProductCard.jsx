import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { Star, Heart } from "lucide-react";
import axios from "axios";

function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(false);

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

  const rating = product.ratings || 4;
  const reviewsCount = product.numReviews || 150;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -5 }}
      className="border border-gray-200 rounded-lg p-4 bg-white flex flex-col h-full relative group"
    >
      <button onClick={handleLikeToggle} className="absolute top-3 right-3 z-20 p-2 bg-white rounded-full shadow-sm hover:bg-gray-100 transition-colors">
        <Heart size={20} fill={isLiked ? "#C7511F" : "none"} color={isLiked ? "#C7511F" : "gray"} />
      </button>

      {product.badges && product.badges.length > 0 && (
        <span className="absolute top-2 left-0 bg-[#C7511F] text-white text-xs px-2 py-1 z-10 font-bold">
          {product.badges[0]}
        </span>
      )}

      <Link to={`/product/${product._id}`} className="flex-grow flex flex-col">
        <div className="h-48 overflow-hidden flex items-center justify-center p-2 mb-4">
          <motion.img whileHover={{ scale: 1.05 }} src={product.image} alt={product.title} className="max-h-full max-w-full object-contain" />
        </div>

        <h2 className="mt-2 text-sm font-medium line-clamp-2 text-[#007185] group-hover:text-[#C7511F]">{product.title}</h2>

        <div className="flex items-center mt-1 mb-1">
          <div className="flex text-[#FFA41C]">
            {[...Array(5)].map((_, i) => <Star key={i} size={14} fill={i < rating ? "currentColor" : "none"} className={i < rating ? "text-[#FFA41C]" : "text-gray-300"} />)}
          </div>
          <span className="text-[#007185] text-xs ml-2 hover:underline">{reviewsCount}</span>
        </div>

        <div className="flex items-baseline mt-auto">
          <span className="text-xs align-top relative top-[-4px]">?</span>
          <span className="text-xl md:text-2xl font-bold">{Math.floor(product.price)}</span>
          <span className="text-xs align-top relative top-[-4px]">{((product.price % 1) * 100).toFixed(0).padStart(2, '0')}</span>
        </div>
        
        {product.location && (
          <p className="text-xs text-gray-500 mt-1">Ships from {product.location} ({product.locationCode})</p>
        )}

        <p className="text-xs mt-1 font-bold text-[#007600]">In stock</p>
      </Link>

      <button onClick={handleAddToCart} className="w-full py-2 mt-4 rounded-full text-sm shadow-sm bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200]">
        Add to Cart
      </button>
    </motion.div>
  );
}

export default ProductCard;
