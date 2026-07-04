import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, accessToken } = useAuthStore();

  // Belum login sama sekali
  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  // Sudah login tapi role tidak sesuai (misal buyer coba akses halaman seller)
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/products" replace />;
  }

  return children;
}