import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useCartStore from '../store/cartStore';
import { createOrder } from '../services/order.service';
import { createInvoice } from '../services/payment.service';

export default function Cart() {
  const navigate = useNavigate();
  const { items, updateQuantity, removeItem, getTotal, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleCheckout() {
    setError('');
    setLoading(true);

    try {
      // Step 1 — buat order di backend
      const orderRes = await createOrder(
        items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        }))
      );

      const orderId = orderRes.data.id;

      // Step 2 — buat invoice pembayaran
      const invoiceRes = await createInvoice(orderId);

      // Step 3 — kosongkan cart dan redirect ke halaman pembayaran Xendit
      clearCart();
      window.location.href = invoiceRes.data.paymentUrl;
    } catch (err) {
      setError(
        err.response?.data?.error?.message || 'Checkout gagal, coba lagi'
      );
    } finally {
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <p className="text-gray-500 mb-4">Keranjang kamu masih kosong</p>
        <Link to="/products" className="text-indigo-600 hover:underline">
          Mulai belanja
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Keranjang Belanja</h1>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm p-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.productId} className="flex items-center gap-4 border rounded-lg p-4">
            <div className="bg-gray-100 w-16 h-16 rounded flex items-center justify-center shrink-0">
              {item.imageUrl ? (
                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover rounded" />
              ) : (
                <span className="text-xs text-gray-400">No img</span>
              )}
            </div>

            <div className="flex-1">
              <h3 className="font-medium text-sm">{item.name}</h3>
              <p className="text-indigo-600 font-bold text-sm">
                Rp {item.price.toLocaleString('id-ID')}
              </p>
            </div>

            <div className="flex items-center border rounded">
              <button
                onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                className="px-2 py-1 hover:bg-gray-100"
              >
                −
              </button>
              <span className="px-3 text-sm">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.productId, Math.min(item.stock, item.quantity + 1))}
                className="px-2 py-1 hover:bg-gray-100"
              >
                +
              </button>
            </div>

            <button
              onClick={() => removeItem(item.productId)}
              className="text-red-500 text-sm hover:underline"
            >
              Hapus
            </button>
          </div>
        ))}
      </div>

      <div className="border-t mt-6 pt-4 flex items-center justify-between">
        <span className="font-medium">Total</span>
        <span className="text-xl font-bold text-indigo-600">
          Rp {getTotal().toLocaleString('id-ID')}
        </span>
      </div>

      <button
        onClick={handleCheckout}
        disabled={loading}
        className="w-full bg-indigo-600 text-white py-3 rounded mt-6 hover:bg-indigo-700 disabled:opacity-50"
      >
        {loading ? 'Memproses...' : 'Checkout & Bayar'}
      </button>
    </div>
  );
}