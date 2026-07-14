import apiClient from '../api.client';

// Gọi API lấy danh sách lịch sử của người dùng đang đăng nhập
export const getHistory = async () => {
  // Không cần truyền userId vì Backend tự động lấy qua Token
  const response = await apiClient.get('/history');
  return response.data;
};

// Gọi API lưu lịch sử mới (Trỏ tới endpoint đã định nghĩa trong translate.py)
export const addHistory = async (historyItem) => {
  const response = await apiClient.post('/save-history', historyItem);
  return response.data;
};