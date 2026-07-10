import apiClient from '../api.client';

// Mock dữ liệu cho admin
let mockUsers = [
  { id: '1', email: 'admin@example.com', fullName: 'Admin User', role: 'admin', isActive: true },
  { id: '2', email: 'user@example.com', fullName: 'Normal User', role: 'user', isActive: true },
  { id: '3', email: 'john@example.com', fullName: 'John Doe', role: 'user', isActive: false },
];

export const getUsers = async () => {
  // Giả lập API call
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockUsers), 300);
  });
};

export const toggleUserStatus = async (userId) => {
  return new Promise((resolve, reject) => {
    const user = mockUsers.find(u => u.id === userId);
    if (user) {
      user.isActive = !user.isActive;
      resolve(user);
    } else {
      reject(new Error('User not found'));
    }
  });
};

export const deleteUser = async (userId) => {
  return new Promise((resolve, reject) => {
    const index = mockUsers.findIndex(u => u.id === userId);
    if (index !== -1) {
      mockUsers.splice(index, 1);
      resolve({ message: 'Deleted' });
    } else {
      reject(new Error('User not found'));
    }
  });
};