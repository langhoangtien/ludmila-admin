import axiosInstance, { endpoints } from 'src/utils/axios';

export const uploadFile = async (selectedFile) => {
  const formData = new FormData();
  formData.append('file', selectedFile);
  return axiosInstance.post(endpoints.file, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const uploadFiles = async (selectedFiles) => {
  const formData = new FormData();
  selectedFiles.forEach((file) => {
    formData.append('files', file);
  });
  return axiosInstance.post(`${endpoints.file}/upload-multiple`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
