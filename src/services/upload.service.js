import api from './api';

export async function uploadImage(file) {
  const formData = new FormData();
  formData.append('image', file);

  const res = await api.post('/upload/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return res.data;
}