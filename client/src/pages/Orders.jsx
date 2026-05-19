import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { Package, ChevronRight } from "lucide-react";

function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    const fetchOrders = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } };
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/orders/myorders`, config);
        setOrders(data);
      } catch (error) {
        toast.error("Could not fetch orders.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  if (!user) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <h2 className="text-2xl font-bold mb-4">Please sign in to view your orders</h2>
      <Link to="/login" className="bg-[#FFD814] hover:bg-[#F7CA00] px-8 py-2 rounded-full font-medium border border-[#FCD200]">Sign In</Link>
    </div>
  );

  return (
    <div className="bg-gray-100 min-h-screen py-6 px-4 md:px-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Your Orders</h1>
      {loading ? (
        <div className="flex justify-center p-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500" />
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white p-10 rounded-lg shadow-sm text-center">
          <Package size={64} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-bold mb-2">No orders yet</h2>
          <p className="text-gray-500 mb-6">You have not placed any orders yet.</p>
          <Link to="/" className="bg-[#FFD814] hover:bg-[#F7CA00] px-8 py-2 rounded-full font-medium border border-[#FCD200]">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 border-b border-gray-200 px-6 py-3 grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                <div>
                  <p className="text-gray-500 uppercase text-xs font-bold">Order placed</p>
                  <p>{new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
                </div>
                <div>
                  <p className="text-gray-500 uppercase text-xs font-bold">Total</p>
                  <p className="font-bold">Rs.{order.totalPrice?.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-gray-500 uppercase text-xs font-bold">Status</p>
                  <p className={`font-bold ${order.isPaid ? "text-green-600" : "text-orange-500"}`}>
                    {order.isPaid ? "Paid" : "Pending"}
                  </p>
                </div>
                <div className="text-right text-xs text-gray-400">
                  <p className="uppercase font-bold">Order # {order._id.slice(-8).toUpperCase()}</p>
                </div>
              </div>
              <div className="px-6 py-4">
                {order.orderItems?.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 py-2 border-b last:border-0">
                    <img src={item.image} alt={item.title} className="w-16 h-16 object-contain border p-1 rounded" />
                    <div className="flex-1">
                      <p className="text-sm font-medium line-clamp-2">{item.title}</p>
                      <p className="text-xs text-gray-500 mt-1">Qty: {item.qty} | Rs.{item.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Orders;
