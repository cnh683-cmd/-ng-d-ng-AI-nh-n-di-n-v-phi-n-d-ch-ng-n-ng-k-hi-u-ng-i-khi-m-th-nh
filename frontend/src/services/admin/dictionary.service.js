import apiClient from '../api.client';

export const getDictionary = async () => {
  const response = await apiClient.get('/admin/dictionary');
  return response.data;
};

export const addDictionaryItem = async (item) => {
  const response = await apiClient.post('/admin/dictionary', item);
  return response.data;
};

export const updateDictionaryItem = async (id, updated) => {
  const response = await apiClient.put(`/admin/dictionary/${id}`, updated);
  return response.data;
};

export const deleteDictionaryItem = async (id) => {
  const response = await apiClient.delete(`/admin/dictionary/${id}`);
  return response.data;
};