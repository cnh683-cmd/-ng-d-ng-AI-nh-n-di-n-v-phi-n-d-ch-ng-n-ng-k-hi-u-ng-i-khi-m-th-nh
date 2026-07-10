import { useState, useEffect } from 'react';
import { getUsers, toggleUserStatus, deleteUser } from '../../services/admin/user.service';

export const useUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Lỗi lấy danh sách user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (userId) => {
    try {
      const updated = await toggleUserStatus(userId);
      setUsers(prev => prev.map(u => u.id === userId ? updated : u));
    } catch (error) {
      console.error('Lỗi thay đổi trạng thái:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Bạn có chắc muốn xóa user này?')) return;
    try {
      await deleteUser(userId);
      setUsers(prev => prev.filter(u => u.id !== userId));
    } catch (error) {
      console.error('Lỗi xóa user:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return { users, loading, fetchUsers, handleToggleStatus, handleDeleteUser };
};