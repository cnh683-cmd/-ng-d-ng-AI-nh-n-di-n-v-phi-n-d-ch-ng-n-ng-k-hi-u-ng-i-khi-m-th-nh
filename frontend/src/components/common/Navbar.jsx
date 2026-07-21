import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  const linkClasses = ({ isActive }) =>
    `px-3 py-2 flex items-center rounded-md text-sm font-medium transition-colors ${isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`;

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex space-x-8">
            <NavLink to="/dashboard" className={linkClasses}>Trang chủ</NavLink>
            <NavLink to="/camera" className={linkClasses}>📷 Nhận diện</NavLink>
            
            {/* Đã gộp 2 nút cũ thành 1 nút duy nhất ở đây */}
            <NavLink to="/text-to-sign" className={linkClasses}>🤟 Dịch ký hiệu</NavLink>
            
            <NavLink to="/history" className={linkClasses}>📜 Lịch sử</NavLink>
            <NavLink to="/learning" className={linkClasses}>📖 Học ký hiệu</NavLink>
          </div>
          <div className="flex items-center">
            <NavLink to="/profile" className={linkClasses}>👤 Tài khoản</NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;