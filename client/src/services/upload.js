import api from './api';

export const uploadFile = async (file, folder = 'files') => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', `frostchat/${folder}`);

  const response = await api.post('/upload/file', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

  return response.data.data;
};

export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);

  const response = await api.post('/upload/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

  return response.data.data;
};

export const uploadAvatar = async (file) => {
  const formData = new FormData();
  formData.append('avatar', file);

  const response = await api.put('/users/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

  return response.data.data;
};

export const deleteFile = async (publicId, resourceType = 'image') => {
  await api.delete('/upload/file', {
    data: { publicId, resourceType }
  });
};
