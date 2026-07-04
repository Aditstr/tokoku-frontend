import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../services/product.service';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchProducts();
  }, [search]);

  async function fetchProducts() {
    setLoading(true);
    try {
      const res = await getProducts({ search });
      setProducts(res.data);
    } catch (err) {
      console.error('Gagal ambil produk', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Semua Produk</h1>

      <input
        type="text"
        placeholder="Cari produk..."
        className="border rounded px-4 py-2 w-full max-w-sm mb-6"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? (
        <p>Memuat produk...</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <Link
              key={product.id}
              to={`/products/${product.id}`}
              className="border rounded-lg p-4 hover:shadow-md transition block"
            >
              <div className="bg-gray-100 h-32 rounded mb-2 flex items-center justify-center">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="h-full object-cover rounded"
                  />
                ) : (
                  <span className="text-gray-400 text-sm">Tidak ada gambar</span>
                )}
              </div>
              <h3 className="font-medium text-sm">{product.name}</h3>
              <p className="text-indigo-600 font-bold">
                Rp {product.price.toLocaleString('id-ID')}
              </p>
              <p className="text-xs text-gray-500">Stok: {product.stock}</p>
            </Link>
          ))}
        </div>
      )}

      {!loading && products.length === 0 && (
        <p className="text-gray-500 text-center py-8">Belum ada produk</p>
      )}
    </div>
  );
}