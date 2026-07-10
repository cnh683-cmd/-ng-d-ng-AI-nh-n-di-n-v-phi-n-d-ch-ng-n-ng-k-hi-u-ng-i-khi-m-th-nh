import React, { useEffect, useState } from 'react';
import { getDictionary } from '../../services/admin/dictionary.service'; // dùng service của admin (nhưng user cũng xem được)

const LearningPage = () => {
  const [dictionary, setDictionary] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDictionary();
        setDictionary(data.filter(item => item.approved));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Học ngôn ngữ ký hiệu</h1>
      {loading ? (
        <p>Đang tải...</p>
      ) : dictionary.length === 0 ? (
        <p>Chưa có từ vựng nào được phê duyệt.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {dictionary.map(item => (
            <div key={item.id} className="bg-white rounded-lg shadow-md p-4">
              <h3 className="text-lg font-semibold text-gray-900">{item.word}</h3>
              {item.imageUrl && <img src={item.imageUrl} alt={item.word} className="mt-2 w-full h-32 object-cover rounded" />}
              {item.videoUrl && (
                <video controls className="mt-2 w-full">
                  <source src={item.videoUrl} type="video/mp4" />
                </video>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LearningPage;