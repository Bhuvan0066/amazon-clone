import { useState, useEffect, useCallback } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import useRazorpay from "react-razorpay";
import axios from "axios";
import { toast } from "react-toastify";

function Checkout() {
  const { cartItems, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [Razorpay] = useRazorpay();

  const [address, setAddress] = useState({ street: "", city: "", postalCode: "", country: "India" });
  const [processing, setProcessing] = useState(false);

  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  useEffect(() => {
    if (!user) {
      toast.error("Please login to checkout");
      navigate("/login");
      return;
    }
    if (cartItems.length === 0) {
      navigate("/cart");
    }
  }, [user, cartItems, navigate]);

  const handlePayment = useCallback(async (e) => {
    e.preventDefault();
    if (!address.street || !address.city || !address.postalCode) {
      toast.error("Please fill in all shipping details");
      return;
    }
    setProcessing(true);

    try {
      const config = { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } };
      
      // Create Razorpay Order on backend
      const { data: orderResponse } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/orders/razorpay-order`,
        { amount: totalPrice },
        config
      );

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "mock_key", // Enter the Key ID generated from the Dashboard
        amount: orderResponse.amount,
        currency: orderResponse.currency,
        name: "G.C. Store",
        description: "Test Transaction",
        order_id: orderResponse.id,
        handler: async (response) => {
          try {
            // Save Order in Backend
            const orderData = {
              orderItems: cartItems.map(item => ({ title: item.title, qty: item.quantity, image: item.image, price: item.price, product: item._id || item.id })),
              shippingAddress: address,
              paymentMethod: 'Razorpay',
              itemsPrice: totalPrice,
              shippingPrice: 0,
              totalPrice: totalPrice,
            };

            const { data: savedOrder } = await axios.post(`${import.meta.env.VITE_API_URL}/api/orders`, orderData, config);
            
            // Update Order to Paid
            await axios.put(`${import.meta.env.VITE_API_URL}/api/orders/${savedOrder._id}/pay`, {
              id: response.razorpay_payment_id,
              status: "succeeded",
              update_time: new Date().toISOString(),
              email_address: user.email
            }, config);

            toast.success("Payment successful! Order placed. ??");
            clearCart();
            navigate("/orders");
          } catch (err) {
            toast.error("Failed to save order");
          }
        },
        prefill: { name: user.name, email: user.email, contact: "9999999999" },
        theme: { color: "#232f3e" },
      };

      const rzp1 = new Razorpay(options);
      
      rzp1.on("payment.failed", function (response) {
        toast.error(`Payment failed: ${response.error.description}`);
      });

      rzp1.open();
    } catch (err) {
      toast.error(`Error initializing payment: ${err.message}`);
    } finally {
      setProcessing(false);
    }
  }, [Razorpay, address, cartItems, clearCart, navigate, totalPrice, user]);

  return (
    <div className="bg-gray-100 min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-medium mb-6">Checkout ({cartItems.reduce((a,c)=>a+c.quantity,0)} items)</h1>
        
        <form onSubmit={handlePayment} className="flex flex-col gap-6">
          <div className="bg-white p-6 border rounded-lg shadow-sm">
            <h2 className="text-xl font-bold mb-4">1. Delivery address</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="Full name" value={user?.name || ""} readOnly className="border p-2 rounded bg-gray-50" />
              <input type="text" placeholder="Street Address" required value={address.street} onChange={e => setAddress({...address, street: e.target.value})} className="border p-2 rounded" />
              <input type="text" placeholder="City" required value={address.city} onChange={e => setAddress({...address, city: e.target.value})} className="border p-2 rounded" />
              <input type="text" placeholder="Postal Code" required value={address.postalCode} onChange={e => setAddress({...address, postalCode: e.target.value})} className="border p-2 rounded" />
            </div>
          </div>

          <div className="bg-white p-6 border rounded-lg shadow-sm">
            <h2 className="text-xl font-bold mb-4">2. Payment method</h2>
            <div className="border p-4 rounded-md bg-gray-50 text-gray-700">
              You will be redirected to Razorpay securely to complete your payment. UPI, Credit/Debit cards, and NetBanking are supported.
            </div>
          </div>

          <div className="bg-white p-6 border rounded-lg shadow-sm flex flex-col items-end">
            <h2 className="text-xl font-bold text-red-700">Order Total: ?{totalPrice.toFixed(2)}</h2>
            <button 
              disabled={processing} type="submit" 
              className={`mt-4 w-full md:w-auto px-10 py-3 rounded-lg font-bold shadow-sm transition-colors ${
                processing ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200]'
              }`}
            >
              {processing ? 'Processing...' : 'Place your order and pay'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Checkout;
