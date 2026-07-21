import apiClient from '../api.client';

export const getUsers = async () => {
  const response = await apiClient.get('/admin/users'); 
  return response.data;
};

export const toggleUserStatus = async (userId) => {
  const response = await apiClient.patch(`/admin/users/${userId}/toggle`);
  return response.data;
};

export const deleteUser = async (userId) => {
  const response = await apiClient.delete(`/admin/users/${userId}`);
  return response.data;
};

// --- THÊM HÀM NÀY ---
export const updateUser = async (userId, updatedData) => {
  const response = await apiClient.put(`/admin/users/${userId}`, updatedData);
  return response.data;
};