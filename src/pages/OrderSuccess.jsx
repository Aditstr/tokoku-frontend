import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrderById } from '../services/order.service';

export default function OrderSuccess() {
  const { id }                = useParams();
  const [order, setOrder]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  async function fetchOrder() {
    try {
      const res = await getOrderById(id);
      setOrder(res.data);
    } catch (err) {
      console.error('Gagal ambil order', err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="max-w-lg mx-auto px-4 py-12 text-center">Memuat...</div>;

  return (
    <div className="max-w-lg mx-auto px-4 py-12 text-center">
      <div className="text-6xl mb-4">🎉</div>
      <h1 className="text-2xl font-bold mb-2">Pembayaran Berhasil!</h1>
      <p className="text-gray-500 mb-6">
        Pesanan kamu sedang diproses oleh seller.
      </p>

      {order && (
        <div className="border rounded-lg p-4 text-left mb-6">
          <p className="text-sm text-gray-400 mb-1">
            Order #{order.id.slice(0, 8).toUpperCase()}
          </p>
          <p className="font-medium mb-3">
            Total: Rp {order.totalAmount.toLocaleString('id-ID')}
          </p>
          <div className="space-y-1">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>{item.product.name} ×{item.quantity}</span>
                <span>Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-3 justify-center">
        <Link
          to="/my-orders"
          className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
        >
          Lihat Pesanan Saya
        </Link>
        <Link
          to="/products"
          className="border px-6 py-2 rounded hover:bg-gray-50"
        >
          Belanja Lagi
        </Link>
      </div>
    </div>
  );
}