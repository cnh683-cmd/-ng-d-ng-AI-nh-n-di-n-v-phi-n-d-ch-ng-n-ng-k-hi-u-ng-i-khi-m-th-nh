import React from 'react';

const LearningPage = () => {
  // Fix cứng danh sách bảng chữ cái A-Z
  const alphabet = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 
    'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-3">Học ngôn ngữ ký hiệu</h1>
        <p className="text-gray-500">
          Bảng chữ cái cơ bản từ A đến Z
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {alphabet.map((letter) => (
          <div 
            key={letter} 
            className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm hover:shadow-lg hover:border-blue-300 transition-all flex flex-col items-center justify-center group cursor-pointer"
          >
            {/* Chữ cái hiển thị to rõ */}
            <h2 className="text-3xl font-black text-gray-700 group-hover:text-blue-600 mb-3 transition-colors uppercase">
              {letter}
            </h2>

            {/* Khung chứa Hình ảnh của chữ đó */}
            <div className="w-full aspect-square bg-gray-50 rounded-xl flex items-center justify-center overflow-hidden border border-gray-100 p-2">
              <img
                src={`/signs/${letter}.jpg`} 
                alt={`Ký hiệu tay chữ ${letter}`}
                className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  // Nếu chưa có ảnh thì hiển thị tạm ô màu xám có chữ để không bị lỗi giao diện
                  e.target.onerror = null; 
                  e.target.src = `https://placehold.co/200x200/eeeeee/999999?text=${letter}`;
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LearningPage;