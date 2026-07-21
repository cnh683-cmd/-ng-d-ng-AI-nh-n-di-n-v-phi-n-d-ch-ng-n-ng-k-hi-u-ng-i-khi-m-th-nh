import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { FaVideo, FaKeyboard, FaHistory, FaBook, FaMicrophone } from 'react-icons/fa';
import ImgKhiemThinh1 from '../../assets/khiem-thinh-1.jpg';  

const DashboardPage = () => {
  const { user } = useAuth();

  const features = [
    { icon: <FaVideo className="text-4xl" />, title: 'Camera nhận diện', desc: 'Dùng camera để nhận diện trực tiếp ngôn ngữ ký hiệu', link: '/camera' },
    { icon: <FaKeyboard className="text-4xl" />, title: 'Văn bản → Ký hiệu', desc: 'Nhập văn bản, hệ thống sẽ dịch sang hình ảnh ký hiệu', link: '/text-to-sign' },
    { icon: <FaMicrophone className="text-4xl" />, title: 'Văn bản → Giọng nói', desc: 'Chuyển đổi văn bản thành giọng nói tự nhiên', link: '/text-to-speech' },
    { icon: <FaHistory className="text-4xl" />, title: 'Lịch sử', desc: 'Xem lại các lần phiên dịch trước đây của bạn', link: '/history' },
    { icon: <FaBook className="text-4xl" />, title: 'Học ký hiệu', desc: 'Thư viện từ vựng giúp bạn học ngôn ngữ ký hiệu', link: '/learning' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-20">
      
      {/* ================= PHẦN 1: KHU VỰC CHỨC NĂNG ================= */}
      <section>
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Chào mừng, <span className="text-blue-600">{user?.fullName || 'bạn'}</span>!
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Hãy chọn một chức năng dưới đây để bắt đầu trải nghiệm hệ thống phiên dịch ngôn ngữ ký hiệu thông minh.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((item, index) => (
            <Link 
              key={index} 
              to={item.link} 
              className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 transform hover:-translate-y-2 flex flex-col items-center text-center group"
            >
              <div className="text-blue-500 mb-5 bg-blue-50 p-4 rounded-full group-hover:bg-blue-500 group-hover:text-white transition-colors duration-300">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ================= PHẦN 2: LỢI ÍCH & THÔNG ĐIỆP ================= */}
      <section className="bg-white rounded-3xl p-8 lg:p-12 shadow-sm border border-gray-100">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-800">
            Đồng hành cùng cộng đồng người khiếm thính
          </h2>
          <div className="w-24 h-1 bg-blue-500 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Khối 1: Ảnh 3 (Trái) - Chữ (Phải) */}
        <div className="flex flex-col lg:flex-row items-center gap-12 mb-20">
          <div className="w-full lg:w-1/2 overflow-hidden rounded-2xl shadow-lg">
            <img
              src={ImgKhiemThinh1} 
              alt="Hỗ trợ học tập và giao tiếp"
              className="w-full h-[350px] object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
          <div className="w-full lg:w-1/2">
            <div className="inline-block px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-bold mb-4">
              Tiện lợi & Nhanh chóng
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-6 leading-tight">
              Hỗ Trợ Học Tập & Giao Tiếp Hiệu Quả
            </h3>
            <p className="text-gray-600 text-lg leading-relaxed text-justify mb-6">
              Website cung cấp công cụ phiên dịch ngôn ngữ ký hiệu thông minh bằng AI. Không chỉ giúp người khiếm thính dễ dàng tiếp cận thông tin, nền tảng còn là môi trường tuyệt vời để người thân, bạn bè và bất kỳ ai trong xã hội cũng có thể học hỏi, trau dồi vốn từ vựng ký hiệu một cách trực quan và sinh động nhất.
            </p>
            <Link to="/learning" className="text-blue-600 font-semibold hover:text-blue-800 flex items-center gap-2 transition-colors">
              Khám phá thư viện từ vựng <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>

        {/* Khối 2: Chữ (Trái) - Ảnh 4 (Phải) */}
        <div className="flex flex-col lg:flex-row-reverse items-center gap-12">
          <div className="w-full lg:w-1/2 overflow-hidden rounded-2xl shadow-lg">
            <img
              src="/assets/image_838b74.jpg" 
              alt="Xóa bỏ rào cản giao tiếp"
              className="w-full h-[350px] object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
          <div className="w-full lg:w-1/2">
            <div className="inline-block px-4 py-2 bg-green-50 text-green-600 rounded-full text-sm font-bold mb-4">
              Kết nối xã hội
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-6 leading-tight">
              Xóa Nhòa Khoảng Cách, Kết Nối Cộng Đồng
            </h3>
            <p className="text-gray-600 text-lg leading-relaxed text-justify">
              Giao tiếp là chìa khóa để thấu hiểu và sẻ chia. Chúng tôi hướng tới một thế giới bình đẳng, nơi người khiếm thính có thể tự tin trò chuyện, thể hiện bản thân và hòa nhập trọn vẹn. <strong>SignLang</strong> đóng vai trò như một cây cầu vững chắc, đập tan mọi ngăn cách và định kiến, giúp cộng đồng gắn kết với nhau chặt chẽ hơn.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default DashboardPage;