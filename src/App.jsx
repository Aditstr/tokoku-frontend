import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import MyOrders from './pages/MyOrders';
import SellerProducts from './pages/seller/SellerProducts';
import SellerProductForm from './pages/seller/SellerProductForm';
import SellerOrders from './pages/seller/SellerOrders';
import OrderSuccess from './pages/OrderSuccess';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          {/* Public routes */}
          <Route path="/" element={<Navigate to="/products" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />

          {/* Buyer routes */}
          <Route path="/cart" element={
            <ProtectedRoute allowedRoles={['BUYER']}><Cart /></ProtectedRoute>
          }/>
          <Route path="/my-orders" element={
            <ProtectedRoute allowedRoles={['BUYER']}><MyOrders /></ProtectedRoute>
          }/>
          <Route
            path="/orders/:id/success"
            element={
              <ProtectedRoute allowedRoles={['BUYER']}>
                <OrderSuccess />
              </ProtectedRoute>
            }
          />

          {/* Seller routes */}
          <Route path="/seller/products" element={
            <ProtectedRoute allowedRoles={['SELLER']}><SellerProducts /></ProtectedRoute>
          }/>
          <Route path="/seller/products/new" element={
            <ProtectedRoute allowedRoles={['SELLER']}><SellerProductForm /></ProtectedRoute>
          }/>
          <Route path="/seller/products/:id/edit" element={
            <ProtectedRoute allowedRoles={['SELLER']}><SellerProductForm /></ProtectedRoute>
          }/>
          <Route path="/seller/orders" element={
            <ProtectedRoute allowedRoles={['SELLER']}><SellerOrders /></ProtectedRoute>
          }/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;