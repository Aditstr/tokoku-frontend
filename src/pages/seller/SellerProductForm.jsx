import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  createProduct,
  updateProduct,
  getProductById,
} from '../../services/product.service';
import ImageUpload from '../../components/ImageUpload';
import api from '../../services/api';

export default function SellerProductForm() {
  const navigate = useNavigate();
  const { id }   = useParams();
  const isEdit   = Boolean(id);

  const [form, setForm] = useState({
    name: '', description: '', price: '', stock: '', categoryId: '', imageUrl: '',
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState('');

  useEffect(() => {
    fetchCategories();
    if (isEdit) fetchProduct();
  }, []);

  async function fetchCategories() {
    try {
      const res = await api.get('/products?limit=100');
      const cats = res.data.data.map((p) => p.category).filter(Boolean);
      const unique = cats.filter(
        (cat, idx, arr) => arr.findIndex((c) => c.id === cat.id) === idx
      );
      setCategories(unique);
    } catch (err) {
      console.error('Gagal ambil kategori', err);
    }
  }

  async function fetchProduct() {
    try {
      const res = await getProductById(id);
      const p   = res.data;
      setForm({
        name:        p.name,
        description: p.description || '',
        price:       p.price,
        stock:       p.stock,
        categoryId:  p.category?.id || '',
        imageUrl:    p.imageUrl || '',
      });
    } catch (err) {
      console.error('Gagal ambil produk', err);
    }
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        name:        form.name,
        description: form.description,
        price:       Number(form.price),
        stock:       Number(form.stock),
        categoryId:  form.categoryId,
        imageUrl:    form.imageUrl || undefined,
      };

      if (isEdit) {
        await updateProduct(id, payload);
      } else {
        await createProduct(payload);
      }

      navigate('/seller/products');
    } catch (err) {
      const details = err.response?.data?.error?.details;
      setError(
        details?.[0]?.message ||
        err.response?.data?.error?.message ||
        'Gagal simpan produk'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        {isEdit ? 'Edit Produk' : 'Tambah Produk Baru'}
      </h1>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm p-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nama Produk *</label>
          <input
            name="name" required
            value={form.name} onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            placeholder="Laptop Gaming ASUS"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Deskripsi</label>
          <textarea
            name="description"
            value={form.description} onChange={handleChange}
            className="w-full border rounded px-3 py-2 h-24 resize-none"
            placeholder="Deskripsi produk..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Harga (Rp) *</label>
            <input
              name="price" type="number" required min="0"
              value={form.price} onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              placeholder="50000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Stok *</label>
            <input
              name="stock" type="number" required min="0"
              value={form.stock} onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              placeholder="10"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Kategori *</label>
          {categories.length > 0 ? (
            <select
              name="categoryId" required
              value={form.categoryId} onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Pilih kategori</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          ) : (
            <p className="text-sm text-red-500">
              Belum ada kategori. Tambah dulu lewat Prisma Studio.
            </p>
          )}
        </div>

        {/* Komponen upload gambar — gantikan field URL */}
        <div>
          <label className="block text-sm font-medium mb-1">Gambar Produk</label>
          <ImageUpload
            value={form.imageUrl}
            onChange={(url) => setForm({ ...form, imageUrl: url })}
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit" disabled={loading}
            className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? 'Menyimpan...' : isEdit ? 'Update Produk' : 'Tambah Produk'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/seller/products')}
            className="border px-6 py-2 rounded hover:bg-gray-50"
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
}