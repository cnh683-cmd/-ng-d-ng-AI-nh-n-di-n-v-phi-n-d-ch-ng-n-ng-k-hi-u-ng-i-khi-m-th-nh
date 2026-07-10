import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { FaVideo, FaKeyboard, FaHistory, FaBook, FaMicrophone } from 'react-icons/fa';

const DashboardPage = () => {
  const { user } = useAuth();

  const features = [
    { icon: <FaVideo className="text-3xl" />, title: 'Camera nhận diện', desc: 'Dùng camera để nhận diện ký hiệu', link: '/camera' },
    { icon: <FaKeyboard className="text-3xl" />, title: 'Văn bản → Ký hiệu', desc: 'Nhập văn bản, xem ký hiệu', link: '/text-to-sign' },
    { icon: <FaMicrophone className="text-3xl" />, title: 'Văn bản → Giọng nói', desc: 'Đọc văn bản thành tiếng', link: '/text-to-speech' },
    { icon: <FaHistory className="text-3xl" />, title: 'Lịch sử', desc: 'Xem lịch sử phiên dịch', link: '/history' },
    { icon: <FaBook className="text-3xl" />, title: 'Học ký hiệu', desc: 'Học ngôn ngữ ký hiệu', link: '/learning' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Chào mừng, {user?.fullName}!</h1>
        <p className="text-gray-600">Chọn chức năng để bắt đầu sử dụng dịch vụ phiên dịch ngôn ngữ ký hiệu.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((item, index) => (
          <Link key={index} to={item.link} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition flex flex-col items-center text-center">
            <div className="text-primary-500 mb-3">{item.icon}</div>
            <h3 className="text-xl font-semibold text-gray-900">{item.title}</h3>
            <p className="text-gray-500">{item.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;