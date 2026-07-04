import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { logout as logoutApi } from '../services/auth.service';

const navLinks = [
  { to: '/admin/dashboard',   label: 'Dashboard'  },
  { to: '/admin/users',       label: 'Users'      },
  { to: '/admin/products',    label: 'Produk'     },
  { to: '/admin/categories',  label: 'Kategori'   },
  { to: '/admin/orders',      label: 'Orders'     },
];

export default function AdminLayout() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const clearAuth = useAuthStore((state) => state.clearAuth);

  async function handleLogout() {
    try { await logoutApi(); } catch {}
    clearAuth();
    navigate('/login');
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-52 bg-gray-900 text-white flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <Link to="/admin/dashboard" className="font-bold text-lg">
            TokoKu Admin
          </Link>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`block px-3 py-2 rounded text-sm transition ${
                location.pathname === link.to
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="text-sm text-red-400 hover:text-red-300"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 bg-gray-50 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}