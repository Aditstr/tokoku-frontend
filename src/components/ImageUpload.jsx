import { useState, useRef } from 'react';
import { uploadImage } from '../services/upload.service';

export default function ImageUpload({ value, onChange }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError]         = useState('');
  const inputRef                  = useRef();

  async function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    // Validasi ukuran file di frontend (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError('Ukuran file maksimal 2MB');
      return;
    }

    setError('');
    setUploading(true);

    try {
      const res = await uploadImage(file);
      onChange(res.data.url); // kirim URL ke parent component
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Gagal upload gambar');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      {/* Preview gambar kalau sudah ada URL */}
      {value && (
        <div className="mb-3">
          <img
            src={value}
            alt="Preview produk"
            className="w-32 h-32 object-cover rounded-lg border"
          />
        </div>
      )}

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => inputRef.current.click()}
          disabled={uploading}
          className="border border-indigo-600 text-indigo-600 px-4 py-2 rounded hover:bg-indigo-50 text-sm disabled:opacity-50"
        >
          {uploading ? 'Mengupload...' : value ? 'Ganti Gambar' : 'Upload Gambar'}
        </button>

        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="text-red-500 text-sm hover:underline"
          >
            Hapus Gambar
          </button>
        )}
      </div>

      {/* Input file tersembunyi */}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />

      {error && (
        <p className="text-red-500 text-xs mt-1">{error}</p>
      )}

      <p className="text-xs text-gray-400 mt-1">
        Format: JPG, PNG, WebP. Maksimal 2MB.
      </p>
    </div>
  );
}