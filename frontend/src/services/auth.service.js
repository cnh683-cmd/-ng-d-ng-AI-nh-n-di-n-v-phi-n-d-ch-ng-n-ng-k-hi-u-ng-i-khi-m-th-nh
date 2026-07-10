import apiClient from './api.client';

// Mock users (giả lập)
const MOCK_USERS = [
  { id: '1', email: 'admin@example.com', password: 'admin123', fullName: 'Admin User', role: 'admin', isActive: true },
  { id: '2', email: 'user@example.com', password: 'user123', fullName: 'Normal User', role: 'user', isActive: true },
];

export const login = async (email, password) => {
  // Giả lập gọi API
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = MOCK_USERS.find(u => u.email === email && u.password === password);
      if (user) {
        // Trả về token giả và thông tin user
        const token = 'mock-jwt-token-' + user.id;
        localStorage.setItem('access_token', token);
        resolve({ token, user: { ...user, password: undefined } });
      } else {
        reject(new Error('Email hoặc mật khẩu không đúng'));
      }
    }, 500);
  });
};

export const register = async (email, password, fullName) => {
  // Giả lập đăng ký
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const exists = MOCK_USERS.find(u => u.email === email);
      if (exists) {
        reject(new Error('Email đã được sử dụng'));
      } else {
        const newUser = {
          id: Date.now().toString(),
          email,
          password,
          fullName,
          role: 'user',
          isActive: true,
        };
        MOCK_USERS.push(newUser);
        resolve({ message: 'Đăng ký thành công', user: { ...newUser, password: undefined } });
      }
    }, 500);
  });
};

export const logout = () => {
  localStorage.removeItem('access_token');
};

export const getCurrentUser = () => {
  // Giả lập lấy user từ token (thực tế decode token)
  const token = localStorage.getItem('access_token');
  if (!token) return null;
  // Giả sử token là mock-jwt-token-1 hoặc 2
  const userId = token.split('-')[3];
  const user = MOCK_USERS.find(u => u.id === userId);
  if (user) {
    return { ...user, password: undefined };
  }
  return null;
};