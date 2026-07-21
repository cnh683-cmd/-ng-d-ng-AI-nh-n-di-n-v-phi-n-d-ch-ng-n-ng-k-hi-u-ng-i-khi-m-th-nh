import React, { useState, useEffect } from 'react';
import { FaUsers, FaBook, FaVideo, FaChartLine } from 'react-icons/fa';
import { getSystemStats } from '../../services/admin/dashboard.service'; // Đảm bảo đường dẫn này khớp với project của ông

const AdminDashboard = () => {
  // State lưu dữ liệu từ Backend
  const [dashboardData, setDashboardData] = useState({
    total_users: 0,
    total_dictionary: 45, // Tạm thời để số 45 vì API của ông chưa đếm từ điển
    total_histories: 0,
    total_models: 0,
  });
  const [loading, setLoading] = useState(true);

  // Gọi API lấy dữ liệu thật
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getSystemStats();
        // data từ Backend trả về: { total_users, total_histories, total_models }
        setDashboardData(prev => ({ ...prev, ...data }));
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu tổng quan:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  // Ánh xạ dữ liệu thật vào cấu trúc mảng cũ để render không bị vỡ giao diện
  const stats = [
    { title: 'Tổng người dùng', value: dashboardData.total_users, icon: <FaUsers />, color: 'bg-blue-500' },
    { title: 'Từ điển', value: dashboardData.total_dictionary, icon: <FaBook />, color: 'bg-green-500' },
    { title: 'Lượt phiên dịch', value: dashboardData.total_histories, icon: <FaVideo />, color: 'bg-purple-500' },
    { title: 'Số lượng AI Models', value: dashboardData.total_models, icon: <FaChartLine />, color: 'bg-orange-500' },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Tổng quan hệ thống</h1>
      
      {loading ? (
        <p className="text-gray-500">Đang tải dữ liệu...</p>
      ) : (
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
      )}
    </div>
  );
};

export default AdminDashboard;