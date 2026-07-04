import { useEffect, useState } from 'react';
import {
  getAdminCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../../services/admin.service';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [form, setForm]             = useState({ name: '', slug: '' });
  const [editId, setEditId]         = useState(null);
  const [error, setError]           = useState('');

  useEffect(() => { fetchCategories(); }, []);

  async function fetchCategories() {
    try {
      const res = await getAdminCategories();
      setCategories(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // Auto-generate slug dari name
  function handleNameChange(e) {
    const name = e.target.value;
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    setForm({ name, slug });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      if (editId) {
        await updateCategory(editId, form);
      } else {
        await createCategory(form);
      }
      setForm({ name: '', slug: '' });
      setEditId(null);
      fetchCategories();
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Gagal simpan kategori');
    }
  }

  function handleEdit(cat) {
    setEditId(cat.id);
    setForm({ name: cat.name, slug: cat.slug });
    setError('');
  }

  async function handleDelete(id, name) {
    if (!confirm(`Hapus kategori "${name}"?`)) return;
    try {
      await deleteCategory(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      alert(err.response?.data?.error?.message || 'Gagal hapus kategori');
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Kelola Kategori</h1>

      {/* Form tambah/edit */}
      <div className="border rounded-lg p-4 mb-6">
        <h2 className="font-medium mb-3">
          {editId ? 'Edit Kategori' : 'Tambah Kategori Baru'}
        </h2>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded mb-3">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="flex gap-3 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Nama</label>
            <input
              required
              value={form.name}
              onChange={handleNameChange}
              className="w-full border rounded px-3 py-2 text-sm"
              placeholder="Elektronik"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Slug</label>
            <input
              required
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              className="w-full border rounded px-3 py-2 text-sm"
              placeholder="elektronik"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 text-sm"
            >
              {editId ? 'Update' : 'Tambah'}
            </button>
            {editId && (
              <button
                type="button"
                onClick={() => { setEditId(null); setForm({ name: '', slug: '' }); }}
                className="border px-4 py-2 rounded text-sm"
              >
                Batal
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Daftar kategori */}
      {loading ? (
        <p>Memuat...</p>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Nama</th>
                <th className="text-left px-4 py-3 font-medium">Slug</th>
                <th className="text-left px-4 py-3 font-medium">Jumlah Produk</th>
                <th className="text-left px-4 py-3 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{cat.name}</td>
                  <td className="px-4 py-3 text-gray-500">{cat.slug}</td>
                  <td className="px-4 py-3">{cat._count.products}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(cat)}
                        className="text-indigo-600 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id, cat.name)}
                        className="text-red-600 hover:underline"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}