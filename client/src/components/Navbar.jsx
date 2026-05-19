import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { Search, Mic, ShoppingCart, MapPin, Menu, X, ChevronRight } from "lucide-react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

function Navbar() {
  const { cartItems } = useCart();
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  // AI-like Search Autocomplete
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.trim().length > 0) {
        try {
          const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/products/suggestions?keyword=${searchQuery}`);
          setSuggestions(data);
          setShowSuggestions(true);
        } catch (error) {
          console.error("Error fetching suggestions");
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };
    const timeoutId = setTimeout(() => fetchSuggestions(), 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setShowSuggestions(false);
    navigate(searchQuery.trim() ? `/?keyword=${searchQuery}` : "/");
  };

  const handleSuggestionClick = (title) => {
    setSearchQuery(title);
    setShowSuggestions(false);
    navigate(`/?keyword=${title}`);
  };

  const handleVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
        navigate(`/?keyword=${transcript}`);
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognition.start();
    } else {
      alert("Voice search not supported in this browser.");
    }
  };

  const categories = [
    { title: "Home", link: "/" },
    { title: "Electronics", links: ["Mobiles", "Laptops", "Cameras", "Accessories"] },
    { title: "Fashion", links: ["Men", "Women", "Kids"] },
    { title: "Home & Living", links: ["Furniture", "Kitchen", "Decor"] },
    { title: "Sports & Outdoors", link: "/?category=Sports" },
    { title: "Beauty & Health", link: "/?category=Beauty" },
    { title: "Offers", link: "/?category=Offers" },
    { title: "Wishlist", link: "/profile" },
    { title: "Cart", link: "/cart" },
  ];

  return (
    <>
      <div className="bg-[#131921] text-white flex flex-col pt-2 sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 pb-2 gap-4 relative">
          <div className="flex items-center">
            <button onClick={() => setSidebarOpen(true)} className="mr-2 md:hidden">
              <Menu size={24} />
            </button>
            <Link to="/" className="border border-transparent hover:border-white p-1 rounded shrink-0">
              <h1 className="text-xl md:text-2xl font-bold font-serif tracking-tight">G.C. Store</h1>
            </Link>
          </div>

          <div className="hidden md:flex items-end border border-transparent hover:border-white p-1 rounded cursor-pointer shrink-0">
            <MapPin size={18} className="mb-1 mr-1" />
            <div className="flex flex-col">
              <span className="text-xs text-gray-300">Deliver to</span>
              <span className="text-sm font-bold leading-3">India</span>
            </div>
          </div>

          <div className="hidden md:flex flex-1 relative items-center bg-white rounded-md h-10 focus-within:ring-2 focus-within:ring-[#f90]">
            <select className="bg-gray-100 text-black text-xs h-full px-2 border-r border-gray-300 outline-none rounded-l-md">
              <option>All</option>
            </select>
            <form onSubmit={handleSearchSubmit} className="flex-1 flex h-full">
              <input
                type="text"
                placeholder="Search G.C. Store"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => { if(suggestions.length > 0) setShowSuggestions(true); }}
                className="w-full px-3 text-black outline-none h-full text-sm"
              />
              <button type="button" onClick={handleVoiceSearch}
                className={`px-3 text-gray-500 hover:text-black ${isListening ? "text-red-500 animate-pulse" : ""}`}>
                <Mic size={18} />
              </button>
              <button type="submit" className="bg-[#febd69] hover:bg-[#f3a847] px-4 h-full text-black rounded-r-md">
                <Search size={20} />
              </button>
            </form>
            
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-11 left-0 w-full bg-white shadow-xl rounded-md border border-gray-200 z-50 overflow-hidden text-black">
                {suggestions.map((item) => (
                  <div 
                    key={item._id} 
                    onClick={() => handleSuggestionClick(item.title)}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                  >
                    <Search size={14} className="inline mr-2 text-gray-400" />
                    {item.title}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-1 items-center">
            <div className="relative">
              <div
                className="border border-transparent hover:border-white p-1 rounded cursor-pointer"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                {user ? (
                  <div className="flex flex-col">
                    <span className="text-xs">Hello, {user.name.split(" ")[0]}</span>
                    <span className="text-sm font-bold leading-3">Account & Lists</span>
                  </div>
                ) : (
                  <Link to="/login" className="flex flex-col">
                    <span className="text-xs">Hello, sign in</span>
                    <span className="text-sm font-bold leading-3">Account & Lists</span>
                  </Link>
                )}
              </div>

              {showUserMenu && user && (
                <div className="absolute right-0 top-full mt-1 bg-white text-black shadow-lg rounded-md w-48 z-50 py-2 border border-gray-200">
                  <Link to="/profile" onClick={() => setShowUserMenu(false)} className="block px-4 py-2 text-sm hover:bg-gray-100">Your Account / Wishlist</Link>
                  <Link to="/orders" onClick={() => setShowUserMenu(false)} className="block px-4 py-2 text-sm hover:bg-gray-100">Your Orders</Link>
                  {user.isAdmin && (
                    <Link to="/admin" onClick={() => setShowUserMenu(false)} className="block px-4 py-2 text-sm hover:bg-gray-100">Admin Dashboard</Link>
                  )}
                  <hr className="my-1" />
                  <button
                    onClick={() => { logout(); setShowUserMenu(false); navigate("/"); }}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-red-600"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>

            <Link to="/orders" className="hidden md:flex flex-col border border-transparent hover:border-white p-1 rounded">
              <span className="text-xs">Returns</span>
              <span className="text-sm font-bold leading-3">& Orders</span>
            </Link>

            <Link to="/cart" className="flex items-center border border-transparent hover:border-white p-1 rounded relative">
              <div className="relative flex items-center">
                <ShoppingCart size={32} />
                <span className="absolute top-[-8px] left-[12px] text-[#f08804] font-bold text-lg w-6 text-center">{totalItems}</span>
              </div>
              <span className="text-sm font-bold mt-3 hidden md:block">Cart</span>
            </Link>
          </div>
        </div>

        <div className="flex md:hidden px-4 pb-3 relative">
          <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center bg-white rounded-md overflow-hidden h-10">
            <input type="text" placeholder="Search G.C. Store" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onFocus={() => { if(suggestions.length > 0) setShowSuggestions(true); }} className="w-full px-3 text-black outline-none h-full text-sm" />
            <button type="submit" className="bg-[#febd69] hover:bg-[#f3a847] px-4 h-full text-black"><Search size={20} /></button>
          </form>
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-11 left-4 right-4 bg-white shadow-xl rounded-md border border-gray-200 z-50 overflow-hidden text-black">
              {suggestions.map((item) => (
                <div key={item._id} onClick={() => handleSuggestionClick(item.title)} className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm">
                  <Search size={14} className="inline mr-2 text-gray-400" />{item.title}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-[#232f3e] text-white text-sm px-4 py-1 hidden md:flex items-center gap-4 overflow-x-auto whitespace-nowrap">
          <button onClick={() => setSidebarOpen(true)} className="flex items-center gap-1 font-bold border border-transparent hover:border-white p-1 rounded">
            <Menu size={18} /> All
          </button>
          <Link to="/" className="border border-transparent hover:border-white p-1 rounded">Today Deals</Link>
          <Link to="/?category=Electronics" className="border border-transparent hover:border-white p-1 rounded">Electronics</Link>
          <Link to="/?category=Fashion" className="border border-transparent hover:border-white p-1 rounded">Fashion</Link>
        </div>
      </div>

      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }} onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black z-50" />
            <motion.div initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "tween" }} className="fixed top-0 left-0 h-full w-80 bg-white z-50 overflow-y-auto shadow-2xl flex flex-col">
              <div className="bg-[#232f3e] text-white p-4 flex items-center justify-between sticky top-0 z-10">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <div className="bg-white text-[#232f3e] rounded-full p-1"><ShoppingCart size={20} /></div>
                  Hello, {user ? user.name.split(" ")[0] : "sign in"}
                </h2>
                <button onClick={() => setSidebarOpen(false)} className="text-white hover:text-gray-300"><X size={28} /></button>
              </div>
              
              <div className="py-2">
                <h3 className="font-bold text-lg px-6 py-2 text-gray-800">Shop by Category</h3>
                {categories.map((cat, idx) => (
                  <div key={idx} className="border-b border-gray-100">
                    {cat.link ? (
                      <Link to={cat.link} onClick={() => setSidebarOpen(false)} className="px-6 py-3 hover:bg-gray-100 flex items-center justify-between text-gray-700 cursor-pointer">
                        {cat.title} <ChevronRight size={16} className="text-gray-400" />
                      </Link>
                    ) : (
                      <div className="px-6 py-3">
                        <span className="font-semibold text-gray-800 mb-2 block">{cat.title}</span>
                        <div className="pl-4 flex flex-col gap-2">
                          {cat.links.map((sublink, i) => (
                            <Link key={i} to={`/?category=${cat.title}`} onClick={() => setSidebarOpen(false)} className="text-gray-600 hover:text-orange-600 hover:underline">{sublink}</Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {!user && (
                <div className="mt-auto p-6 bg-gray-50 border-t">
                  <Link to="/login" onClick={() => setSidebarOpen(false)} className="block w-full bg-[#FFD814] text-center py-2 rounded-md font-bold shadow-sm border border-[#FCD200]">Sign In / Register</Link>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navbar;
