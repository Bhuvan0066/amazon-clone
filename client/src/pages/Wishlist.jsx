import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ProductCard from "../components/ProductCard";
import { Heart } from "lucide-react";

function Wishlist() {
  const { user } = useAuth();
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    const fetchWishlist = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } };
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/wishlist`, config);
        setWishlistProducts(data);
      } catch (error) {
        console.error("Error fetching wishlist");
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, [user]);

  if (!user) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <h2 className="text-2xl font-bold mb-4">Please sign in to view your Wishlist</h2>
      <Link to="/login" className="bg-[#FFD814] px-8 py-2 rounded-full border border-[#FCD200]">Sign In</Link>
    </div>
  );

  return (
    <div className="bg-gray-100 min-h-screen py-6 px-4 md:px-8 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2"><Heart className="text-[#C7511F]" fill="#C7511F" /> Your Wishlist</h1>
      {loading ? (
        <div className="flex justify-center p-20"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C7511F]" /></div>
      ) : wishlistProducts.length === 0 ? (
        <div className="bg-white p-10 rounded-lg text-center shadow-sm">
          <Heart size={64} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-bold mb-2">Your Wishlist is empty</h2>
          <Link to="/" className="text-[#007185] hover:underline hover:text-[#C7511F]">Continue shopping</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {wishlistProducts.map(product => <ProductCard key={product._id} product={product} />)}
        </div>
      )}
    </div>
  );
}

export default Wishlist;
