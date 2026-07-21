import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaUsers, FaBook, FaChartBar, FaCog } from 'react-icons/fa';

const Sidebar = () => {
  const linkClasses = ({ isActive }) =>
    `flex items-center space-x-3 px-4 py-3 rounded-lg transition ${isActive ? 'bg-primary-600 text-white' : 'text-gray-700 hover:bg-gray-200'}`;

  return (
    <aside className="w-64 bg-white shadow-md h-screen sticky top-0 overflow-y-auto">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold text-primary-700">Admin Panel</h2>
      </div>
      <nav className="p-4 space-y-2">
        <NavLink to="/admin/dashboard" className={linkClasses}>
          <FaChartBar />
          <span>Tổng quan</span>
        </NavLink>
        <NavLink to="/admin/users" className={linkClasses}>
          <FaUsers />
          <span>Quản lý người dùng</span>
        </NavLink>
        <NavLink to="/admin/dictionary" className={linkClasses}>
          <FaBook />
          <span>Quản lý từ điển</span>
        </NavLink>
        <NavLink to="/admin/feedback" className={linkClasses}>
          <FaCog />
          <span>Phản hồi</span>
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;