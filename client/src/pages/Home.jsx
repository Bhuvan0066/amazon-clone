import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "../components/ProductCard";

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword") || "";
  const category = searchParams.get("category") || "";

  const [currentSlide, setCurrentSlide] = useState(0);
  const heroImages = [
    "https://m.media-amazon.com/images/I/61lwJy4B8PL._SX3000_.jpg",
    "https://m.media-amazon.com/images/I/71Ie3JXGfVL._SX3000_.jpg",
    "https://m.media-amazon.com/images/I/71U-Q+N7PXL._SX3000_.jpg",
  ];

  // Fetch Products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/products?keyword=${keyword}&category=${category}&page=${page}`
        );
        const productsData = response.data.products || response.data || [];
        setProducts(productsData);
        if (response.data.pages) {
          setPages(response.data.pages);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [keyword, category, page]);

  // Carousel logic
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const categories = [
    { title: "Electronics", image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=80&w=600" },
    { title: "Fashion", image: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=600" },
    { title: "Home & Kitchen", image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=600" },
    { title: "Computers", image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=600" },
  ];

  return (
    <div className="bg-gray-100 min-h-screen pb-10">
      {/* Hero Carousel */}
      <div className="relative w-full h-[250px] md:h-[400px] lg:h-[600px] overflow-hidden -mb-12 md:-mb-32 lg:-mb-64">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-100 to-transparent z-10 bottom-0 h-1/2 mt-auto" />
        <AnimatePresence mode="wait">
          <motion.img
            key={currentSlide}
            src={heroImages[currentSlide]}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="w-full h-full object-cover object-top"
          />
        </AnimatePresence>
      </div>

      <div className="relative z-20 max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {!keyword && !category && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {categories.map((cat, idx) => (
              <div key={idx} className="bg-white p-5 z-20 flex flex-col h-[400px]">
                <h2 className="text-xl font-bold mb-4">{cat.title}</h2>
                <div className="flex-1 overflow-hidden flex items-center justify-center">
                   <img src={cat.image} alt={cat.title} className="object-cover max-h-full" />
                </div>
                <Link to={`/?category=${cat.title === 'Home & Kitchen' ? 'Home' : cat.title}`} className="text-sm text-[#007185] hover:text-[#C7511F] hover:underline mt-4">Shop now</Link>
              </div>
            ))}
          </div>
        )}

        {/* Products Grid */}
        <div className="bg-white p-4 sm:p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6">
            {keyword ? `Results for "${keyword}"` : category ? `${category} Products` : "Featured Products"}
          </h2>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="animate-pulse flex flex-col h-full bg-white p-4 border border-gray-200">
                  <div className="bg-gray-200 h-48 w-full mb-4 rounded"></div>
                  <div className="bg-gray-200 h-4 w-3/4 mb-2 rounded"></div>
                  <div className="bg-gray-200 h-4 w-1/2 mb-4 rounded"></div>
                  <div className="bg-gray-200 h-8 w-full mt-auto rounded-full"></div>
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <h3 className="text-xl font-bold text-gray-700">No products found.</h3>
              <p className="text-gray-500 mt-2">Try checking your spelling or use more general terms</p>
            </div>
          )}

          {/* Pagination Controls */}
          {pages > 1 && !loading && (
            <div className="flex justify-center mt-10 mb-4 gap-2">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 border rounded-md disabled:opacity-50 hover:bg-gray-50"
              >
                Previous
              </button>
              {[...Array(pages).keys()].map((x) => (
                <button
                  key={x + 1}
                  onClick={() => setPage(x + 1)}
                  className={`px-4 py-2 border rounded-md ${
                    x + 1 === page ? "bg-slate-900 text-white" : "hover:bg-gray-50"
                  }`}
                >
                  {x + 1}
                </button>
              ))}
              <button 
                onClick={() => setPage(p => Math.min(pages, p + 1))}
                disabled={page === pages}
                className="px-4 py-2 border rounded-md disabled:opacity-50 hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;