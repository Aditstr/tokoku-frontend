import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyOrders } from '../services/order.service';

const STATUS_LABEL = {
  PENDING:   { text: 'Menunggu Pembayaran', color: 'bg-yellow-100 text-yellow-700' },
  PAID:      { text: 'Dibayar',             color: 'bg-blue-100 text-blue-700'   },
  SHIPPED:   { text: 'Dikirim',             color: 'bg-purple-100 text-purple-700'},
  DELIVERED: { text: 'Selesai',             color: 'bg-green-100 text-green-700' },
  CANCELLED: { text: 'Dibatalkan',          color: 'bg-red-100 text-red-700'     },
};

export default function MyOrders() {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchOrders(); }, []);

  async function fetchOrders() {
    try {
      const res = await getMyOrders();
      setOrders(res.data);
    } catch (err) {
      console.error('Gagal ambil pesanan', err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="max-w-3xl mx-auto px-4 py-8">Memuat pesanan...</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Pesanan Saya</h1>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">Belum ada pesanan</p>
          <Link to="/products" className="text-indigo-600 hover:underline">
            Mulai belanja
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const status = STATUS_LABEL[order.status];
            return (
              <div key={order.id} className="border rounded-lg p-4">

                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-xs text-gray-400">
                      Order #{order.id.slice(0, 8).toUpperCase()}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric', month: 'long', year: 'numeric',
                      })}
                    </p>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${status.color}`}>
                    {status.text}
                  </span>
                </div>

                <div className="space-y-2">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="bg-gray-100 w-12 h-12 rounded flex items-center justify-center shrink-0">
                        {item.product.imageUrl ? (
                          <img
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            className="w-full h-full object-cover rounded"
                          />
                        ) : (
                          <span className="text-xs text-gray-400">No img</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{item.product.name}</p>
                        <p className="text-xs text-gray-500">
                          {item.quantity}x @ Rp {item.price.toLocaleString('id-ID')}
                        </p>
                      </div>
                      <p className="text-sm font-medium">
                        Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t mt-3 pt-3 flex items-center justify-between">
                  <span className="text-sm text-gray-500">Total</span>
                  <span className="font-bold text-indigo-600">
                    Rp {order.totalAmount.toLocaleString('id-ID')}
                  </span>
                </div>

                {order.status === 'PENDING' && order.paymentUrl && (
                  <a
                    href={order.paymentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 block w-full text-center bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 text-sm"
                  >
                    Bayar Sekarang
                  </a>
                )}

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}