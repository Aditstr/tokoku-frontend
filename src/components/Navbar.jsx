import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import useCartStore from '../store/cartStore';
import { logout as logoutApi } from '../services/auth.service';

export default function Navbar() {
  const navigate = useNavigate();
  const { user, clearAuth } = useAuthStore();
  const cartCount = useCartStore((state) => state.getItemCount());

  async function handleLogout() {
    try {
      await logoutApi();
    } catch {
    } finally {
      clearAuth();
      navigate('/login');
    }
  }

  return (
    <nav className="bg-white border-b shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">

        <Link to="/products" className="text-xl font-bold text-indigo-600">
          TokoKu
        </Link>

        <div className="flex items-center gap-4">
          <Link to="/products" className="text-sm text-gray-600 hover:text-indigo-600">
            Produk
          </Link>

          {/* Menu khusus BUYER */}
          {user?.role === 'BUYER' && (
            <>
              <Link to="/cart" className="text-sm text-gray-600 hover:text-indigo-600 relative">
                Keranjang
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-3 bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
              <Link to="/my-orders" className="text-sm text-gray-600 hover:text-indigo-600">
                Pesanan Saya
              </Link>
            </>
          )}

          {/* Menu khusus SELLER */}
          {user?.role === 'SELLER' && (
            <>
              <Link to="/seller/products" className="text-sm text-gray-600 hover:text-indigo-600">
                Produk Saya
              </Link>
              <Link to="/seller/orders" className="text-sm text-gray-600 hover:text-indigo-600">
                Pesanan Masuk
              </Link>
            </>
          )}

          {/* Auth section */}
          {user ? (
            <>
              <span className="text-sm text-gray-500 border-l pl-4">
                Hai, {user.name}
              </span>
              <button
                onClick={handleLogout}
                className="text-sm text-red-600 hover:underline"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-gray-600 hover:text-indigo-600">
                Login
              </Link>
              <Link
                to="/register"
                className="text-sm bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
              >
                Daftar
              </Link>
            </>
          )}
        </div>

      </div>
    </nav>
  );
}