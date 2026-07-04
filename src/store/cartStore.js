import { create } from 'zustand';

const useCartStore = create((set, get) => ({
  items: JSON.parse(localStorage.getItem('cart')) || [],

  addItem: (product, quantity = 1) => {
    const items = get().items;
    const existing = items.find((item) => item.productId === product.id);

    let updated;
    if (existing) {
      // Kalau produk sudah ada di cart, tambah quantity-nya
      updated = items.map((item) =>
        item.productId === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      updated = [
        ...items,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
          stock: product.stock,
          quantity,
        },
      ];
    }

    localStorage.setItem('cart', JSON.stringify(updated));
    set({ items: updated });
  },

  updateQuantity: (productId, quantity) => {
    const items = get().items;
    const updated = items.map((item) =>
      item.productId === productId ? { ...item, quantity } : item
    );
    localStorage.setItem('cart', JSON.stringify(updated));
    set({ items: updated });
  },

  removeItem: (productId) => {
    const items = get().items;
    const updated = items.filter((item) => item.productId !== productId);
    localStorage.setItem('cart', JSON.stringify(updated));
    set({ items: updated });
  },

  clearCart: () => {
    localStorage.removeItem('cart');
    set({ items: [] });
  },

  getTotal: () => {
    return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  },

  getItemCount: () => {
    return get().items.reduce((sum, item) => sum + item.quantity, 0);
  },
}));

export default useCartStore;