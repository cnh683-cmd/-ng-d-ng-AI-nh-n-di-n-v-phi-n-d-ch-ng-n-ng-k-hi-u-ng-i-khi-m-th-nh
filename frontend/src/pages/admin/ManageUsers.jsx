import React from 'react';
import { useUserManagement } from '../../hooks/admin/useUserManagement';
import UserTable from '../../components/admin/UserTable';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ManageUsers = () => {
  const { users, loading, handleToggleStatus, handleDeleteUser } = useUserManagement();

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Quản lý người dùng</h1>
      <UserTable
        users={users}
        onToggleStatus={handleToggleStatus}
        onDelete={handleDeleteUser}
      />
    </div>
  );
};

export default ManageUsers;