import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import apiClient from '../../services/api.client'; 

const ProfilePage = () => {
  const { user } = useAuth();
  
  // Quản lý state cho toàn bộ form
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    address: '',
    bio: '',
    avatar: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Đổ dữ liệu user hiện tại vào form
  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || user.fullName || '',
        email: user.email || '',
        phone: user.phone || '',
        date_of_birth: user.date_of_birth || '',
        address: user.address || '',
        bio: user.bio || '',
        avatar: user.avatar || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Hàm xử lý khi chọn file ảnh đại diện và gửi ngay lên Backend
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setMessage('❌ Vui lòng chỉ tải lên file có định dạng hình ảnh.');
      return;
    }

    const uploadData = new FormData();
    // Đã sửa: Khớp đúng key 'file' giống hệt khai báo ở Backend
    uploadData.append('file', file); 

    setIsLoading(true);
    setMessage('');

    try {
      // Đã sửa: Ép header thành multipart/form-data để đè lên config JSON mặc định của apiClient
      const response = await apiClient.post('/profile/upload-avatar', uploadData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      // Lấy link tương đối trả về, cập nhật vào form state
      const uploadedUrl = response.data.avatar_url;
      setFormData(prev => ({ ...prev, avatar: uploadedUrl }));
      setMessage('📸 Ảnh đại diện đã được tải lên Server tạm thời! Hãy bấm nút "Lưu cập nhật" bên dưới để hoàn tất lưu thông tin.');
    } catch (error) {
      console.error('Lỗi upload ảnh:', error);
      setMessage('❌ Không thể tải ảnh lên Server.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    
    try {
      // Gọi API cập nhật thông tin (lúc này trường avatar chỉ là chuỗi text ngắn)
      await apiClient.put('/profile/me', {
        full_name: formData.full_name,
        phone: formData.phone,
        date_of_birth: formData.date_of_birth,
        address: formData.address,
        bio: formData.bio,
        avatar: formData.avatar
      });
      
      setMessage('🎉 Cập nhật thông tin thành công!');
    } catch (error) {
      console.error('Lỗi cập nhật:', error);
      setMessage('❌ Cập nhật thất bại. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  // Hàm chuyển đổi đường dẫn tương đối thành link ảnh tuyệt đối có thể hiển thị
  const getAvatarUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http') || path.startsWith('data:')) {
      return path;
    }
    return `http://localhost:8000${path}`;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Thông tin cá nhân</h1>
      
      <div className="bg-white shadow-sm border border-gray-100 rounded-2xl p-8">
        {message && (
          <div className={`mb-6 p-4 rounded-lg text-center font-medium ${message.includes('thành công') || message.includes('tạm thời') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-10">
          
          {/* CỘT TRÁI: AVATAR */}
          <div className="md:w-1/3 flex flex-col items-center space-y-4">
            <div className="w-40 h-40 rounded-full border-4 border-blue-50 overflow-hidden bg-gray-100 shadow-inner">
              {formData.avatar ? (
                <img src={getAvatarUrl(formData.avatar)} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl">
                  👤
                </div>
              )}
            </div>
            
            <label className="cursor-pointer bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
              Đổi ảnh đại diện
              <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
            </label>
          </div>

          {/* CỘT PHẢI: THÔNG TIN */}
          <div className="md:w-2/3 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                <input type="text" name="full_name" value={formData.full_name} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email (Không thể đổi)</label>
                <input type="email" value={formData.email} disabled className="w-full px-4 py-2 border border-gray-200 bg-gray-50 text-gray-500 rounded-lg outline-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ngày sinh</label>
                <input type="date" name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ / Nơi đến</label>
              <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tiểu sử</label>
              <textarea name="bio" value={formData.bio} onChange={handleChange} rows="4" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"></textarea>
            </div>

            <div className="pt-4">
              <button 
                type="submit" 
                disabled={isLoading}
                className={`w-full sm:w-auto px-8 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-sm hover:bg-blue-700 ${isLoading ? 'opacity-70' : ''}`}
              >
                {isLoading ? 'Đang lưu...' : 'Lưu cập nhật'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;