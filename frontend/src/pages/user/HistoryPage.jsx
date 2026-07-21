import React, { useState } from 'react';
import { useHistory } from '../../hooks/user/useHistory';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const HistoryPage = () => {
  const { history, loading } = useHistory();
  
  // 1. Khởi tạo State phục vụ bộ lọc
  const [filterType, setFilterType] = useState('all'); // 'all', 'camera', 'text_to_sign'
  const [filterDate, setFilterDate] = useState(''); // Định dạng 'YYYY-MM-DD' từ input type="date"

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  // 2. Logic lọc dữ liệu từ Database trước khi hiển thị
  const filteredHistory = history.filter((item) => {
    // Lọc theo loại hình dịch
    const matchesType = filterType === 'all' ? true : item.input_type === filterType;
    
    // Lọc theo ngày chọn từ lịch
    let matchesDate = true;
    if (filterDate) {
      const itemDateStr = new Date(item.timestamp).toISOString().split('T')[0]; // Chuyển timestamp về YYYY-MM-DD
      matchesDate = itemDateStr === filterDate;
    }

    return matchesType && matchesDate;
  });

  // Thuật toán gom nhóm lịch sử theo ngày (Định dạng: Ngày/Tháng/Năm)
  const groupHistoryByDate = (items) => {
    if (!items || !Array.isArray(items)) return {};
    return items.reduce((groups, item) => {
      const dateObj = new Date(item.timestamp);
      const dateStr = dateObj.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
      if (!groups[dateStr]) {
        groups[dateStr] = [];
      }
      groups[dateStr].push(item);
      return groups;
    }, {});
  };

  const groupedHistory = groupHistoryByDate(filteredHistory);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Lịch sử phiên dịch</h1>
      
      {/* ================= THANH BỘ LỌC (FILTER BAR) ================= */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-gray-700 font-semibold">
          <span>🔍 Bộ lọc lịch sử:</span>
        </div>

        <div className="flex flex-wrap items-center gap-6">
          {/* Lọc theo Phương thức */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Nguồn:</span>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="border border-gray-300 rounded-xl px-3 py-1.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer bg-gray-50"
            >
              <option value="all">📂 Tất cả phương thức</option>
              <option value="camera">📹 Quét từ Camera</option>
              <option value="text_to_sign">✍️ Văn bản - Ký hiệu</option>
            </select>
          </div>

          {/* Lọc theo Ngày */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Ngày dịch:</span>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="border border-gray-300 rounded-xl px-3 py-1.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer bg-gray-50"
            />
          </div>

          {/* Nút Xóa nhanh bộ lọc */}
          {(filterType !== 'all' || filterDate !== '') && (
            <button
              onClick={() => { setFilterType('all'); setFilterDate(''); }}
              className="text-sm text-red-500 hover:text-red-700 font-bold transition-colors"
            >
              🔄 Đặt lại
            </button>
          )}
        </div>
      </div>

      {/* ================= HIỂN THỊ DANH SÁCH LỊCH SỬ ================= */}
      {filteredHistory.length === 0 ? (
        <div className="text-center text-gray-500 py-16 bg-white rounded-2xl border shadow-sm">
          📭 Không tìm thấy kết quả lịch sử phiên dịch nào phù hợp.
        </div>
      ) : (
        <div className="space-y-10">
          {Object.keys(groupedHistory).map((date) => (
            <div key={date} className="space-y-4">
              
              {/* PHÂN CHIA THEO NGÀY */}
              <h2 className="text-lg font-bold text-blue-600 border-b-2 border-blue-100 pb-2 inline-block">
                📅 Ngày {date}
              </h2>
              
              {/* DANH SÁCH BẢN DỊCH TRONG NGÀY */}
              <div className="grid grid-cols-1 gap-5">
                {groupedHistory[date].map((item) => (
                  <div key={item.id} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow relative">
                    
                    {/* Tag hiển thị Loại phương thức (Góc trên bên phải) */}
                    <div className="absolute top-5 right-5">
                      {item.input_type === 'camera' ? (
                        <span className="bg-green-50 text-green-700 border border-green-200 px-3 py-1 rounded-full text-xs font-bold">
                          📹 Camera
                        </span>
                      ) : (
                        <span className="bg-purple-50 text-purple-700 border border-purple-200 px-3 py-1 rounded-full text-xs font-bold">
                          ✍️ Văn bản gốc
                        </span>
                      )}
                    </div>

                    {/* HIỂN THỊ CHỮ GỐC */}
                    <div className="mb-4 pr-24"> {/* chừa khoảng trống cho tag loại phương thức */}
                      <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Văn bản gốc</span>
                      <p className="text-gray-900 font-semibold text-lg mt-1">"{item.input_content}"</p>
                    </div>

                    {/* HIỂN THỊ KÝ HIỆU */}
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 block">Ký hiệu ngôn ngữ</span>
                      <div className="flex flex-wrap gap-2">
                        {item.output_content && Array.isArray(item.output_content) && item.output_content.map((char, index) => (
                          <div key={index} className="flex flex-col items-center bg-gray-50 p-2 rounded-xl border border-gray-100">
                            <img 
                              src={`/signs/${char.toUpperCase()}.jpg`} 
                              alt={`Ký hiệu ${char}`} 
                              className="h-14 w-14 object-cover rounded-lg shadow-sm border border-white"
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                            <span className="text-[10px] font-bold text-gray-500 mt-1 uppercase">{char}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* HIỂN THỊ GIỜ CHI TIẾT */}
                    <div className="text-right mt-3">
                      <span className="text-xs text-gray-400">
                        🕒 {new Date(item.timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                  </div>
                ))}
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryPage;