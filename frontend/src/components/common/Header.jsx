import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FaSignOutAlt, FaUser } from 'react-icons/fa';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-md py-3 px-6 flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <Link to="/" className="text-2xl font-bold text-primary-600">SignBridge</Link>
        <span className="text-sm text-gray-500">Phiên dịch ngôn ngữ ký hiệu cho người khiếm thị</span>
      </div>
      <div className="flex items-center space-x-4">
        {user ? (
          <>
            <span className="text-gray-700">
              <FaUser className="inline mr-1" /> {user.fullName}
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md transition"
            >
              <FaSignOutAlt />
              <span>Đăng xuất</span>
            </button>
          </>
        ) : (
          <Link to="/login" className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-md">Đăng nhập</Link>
        )}
      </div>
    </header>
  );
};

export default Header;