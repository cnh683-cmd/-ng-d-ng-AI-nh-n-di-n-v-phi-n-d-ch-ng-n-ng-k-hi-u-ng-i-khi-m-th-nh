import React, { useState, useEffect } from 'react';
import { getUsers, toggleUserStatus, deleteUser, updateUser } from '../../services/admin/user.service';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { FaLock, FaUnlock, FaTrash, FaEdit, FaCheck, FaTimes } from 'react-icons/fa';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State quản lý việc SỬA inline
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error("Lỗi khi tải user:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggle = async (userId, currentStatus) => {
    try {
      await toggleUserStatus(userId);
      setUsers(users.map(u => 
        u.id === userId ? { ...u, is_active: !u.is_active } : u
      ));
      alert(`Đã ${currentStatus ? "Khóa" : "Mở khóa"} tài khoản thành công!`);
    } catch (error) {
      alert("Có lỗi xảy ra khi cập nhật trạng thái!");
      console.error(error);
    }
  };

  // Bật chế độ sửa
  const startEdit = (user) => {
    setEditingId(user.id);
    setEditName(user.full_name || '');
  };

  // Lưu dữ liệu cập nhật
  const handleSaveUpdate = async (userId) => {
    try {
      await updateUser(userId, { full_name: editName });
      setUsers(users.map(u => 
        u.id === userId ? { ...u, full_name: editName } : u
      ));
      setEditingId(null);
    } catch (error) {
      alert("Lỗi khi lưu thông tin người dùng!");
      console.error(error);
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm("Ông có chắc chắn muốn xóa user này không?")) {
      try {
        await deleteUser(userId);
        setUsers(users.filter(u => u.id !== userId));
        alert("Đã xóa user thành công!");
      } catch (error) {
        alert("Có lỗi khi xóa user!");
      }
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Quản lý người dùng</h1>
      
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Họ tên</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vai trò</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map(user => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {/* Hiển thị ô input nếu đang ở chế độ sửa */}
                    {editingId === user.id ? (
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="border border-blue-400 rounded px-2 py-1 focus:outline-none"
                        autoFocus
                      />
                    ) : (
                      user.full_name || "Chưa cập nhật"
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800`}>
                      {user.role === "admin" ? "Admin" : "User"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs ${user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {user.is_active ? 'Hoạt động' : 'Bị khóa'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-4 items-center">
                    
                    {/* Đổi nút theo chế độ xem/sửa */}
                    {editingId === user.id ? (
                      <>
                        <button onClick={() => handleSaveUpdate(user.id)} className="text-green-600 hover:text-green-900" title="Lưu">
                          <FaCheck size={16} />
                        </button>
                        <button onClick={() => setEditingId(null)} className="text-gray-500 hover:text-gray-900" title="Hủy">
                          <FaTimes size={16} />
                        </button>
                      </>
                    ) : (
                      <button onClick={() => startEdit(user)} className="text-blue-600 hover:text-blue-900" title="Sửa tên">
                        <FaEdit size={16} />
                      </button>
                    )}

                    {/* Nút Khóa / Mở Khóa */}
                    <button 
                      onClick={() => handleToggle(user.id, user.is_active)} 
                      className={`${user.is_active ? 'text-yellow-600 hover:text-yellow-900' : 'text-green-600 hover:text-green-900'}`}
                      title={user.is_active ? "Khóa tài khoản" : "Mở khóa tài khoản"}
                    >
                      {user.is_active ? <FaLock size={16} /> : <FaUnlock size={16} />}
                    </button>
                    
                    {/* Nút Xóa */}
                    <button onClick={() => handleDelete(user.id)} className="text-red-600 hover:text-red-900" title="Xóa">
                      <FaTrash size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;