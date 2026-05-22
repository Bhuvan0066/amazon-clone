import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import { Trash2, ShoppingBag, ArrowRight } from "lucide-react";

function Cart() {
  const { cartItems, removeFromCart, increaseQuantity, decreaseQuantity } = useCart();
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="bg-slate-50 min-h-screen py-8 px-4 md:px-8 max-w-[1500px] mx-auto font-sans">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Side - Cart Items */}
        <div className="flex-1 bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-end border-b border-slate-200 pb-4 mb-6">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Shopping Cart</h1>
            <p className="text-slate-500 text-sm font-medium pb-1 hidden sm:block">Price</p>
          </div>

          {cartItems.length === 0 ? (
            <div className="py-16 flex flex-col items-center justify-center text-center">
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                <ShoppingBag className="w-10 h-10 text-slate-400" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Your cart is empty</h2>
              <p className="text-slate-500 mb-8 max-w-md">Looks like you haven't added anything to your cart yet. Explore our top products and find something you love!</p>
              <Link to="/" className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-8 rounded-full transition-colors shadow-lg shadow-primary-600/30">
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-8 mt-4">
              {cartItems.map((item) => (
                <div key={item._id || item.id} className="flex flex-col sm:flex-row gap-6 pb-8 border-b border-slate-100 group">
                  <div className="w-full sm:w-1/4 max-w-[180px] self-center sm:self-start bg-slate-50 rounded-xl p-4 flex items-center justify-center">
                    <img src={item.image || item.images?.[0]} alt={item.title} className="w-full h-auto object-contain max-h-40 mix-blend-multiply transition-transform group-hover:scale-105" />
                  </div>
                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between items-start gap-4">
                      <Link to={"/product/" + (item._id || item.id)} className="text-xl font-bold text-slate-800 hover:text-primary-600 transition-colors line-clamp-2">
                        {item.title}
                      </Link>
                      <div className="text-2xl font-bold text-slate-900 whitespace-nowrap">₹{Math.floor(item.price)}</div>
                    </div>
                    <div className="text-sm font-medium text-emerald-600 mt-2 mb-1">In stock</div>
                    <div className="text-sm text-slate-500 mb-4">Eligible for FREE Shipping</div>
                    
                    <div className="mt-auto flex flex-wrap items-center gap-6">
                      <div className="flex items-center border border-slate-200 rounded-full bg-white shadow-sm overflow-hidden h-10">
                        <button onClick={() => decreaseQuantity(item._id || item.id)} className="w-10 h-full flex items-center justify-center hover:bg-slate-100 text-slate-600 transition-colors font-medium">-</button>
                        <span className="w-12 h-full flex items-center justify-center font-semibold text-slate-800 border-x border-slate-100">{item.quantity}</span>
                        <button onClick={() => increaseQuantity(item._id || item.id)} className="w-10 h-full flex items-center justify-center hover:bg-slate-100 text-slate-600 transition-colors font-medium">+</button>
                      </div>
                      <button onClick={() => removeFromCart(item._id || item.id)} className="flex items-center gap-2 text-slate-500 hover:text-red-500 font-medium text-sm transition-colors">
                        <Trash2 size={16} /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side - Checkout Summary */}
        {cartItems.length > 0 && (
          <div className="w-full lg:w-[380px] flex flex-col gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col sticky top-24">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6 text-slate-600">
                <div className="flex justify-between">
                  <span>Items ({totalItems}):</span>
                  <span className="font-medium text-slate-900">₹{totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span className="font-medium text-emerald-600">Free</span>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-4 mb-8 flex justify-between items-end">
                <span className="text-lg font-bold text-slate-900">Order Total:</span>
                <span className="text-3xl font-black text-slate-900">₹{totalPrice.toFixed(2)}</span>
              </div>

              <Link to="/checkout" className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]">
                Proceed to Checkout <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;
