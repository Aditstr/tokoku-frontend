import { useEffect, useState } from 'react';
import { getSellerOrders, updateOrderStatus } from '../../services/order.service';

const STATUS_LABEL = {
  PENDING:   { text: 'Menunggu Bayar',  color: 'bg-yellow-100 text-yellow-700' },
  PAID:      { text: 'Sudah Dibayar',   color: 'bg-blue-100 text-blue-700'    },
  SHIPPED:   { text: 'Dikirim',         color: 'bg-purple-100 text-purple-700'},
  DELIVERED: { text: 'Selesai',         color: 'bg-green-100 text-green-700'  },
  CANCELLED: { text: 'Dibatalkan',      color: 'bg-red-100 text-red-700'      },
};

const NEXT_STATUS = {
  PAID:    'SHIPPED',
  SHIPPED: 'DELIVERED',
};

const NEXT_STATUS_LABEL = {
  SHIPPED:   'Tandai Dikirim',
  DELIVERED: 'Tandai Selesai',
};

export default function SellerOrders() {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchOrders(); }, []);

  async function fetchOrders() {
    try {
      const res = await getSellerOrders();
      setOrders(res.data);
    } catch (err) {
      console.error('Gagal ambil pesanan', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateStatus(orderId, newStatus) {
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) => o.id === orderId ? { ...o, status: newStatus } : o)
      );
    } catch (err) {
      alert(err.response?.data?.error?.message || 'Gagal update status');
    }
  }

  if (loading) return <div className="max-w-4xl mx-auto px-4 py-8">Memuat pesanan...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Pesanan Masuk</h1>

      {orders.length === 0 ? (
        <div className="text-center py-12 border rounded-lg">
          <p className="text-gray-500">Belum ada pesanan masuk</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const status    = STATUS_LABEL[order.status];
            const nextStatus = NEXT_STATUS[order.status];

            return (
              <div key={order.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-medium">
                      Order #{order.id.slice(0, 8).toUpperCase()}
                    </p>
                    <p className="text-sm text-gray-500">
                      {order.buyer?.name} — {order.buyer?.email}
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

                <div className="space-y-2 mb-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-sm">
                      <span>{item.product?.name}</span>
                      <span className="text-gray-500">
                        {item.quantity}x Rp {item.price.toLocaleString('id-ID')}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between border-t pt-3">
                  <span className="font-bold">
                    Total: Rp {order.totalAmount.toLocaleString('id-ID')}
                  </span>

                  {nextStatus && (
                    <button
                      onClick={() => handleUpdateStatus(order.id, nextStatus)}
                      className="bg-indigo-600 text-white text-sm px-4 py-2 rounded hover:bg-indigo-700"
                    >
                      {NEXT_STATUS_LABEL[nextStatus]}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}