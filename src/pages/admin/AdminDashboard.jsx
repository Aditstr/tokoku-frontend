import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDashboard } from '../../services/admin.service';

const STATUS_LABEL = {
  PENDING:   { text: 'Menunggu Bayar',  color: 'bg-yellow-100 text-yellow-700' },
  PAID:      { text: 'Dibayar',         color: 'bg-blue-100 text-blue-700'    },
  SHIPPED:   { text: 'Dikirim',         color: 'bg-purple-100 text-purple-700'},
  DELIVERED: { text: 'Selesai',         color: 'bg-green-100 text-green-700'  },
  CANCELLED: { text: 'Dibatalkan',      color: 'bg-red-100 text-red-700'      },
};

export default function AdminDashboard() {
  const [stats, setStats]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboard()
      .then((res) => setStats(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="max-w-5xl mx-auto px-4 py-8">Memuat...</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total User',    value: stats.totalUsers,    link: '/admin/users'    },
          { label: 'Total Produk',  value: stats.totalProducts, link: '/admin/products' },
          { label: 'Total Order',   value: stats.totalOrders,   link: '/admin/orders'   },
          { label: 'Total Revenue', value: `Rp ${stats.totalRevenue.toLocaleString('id-ID')}`, link: '/admin/orders' },
        ].map((stat) => (
          <Link
            key={stat.label}
            to={stat.link}
            className="border rounded-lg p-4 hover:shadow-md transition"
          >
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className="text-2xl font-bold text-indigo-600 mt-1">{stat.value}</p>
          </Link>
        ))}
      </div>

      {/* Recent orders */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Order Terbaru</h2>
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Order ID</th>
                <th className="text-left px-4 py-3 font-medium">Buyer</th>
                <th className="text-left px-4 py-3 font-medium">Total</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {stats.recentOrders.map((order) => {
                const status = STATUS_LABEL[order.status];
                return (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </td>
                    <td className="px-4 py-3">{order.buyer.name}</td>
                    <td className="px-4 py-3">
                      Rp {order.totalAmount.toLocaleString('id-ID')}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${status.color}`}>
                        {status.text}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
        {[
          { to: '/admin/users',      label: 'Kelola User'     },
          { to: '/admin/products',   label: 'Kelola Produk'   },
          { to: '/admin/categories', label: 'Kelola Kategori' },
          { to: '/admin/orders',     label: 'Semua Order'     },
        ].map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="border rounded-lg p-3 text-center text-sm hover:bg-indigo-50 hover:border-indigo-300 transition"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}