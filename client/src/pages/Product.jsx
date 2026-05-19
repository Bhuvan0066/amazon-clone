import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { Star, ShieldCheck, Truck, RotateCcw, Lock } from "lucide-react";
import { toast } from "react-toastify";

function Product() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState("");
  const [qty, setQty] = useState(1);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  
  const { addToCart } = useCart();
  const { user } = useAuth();

  // Fetch Single Product
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/products/${id}`
        );
        setProduct(response.data);
        setActiveImage(response.data.image || (response.data.images && response.data.images[0]) || "");
      } catch (error) {
        toast.error("Failed to load product details");
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    for(let i=0; i<qty; i++) {
       addToCart(product);
    }
    toast.success(`${qty}x ${product.title} added to cart!`);
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to submit a review");
      return;
    }
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/products/${id}/reviews`,
        { rating: reviewRating, comment: reviewComment },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      toast.success("Review submitted successfully");
      setReviewComment("");
      // refetch to show new review
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/products/${id}`);
      setProduct(response.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit review");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  if (!product) {
    return <h1 className="text-2xl text-center mt-20">Product not found.</h1>;
  }

  const allImages = [product.image, ...(product.images || [])].filter(Boolean);

  return (
    <div className="bg-white min-h-screen py-6 px-4 md:px-8 max-w-[1500px] mx-auto">
      
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Left Column - Images */}
        <div className="w-full lg:w-5/12 flex flex-col md:flex-row gap-4 sticky top-28 self-start">
          {/* Thumbnails */}
          <div className="hidden md:flex flex-col gap-2 w-16">
            {allImages.map((img, idx) => (
              <div 
                key={idx} 
                onMouseEnter={() => setActiveImage(img)}
                className={`border-2 rounded overflow-hidden cursor-pointer ${activeImage === img ? 'border-[#e77600] shadow-sm' : 'border-gray-200'}`}
              >
                <img src={img} alt="" className="w-full h-auto object-contain" />
              </div>
            ))}
          </div>
          
          {/* Main Image */}
          <div className="flex-1 border rounded-lg p-4 flex items-center justify-center relative group overflow-hidden">
            <img
              src={activeImage}
              alt={product.title}
              className="max-w-full max-h-[500px] object-contain transition-transform duration-300 group-hover:scale-150 origin-center"
            />
          </div>
          
          {/* Mobile Thumbnails */}
          <div className="flex md:hidden gap-2 overflow-x-auto pb-2">
            {allImages.map((img, idx) => (
              <div 
                key={idx} 
                onClick={() => setActiveImage(img)}
                className={`flex-shrink-0 w-16 border-2 rounded overflow-hidden cursor-pointer ${activeImage === img ? 'border-[#e77600]' : 'border-gray-200'}`}
              >
                <img src={img} alt="" className="w-full h-auto object-contain" />
              </div>
            ))}
          </div>
        </div>

        {/* Middle Column - Details */}
        <div className="w-full lg:w-4/12 flex flex-col">
          <h1 className="text-xl md:text-2xl font-medium leading-tight">
            {product.title}
          </h1>
          
          <div className="flex items-center mt-2 pb-2 border-b">
            <div className="flex text-[#FFA41C]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={18} fill={i < Math.floor(product.ratings || 4) ? "currentColor" : "none"} className={i < Math.floor(product.ratings || 4) ? "text-[#FFA41C]" : "text-gray-300"} />
              ))}
            </div>
            <span className="text-[#007185] ml-2 hover:underline cursor-pointer">{product.numReviews || 0} ratings</span>
          </div>

          <div className="mt-3">
            <span className="text-2xl align-top relative top-[-6px] mr-1">₹</span>
            <span className="text-4xl font-medium">{Math.floor(product.price)}</span>
            <span className="text-lg align-top relative top-[-6px]">
              {((product.price % 1) * 100).toFixed(0).padStart(2, '0')}
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-4">Inclusive of all taxes</p>

          <div className="border-t border-b py-4 my-2 flex justify-between text-center px-4">
            <div className="flex flex-col items-center gap-1 w-1/4">
              <div className="bg-gray-100 p-2 rounded-full"><RotateCcw size={24} className="text-[#007185]" /></div>
              <span className="text-xs text-[#007185]">10 days Return & Exchange</span>
            </div>
            <div className="flex flex-col items-center gap-1 w-1/4">
              <div className="bg-gray-100 p-2 rounded-full"><Truck size={24} className="text-[#007185]" /></div>
              <span className="text-xs text-[#007185]">Amazon Delivered</span>
            </div>
            <div className="flex flex-col items-center gap-1 w-1/4">
              <div className="bg-gray-100 p-2 rounded-full"><ShieldCheck size={24} className="text-[#007185]" /></div>
              <span className="text-xs text-[#007185]">1 Year Warranty</span>
            </div>
            <div className="flex flex-col items-center gap-1 w-1/4">
              <div className="bg-gray-100 p-2 rounded-full"><Lock size={24} className="text-[#007185]" /></div>
              <span className="text-xs text-[#007185]">Secure transaction</span>
            </div>
          </div>

          <div className="mt-4">
            <h3 className="font-bold text-lg mb-2">About this item</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>{product.description}</li>
              <li>High quality materials ensuring durability</li>
              <li>Sleek and modern design fits any decor</li>
              <li>Category: {product.category}</li>
            </ul>
          </div>
        </div>

        {/* Right Column - Buy Box */}
        <div className="w-full lg:w-3/12">
          <div className="border border-gray-200 rounded-lg p-5 flex flex-col gap-4 shadow-sm sticky top-28">
            <div className="text-2xl font-bold">₹{product.price.toFixed(2)}</div>
            
            <div className="text-sm">
              <span className="text-[#007185] hover:underline">FREE delivery</span> <span className="font-bold">Wednesday, {new Date(Date.now() + 86400000 * 3).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}</span> on orders dispatched by Amazon over ₹499.
            </div>

            <div className="text-xl text-[#007600] font-medium mt-2">
              {product.stock > 0 ? "In stock" : "Out of stock"}
            </div>

            {product.stock > 0 && (
              <>
                <div className="flex items-center gap-2">
                  <span className="text-sm">Quantity:</span>
                  <select 
                    className="border rounded-md px-2 py-1 bg-gray-100 shadow-sm"
                    value={qty}
                    onChange={(e) => setQty(Number(e.target.value))}
                  >
                    {[...Array(Math.min(product.stock, 10))].map((_, i) => (
                      <option key={i+1} value={i+1}>{i+1}</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="bg-[#FFD814] hover:bg-[#F7CA00] w-full py-2 rounded-full shadow-sm font-medium mt-2 transition-colors border border-[#FCD200]"
                >
                  Add to Cart
                </button>
                <button
                  onClick={handleAddToCart}
                  className="bg-[#FFA41C] hover:bg-[#FA8900] w-full py-2 rounded-full shadow-sm font-medium mt-2 transition-colors border border-[#FF8F00]"
                >
                  Buy Now
                </button>
              </>
            )}

            <div className="flex items-center gap-2 text-sm text-[#007185] mt-2 cursor-pointer hover:underline">
              <Lock size={16} className="text-gray-500" />
              Secure transaction
            </div>
            
            <div className="text-xs text-gray-500 mt-2 flex flex-col gap-1">
              <div className="flex justify-between"><span className="w-24">Ships from</span> <span>Amazon</span></div>
              <div className="flex justify-between"><span className="w-24">Sold by</span> <span>G.C. Retail</span></div>
            </div>

            <hr className="my-2" />
            <button className="w-full text-left text-sm border rounded-md shadow-sm bg-gray-50 hover:bg-gray-100 py-1.5 px-3">
              Add to Wish List
            </button>
          </div>
        </div>
      </div>

      <hr className="my-10" />

      {/* Reviews Section */}
      <div className="max-w-4xl">
        <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
        
        {user ? (
          <form onSubmit={submitReview} className="mb-8 bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h3 className="font-bold text-lg mb-4">Write a product review</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Rating</label>
              <select 
                value={reviewRating} 
                onChange={(e) => setReviewRating(e.target.value)}
                className="w-full md:w-48 border rounded px-3 py-2"
              >
                <option value="5">5 - Excellent</option>
                <option value="4">4 - Very Good</option>
                <option value="3">3 - Good</option>
                <option value="2">2 - Fair</option>
                <option value="1">1 - Poor</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Review</label>
              <textarea 
                required
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                className="w-full border rounded px-3 py-2 min-h-[100px]"
                placeholder="What did you like or dislike?"
              ></textarea>
            </div>
            <button type="submit" className="bg-yellow-400 hover:bg-yellow-500 px-6 py-2 rounded-md shadow-sm font-medium">
              Submit Review
            </button>
          </form>
        ) : (
          <div className="bg-gray-100 p-4 rounded mb-8 text-center">
            Please <a href="/login" className="text-blue-600 hover:underline font-bold">sign in</a> to write a review
          </div>
        )}

        <div className="space-y-6">
          {product.reviews && product.reviews.length > 0 ? (
            product.reviews.map((review, idx) => (
              <div key={idx} className="border-b pb-6">
                <div className="flex items-center gap-2 mb-1">
                  <div className="bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center font-bold text-gray-500">
                    {review.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium">{review.name}</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex text-[#FFA41C]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "text-[#FFA41C]" : "text-gray-300"} />
                    ))}
                  </div>
                  <span className="font-bold text-sm text-gray-800">Verified Purchase</span>
                </div>
                <p className="text-gray-800 text-sm">{review.comment}</p>
                <span className="text-xs text-gray-500 block mt-2">
                  Reviewed on {new Date(review.createdAt || Date.now()).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Product;