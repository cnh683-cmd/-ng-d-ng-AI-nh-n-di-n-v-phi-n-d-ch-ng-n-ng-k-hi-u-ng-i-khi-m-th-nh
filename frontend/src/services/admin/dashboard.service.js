import apiClient from '../api.client';

export const getSystemStats = async () => {
  const response = await apiClient.get('/admin/stats');
  return response.data;
};