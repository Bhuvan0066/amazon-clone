import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Terminal } from "lucide-react";

import Navbar from "./components/Navbar";
import BottomNav from "./components/BottomNav";

import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Product from "./pages/Product";
import Admin from "./pages/Admin";
import Profile from "./pages/Profile";
import Orders from "./pages/Orders";
import Wishlist from "./pages/Wishlist";

import { FloatingPreviewPanel } from "./components/Antigravity/FloatingPreviewPanel";
import { useEditorStore } from "./store/editorStore";

function App() {
  const { togglePanel } = useEditorStore();

  return (
    <div className="min-h-screen bg-gray-100 pb-16 md:pb-0 relative">
      <Navbar />
      <ToastContainer position="bottom-right" autoClose={3000} />
      <main className="max-w-[1500px] mx-auto">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/wishlist" element={<Wishlist />} />
        </Routes>
      </main>
      <BottomNav />

      {/* Antigravity Global Components */}
      <FloatingPreviewPanel />
      
      {/* Dev Toggle Button */}
      <button 
        onClick={togglePanel}
        className="fixed bottom-20 md:bottom-6 right-6 p-4 bg-slate-900 text-blue-400 rounded-full shadow-2xl hover:scale-110 hover:bg-slate-800 transition-all z-50 border border-slate-700 group"
        title="Open Antigravity Live Editor"
      >
        <Terminal size={24} />
        <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-slate-700">
          Launch Antigravity
        </span>
      </button>
    </div>
  );
}

export default App;
