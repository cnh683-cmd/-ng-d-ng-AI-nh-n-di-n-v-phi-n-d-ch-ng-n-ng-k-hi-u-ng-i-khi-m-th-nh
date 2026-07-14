import apiClient from './api.client';

export const login = async (email, password) => {
  try {
    // Backend FastAPI (OAuth2PasswordRequestForm) yêu cầu gửi data dưới dạng Form URL Encoded
    const params = new URLSearchParams();
    params.append('username', email);
    params.append('password', password);

    // Gọi API thật xuống Backend
    const response = await apiClient.post('/auth/login', params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    const token = response.data.access_token;
    localStorage.setItem('access_token', token);

    // Sau khi có token, gọi thêm API lấy thông tin Profile của User đó
    const userResponse = await apiClient.get('/profile/me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return { token, user: userResponse.data };
  } catch (error) {
    // Bắt lỗi từ Backend trả về (nếu sai email/pass)
    const errorMsg = error.response?.data?.detail || 'Đăng nhập thất bại. Vui lòng thử lại.';
    throw new Error(errorMsg);
  }
};

export const register = async (email, password, fullName) => {
  try {
    // Gọi API đăng ký thật xuống Backend
    const response = await apiClient.post('/auth/register', {
      email: email,
      password: password,
      full_name: fullName
    });
    return response.data;
  } catch (error) {
    const errorMsg = error.response?.data?.detail || 'Đăng ký thất bại. Email có thể đã tồn tại.';
    throw new Error(errorMsg);
  }
};

export const logout = () => {
  localStorage.removeItem('access_token');
};

export const getCurrentUser = async () => {
  const token = localStorage.getItem('access_token');
  if (!token) return null;

  try {
    // Lấy thông tin user thật từ SQL Server thông qua API
    const response = await apiClient.get('/profile/me');
    return response.data;
  } catch (error) {
    // Nếu token hết hạn hoặc lỗi, tự động xóa đi
    localStorage.removeItem('access_token');
    return null;
  }
};