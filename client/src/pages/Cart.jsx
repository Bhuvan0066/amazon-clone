import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

function Cart() {
  const { cartItems, removeFromCart, increaseQuantity, decreaseQuantity } = useCart();

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="bg-gray-100 min-h-screen py-6 px-4 md:px-8 max-w-[1500px] mx-auto">
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Left Side - Cart Items */}
        <div className="flex-1 bg-white p-6 shadow-sm">
          <h1 className="text-2xl md:text-3xl font-medium mb-1">Shopping Cart</h1>
          <p className="text-[#007185] hover:underline cursor-pointer text-sm mb-4">Deselect all items</p>
          <div className="text-right text-gray-500 text-sm pb-2 border-b">Price</div>

          {cartItems.length === 0 ? (
            <div className="py-10 text-center">
              <h2 className="text-2xl font-bold mb-4">Your Amazon Clone Cart is empty.</h2>
              <Link to="/" className="text-[#007185] hover:text-[#C7511F] hover:underline">
                Continue shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-6 mt-4">
              {cartItems.map((item) => (
                <div key={item._id || item.id} className="flex flex-col sm:flex-row gap-6 pb-6 border-b border-gray-200">
                  {/* Image */}
                  <div className="w-full sm:w-1/4 max-w-[180px] self-center sm:self-start">
                    <img
                      src={item.image || item.images?.[0]}
                      alt={item.title}
                      className="w-full h-auto object-contain max-h-48"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <Link to={`/product/${item._id || item.id}`} className="text-lg md:text-xl font-medium text-[#007185] hover:text-[#C7511F] hover:underline line-clamp-2 pr-4">
                        {item.title}
                      </Link>
                      <div className="text-xl font-bold whitespace-nowrap">₹{Math.floor(item.price)}</div>
                    </div>
                    
                    <div className="text-sm text-[#007600] mt-1 mb-1">In stock</div>
                    <div className="text-sm text-gray-500 mb-1">Eligible for FREE Shipping</div>
                    
                    {item.badges && item.badges.length > 0 && (
                      <span className="bg-[#C7511F] text-white text-xs px-2 py-0.5 mt-1 inline-block">
                        {item.badges[0]}
                      </span>
                    )}

                    {/* Actions */}
                    <div className="flex flex-wrap items-center gap-4 mt-4 text-sm">
                      <div className="flex items-center border rounded-lg bg-gray-100 shadow-sm overflow-hidden">
                        <button 
                          onClick={() => decreaseQuantity(item._id || item.id)}
                          className="px-3 py-1 hover:bg-gray-200 transition-colors cursor-pointer"
                        >
                          -
                        </button>
                        <span className="px-3 py-1 bg-white font-medium min-w-[30px] text-center">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => increaseQuantity(item._id || item.id)}
                          className="px-3 py-1 hover:bg-gray-200 transition-colors cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      <div className="h-4 border-l border-gray-300 hidden sm:block"></div>

                      <button 
                        onClick={() => removeFromCart(item._id || item.id)}
                        className="text-[#007185] hover:underline cursor-pointer"
                      >
                        Delete
                      </button>

                      <div className="h-4 border-l border-gray-300 hidden sm:block"></div>

                      <button className="text-[#007185] hover:underline cursor-pointer">
                        Save for later
                      </button>
                      
                      <div className="h-4 border-l border-gray-300 hidden sm:block"></div>

                      <button className="text-[#007185] hover:underline cursor-pointer">
                        See more like this
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="flex justify-end pt-2">
                <div className="text-lg md:text-xl">
                  Subtotal ({totalItems} item{totalItems !== 1 && 's'}): <span className="font-bold">₹{totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Side - Subtotal & Checkout */}
        {cartItems.length > 0 && (
          <div className="w-full lg:w-[300px] flex flex-col gap-4">
            <div className="bg-white p-5 shadow-sm flex flex-col">
              <div className="flex gap-2 items-start mb-4">
                <div className="mt-1 text-white bg-green-700 rounded-full w-4 h-4 flex items-center justify-center text-xs">✓</div>
                <div className="text-sm text-[#007600]">
                  Your order is eligible for FREE Delivery. <span className="text-gray-600">Select this option at checkout.</span>
                </div>
              </div>

              <div className="text-lg md:text-xl mb-4">
                Subtotal ({totalItems} item{totalItems !== 1 && 's'}): <br/><span className="font-bold">₹{totalPrice.toFixed(2)}</span>
              </div>

              <div className="flex gap-2 mb-4 items-center">
                <input type="checkbox" id="gift" className="w-4 h-4 accent-[#007185]" />
                <label htmlFor="gift" className="text-sm">This order contains a gift</label>
              </div>

              <Link to="/checkout" className="bg-[#FFD814] hover:bg-[#F7CA00] w-full py-2 rounded-full shadow-sm font-medium transition-colors border border-[#FCD200] block text-center">
                Proceed to Buy
              </Link>
            </div>
            
            <div className="bg-white p-4 shadow-sm border border-gray-200 rounded text-sm">
              <h3 className="font-bold mb-2">EMI Available</h3>
              <p className="text-gray-600 mb-2">Your order qualifies for EMI with valid credit cards.</p>
              <a href="#" className="text-[#007185] hover:underline hover:text-[#C7511F]">Learn more</a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;