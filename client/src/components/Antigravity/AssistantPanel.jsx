import { Save, RefreshCw } from 'lucide-react';
import { useEditorStore } from '../../store/editorStore';
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';

export function AssistantPanel() {
  const { productForm, setProductForm, resetForm, togglePanel } = useEditorStore();
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!user || !user.isAdmin) {
      toast.error('Admin privileges required.');
      return;
    }
    
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
      const payload = {
        ...productForm,
        price: Number(productForm.price),
        stock: Number(productForm.stock),
        badges: productForm.badges ? productForm.badges.split(',').map(b => b.trim()) : []
      };
      
      await axios.post(`${import.meta.env.VITE_API_URL}/api/products`, payload, config);
      toast.success('Product saved!');
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setProductForm(e.target.name, e.target.value);

  return (
    <div className="w-[320px] shrink-0 h-full min-h-0 flex flex-col bg-slate-900 border-l border-slate-700 text-slate-100 z-50">
      <div className="p-2 border-b border-slate-700 flex justify-between items-center bg-slate-800 shrink-0">
        <h3 className="font-bold text-sm text-white">Product Cart</h3>
        <button onClick={resetForm} className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white transition-colors">
          <RefreshCw size={14} />
        </button>
      </div>
      
      <form id="prod-form" onSubmit={handleSaveProduct} className="flex-1 overflow-y-auto p-3 flex flex-col gap-2 min-h-0 custom-scrollbar">
        <div>
          <label className="block text-[11px] font-medium text-slate-400 mb-0.5">Title *</label>
          <input required type="text" name="title" value={productForm.title} onChange={handleChange} className="w-full bg-slate-800 border border-slate-700 rounded p-1.5 text-xs text-white focus:border-primary-500 outline-none" />
        </div>
        
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="block text-[11px] font-medium text-slate-400 mb-0.5">Price (₹) *</label>
            <input required type="number" name="price" value={productForm.price} onChange={handleChange} className="w-full bg-slate-800 border border-slate-700 rounded p-1.5 text-xs text-white outline-none" />
          </div>
          <div className="flex-1">
            <label className="block text-[11px] font-medium text-slate-400 mb-0.5">Stock</label>
            <input type="number" name="stock" value={productForm.stock} onChange={handleChange} className="w-full bg-slate-800 border border-slate-700 rounded p-1.5 text-xs text-white outline-none" />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-medium text-slate-400 mb-0.5">Category</label>
          <select name="category" value={productForm.category} onChange={handleChange} className="w-full bg-slate-800 border border-slate-700 rounded p-1.5 text-xs text-white outline-none">
            <option value="Electronics">Electronics</option>
            <option value="Fashion">Fashion</option>
            <option value="Home">Home & Living</option>
            <option value="Sports">Sports</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-medium text-slate-400 mb-0.5">Image URL *</label>
          <input required type="url" name="image" value={productForm.image} onChange={handleChange} className="w-full bg-slate-800 border border-slate-700 rounded p-1.5 text-xs text-white outline-none" />
        </div>

        <div>
          <label className="block text-[11px] font-medium text-slate-400 mb-0.5">Badges</label>
          <input type="text" name="badges" value={productForm.badges} onChange={handleChange} className="w-full bg-slate-800 border border-slate-700 rounded p-1.5 text-xs text-white outline-none" />
        </div>

        <div>
          <label className="block text-[11px] font-medium text-slate-400 mb-0.5">Description</label>
          <textarea name="description" value={productForm.description} onChange={handleChange} rows={3} className="w-full bg-slate-800 border border-slate-700 rounded p-1.5 text-xs text-white outline-none resize-none" />
        </div>
      </form>

      <div className="p-2 border-t border-slate-700 bg-slate-800 flex gap-2 shrink-0">
        <button type="button" onClick={togglePanel} className="flex-1 py-1.5 rounded bg-slate-700 hover:bg-slate-600 text-white text-xs font-medium">
          Cancel
        </button>
        <button form="prod-form" type="submit" disabled={loading} className="flex-1 py-1.5 rounded bg-primary-600 hover:bg-primary-500 text-white text-xs font-medium flex justify-center items-center gap-1">
          {loading ? <RefreshCw size={12} className="animate-spin" /> : <Save size={12} />}
          Save
        </button>
      </div>
    </div>
  );
}
