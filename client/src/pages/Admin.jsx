import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Package, Users, ShoppingBag, PlusCircle, Edit, Trash2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Admin() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [products, setProducts] = useState([]);
  
  const [uploading, setUploading] = useState(false);
  const [newProduct, setNewProduct] = useState({
    title: "", price: "", image: "", category: "", stock: "", description: ""
  });

  useEffect(() => {
    // If not admin, redirect
    if (user && !user.isAdmin) {
      toast.error("Not authorized as an admin");
      navigate("/");
    }
  }, [user, navigate]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/products`);
      setProducts(data.products || data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
      await axios.post(`${import.meta.env.VITE_API_URL}/api/products`, newProduct, config);
      toast.success("Product added successfully");
      setNewProduct({ title: "", price: "", image: "", category: "", stock: "", description: "" });
      fetchProducts();
    } catch (error) {
      toast.error("Failed to add product");
    }
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/upload`, formData, config);
      setNewProduct({ ...newProduct, image: `${import.meta.env.VITE_API_URL}${data}` });
      setUploading(false);
    } catch (error) {
      console.error(error);
      setUploading(false);
      toast.error('Image upload failed');
    }
  };

  if (!user || !user.isAdmin) return null;

  return (
    <div className="bg-gray-100 min-h-screen pb-10">
      {/* Admin Header */}
      <div className="bg-[#232f3e] text-white py-4 px-6 shadow-md">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      </div>

      <div className="flex flex-col md:flex-row max-w-7xl mx-auto mt-6 px-4 gap-6">
        {/* Sidebar */}
        <div className="w-full md:w-64 bg-white rounded-lg shadow-sm p-4 h-fit">
          <ul className="space-y-2">
            <li>
              <button 
                onClick={() => setActiveTab("dashboard")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${activeTab === 'dashboard' ? 'bg-gray-100 text-[#007185] font-bold' : 'hover:bg-gray-50'}`}
              >
                <Package size={20} /> Dashboard
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab("products")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${activeTab === 'products' ? 'bg-gray-100 text-[#007185] font-bold' : 'hover:bg-gray-50'}`}
              >
                <ShoppingBag size={20} /> Products
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab("users")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${activeTab === 'users' ? 'bg-gray-100 text-[#007185] font-bold' : 'hover:bg-gray-50'}`}
              >
                <Users size={20} /> Users
              </button>
            </li>
          </ul>
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === "dashboard" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border-t-4 border-[#007185]">
                <h3 className="text-gray-500 text-sm font-bold uppercase">Total Products</h3>
                <p className="text-3xl font-bold mt-2">{products.length}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border-t-4 border-[#C7511F]">
                <h3 className="text-gray-500 text-sm font-bold uppercase">Total Orders</h3>
                <p className="text-3xl font-bold mt-2">0</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border-t-4 border-yellow-500">
                <h3 className="text-gray-500 text-sm font-bold uppercase">Total Revenue</h3>
                <p className="text-3xl font-bold mt-2">₹0</p>
              </div>
            </div>
          )}

          {activeTab === "products" && (
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Manage Products</h2>
              </div>

              {/* Add Product Form */}
              <form onSubmit={handleAddProduct} className="mb-8 p-4 bg-gray-50 rounded border border-gray-200">
                <h3 className="font-bold mb-4 flex items-center gap-2"><PlusCircle size={18} /> Add New Product</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" placeholder="Title" required value={newProduct.title} onChange={e => setNewProduct({...newProduct, title: e.target.value})} className="p-2 border rounded" />
                  <input type="number" placeholder="Price" required value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} className="p-2 border rounded" />
                  <div className="flex flex-col gap-2">
                    <input type="text" placeholder="Image URL (or upload below)" required value={newProduct.image} onChange={e => setNewProduct({...newProduct, image: e.target.value})} className="p-2 border rounded" />
                    <input type="file" onChange={uploadFileHandler} className="p-2 border rounded bg-white" />
                    {uploading && <span className="text-sm text-blue-500">Uploading...</span>}
                  </div>
                  <input type="text" placeholder="Category" required value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} className="p-2 border rounded" />
                  <input type="number" placeholder="Stock" required value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: e.target.value})} className="p-2 border rounded" />
                  <input type="text" placeholder="Description" required value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} className="p-2 border rounded" />
                </div>
                <button type="submit" className="mt-4 bg-[#FFD814] px-6 py-2 rounded shadow-sm font-medium hover:bg-[#F7CA00]">
                  Add Product
                </button>
              </form>

              {/* Products Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-3 border-b font-bold text-gray-700">Image</th>
                      <th className="p-3 border-b font-bold text-gray-700">Title</th>
                      <th className="p-3 border-b font-bold text-gray-700">Price</th>
                      <th className="p-3 border-b font-bold text-gray-700">Stock</th>
                      <th className="p-3 border-b font-bold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(product => (
                      <tr key={product._id} className="hover:bg-gray-50 border-b">
                        <td className="p-3"><img src={product.image} alt="" className="w-12 h-12 object-contain bg-white border p-1 rounded" /></td>
                        <td className="p-3 max-w-[200px] truncate">{product.title}</td>
                        <td className="p-3 font-bold">₹{product.price}</td>
                        <td className="p-3">{product.stock}</td>
                        <td className="p-3 flex gap-3">
                          <button className="text-blue-500 hover:text-blue-700"><Edit size={18} /></button>
                          <button className="text-red-500 hover:text-red-700"><Trash2 size={18} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "users" && (
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-bold mb-6">Manage Users</h2>
              <p className="text-gray-500">User management interface will go here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Admin