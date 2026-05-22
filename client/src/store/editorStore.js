import { create } from 'zustand';

export const useEditorStore = create((set) => ({
  isOpen: false,
  togglePanel: () => set((state) => ({ isOpen: !state.isOpen })),
  productForm: {
    title: '',
    price: '',
    description: '',
    category: 'Electronics',
    image: '',
    stock: 10,
    badges: ''
  },
  setProductForm: (field, value) => set((state) => ({
    productForm: { ...state.productForm, [field]: value }
  })),
  resetForm: () => set({
    productForm: { title: '', price: '', description: '', category: 'Electronics', image: '', stock: 10, badges: '' }
  })
}));
