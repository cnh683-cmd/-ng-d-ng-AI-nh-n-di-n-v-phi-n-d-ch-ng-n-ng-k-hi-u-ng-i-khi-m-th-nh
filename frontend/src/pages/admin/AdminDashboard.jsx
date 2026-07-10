import React from 'react';
import { FaUsers, FaBook, FaVideo, FaChartLine } from 'react-icons/fa';

const AdminDashboard = () => {
  // Giả lập số liệu
  const stats = [
    { title: 'Tổng người dùng', value: 12, icon: <FaUsers />, color: 'bg-blue-500' },
    { title: 'Từ điển', value: 45, icon: <FaBook />, color: 'bg-green-500' },
    { title: 'Lượt phiên dịch', value: 230, icon: <FaVideo />, color: 'bg-purple-500' },
    { title: 'Hiệu suất AI', value: '92%', icon: <FaChartLine />, color: 'bg-orange-500' },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Tổng quan hệ thống</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6 flex items-center">
            <div className={`${stat.color} text-white rounded-full p-3 mr-4`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-sm text-gray-500">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
      {/* Có thể thêm biểu đồ */}
    </div>
  );
};

export default AdminDashboard;