import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Package, Heart, User, LogOut, ChevronRight } from "lucide-react";

function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <h2 className="text-2xl font-bold mb-4">Sign in for the best experience</h2>
        <button 
          onClick={() => navigate("/login")}
          className="bg-[#FFD814] hover:bg-[#F7CA00] w-full max-w-sm py-3 rounded shadow-sm font-medium border border-[#FCD200]"
        >
          Sign in securely
        </button>
        <div className="mt-4 text-sm">
          New to Amazon Clone? <Link to="/signup" className="text-[#007185] hover:underline hover:text-[#C7511F]">Create an account</Link>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="bg-gray-100 min-h-screen pb-10">
      <div className="bg-white p-4 flex items-center gap-4 shadow-sm">
        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-2xl font-bold text-gray-500">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="text-2xl font-bold">Hello, {user.name}</h1>
          <p className="text-gray-500">{user.email}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto mt-6 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <Link to="/orders" className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center justify-between hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#e7f4f5] text-[#007185] rounded-full">
                <Package size={24} />
              </div>
              <div>
                <h2 className="text-lg font-bold">Your Orders</h2>
                <p className="text-sm text-gray-500">Track, return, or buy things again</p>
              </div>
            </div>
            <ChevronRight className="text-gray-400" />
          </Link>

          <Link to="/wishlist" className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center justify-between hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#fdf0f3] text-[#C7511F] rounded-full">
                <Heart size={24} />
              </div>
              <div>
                <h2 className="text-lg font-bold">Your Lists</h2>
                <p className="text-sm text-gray-500">View your wishlist and saved items</p>
              </div>
            </div>
            <ChevronRight className="text-gray-400" />
          </Link>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gray-100 text-gray-700 rounded-full">
                <User size={24} />
              </div>
              <div>
                <h2 className="text-lg font-bold">Login & Security</h2>
                <p className="text-sm text-gray-500">Edit login, name, and mobile number</p>
              </div>
            </div>
            <ChevronRight className="text-gray-400" />
          </div>

          {user.isAdmin && (
            <Link to="/admin" className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 text-purple-700 rounded-full">
                  <Package size={24} />
                </div>
                <div>
                  <h2 className="text-lg font-bold">Admin Dashboard</h2>
                  <p className="text-sm text-gray-500">Manage products, users, and orders</p>
                </div>
              </div>
              <ChevronRight className="text-gray-400" />
            </Link>
          )}

          <button onClick={handleLogout} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center justify-between hover:bg-gray-50 transition-colors text-left">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-50 text-red-600 rounded-full">
                <LogOut size={24} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-red-600">Sign Out</h2>
              </div>
            </div>
            <ChevronRight className="text-gray-400" />
          </button>

        </div>
      </div>
    </div>
  );
}

export default Profile;
