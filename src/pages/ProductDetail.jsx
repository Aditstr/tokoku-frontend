import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProductById } from '../services/product.service';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);
  const { user } = useAuthStore();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  async function fetchProduct() {
    setLoading(true);
    try {
      const res = await getProductById(id);
      setProduct(res.data);
    } catch (err) {
      console.error('Gagal ambil produk', err);
    } finally {
      setLoading(false);
    }
  }

  function handleAddToCart() {
    if (!user) {
      navigate('/login');
      return;
    }
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  if (loading) {
    return <div className="max-w-4xl mx-auto px-4 py-8">Memuat produk...</div>;
  }

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <p>Produk tidak ditemukan.</p>
        <Link to="/products" className="text-indigo-600 hover:underline">
          Kembali ke daftar produk
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link to="/products" className="text-sm text-indigo-600 hover:underline mb-4 inline-block">
        ← Kembali ke daftar produk
      </Link>

      <div className="grid md:grid-cols-2 gap-8 mt-4">
        <div className="bg-gray-100 rounded-lg h-80 flex items-center justify-center">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} className="h-full object-cover rounded-lg" />
          ) : (
            <span className="text-gray-400">Tidak ada gambar</span>
          )}
        </div>

        <div>
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <p className="text-sm text-gray-500 mt-1">
            Dijual oleh {product.seller?.name}
          </p>

          <p className="text-3xl font-bold text-indigo-600 mt-4">
            Rp {product.price.toLocaleString('id-ID')}
          </p>

          <p className="text-sm text-gray-500 mt-1">
            Stok tersedia: {product.stock}
          </p>

          <div className="mt-4">
            <h3 className="font-medium mb-1">Deskripsi</h3>
            <p className="text-gray-600 text-sm">
              {product.description || 'Tidak ada deskripsi'}
            </p>
          </div>

          {product.stock > 0 ? (
            <div className="mt-6 flex items-center gap-4">
              <div className="flex items-center border rounded">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-2 hover:bg-gray-100"
                >
                  −
                </button>
                <span className="px-4">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  className="px-3 py-2 hover:bg-gray-100"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="flex-1 bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
              >
                {added ? '✓ Ditambahkan!' : 'Tambah ke Keranjang'}
              </button>
            </div>
          ) : (
            <p className="mt-6 text-red-600 font-medium">Stok habis</p>
          )}
        </div>
      </div>
    </div>
  );
}