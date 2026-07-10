import React, { useState, useEffect } from 'react';
import ThreeAvatar from '../../components/common/ThreeAvatar';
import apiClient from '../../services/api.client';
import { FaPlay, FaSpinner } from 'react-icons/fa';

const TextToSignPage = () => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [currentAnim, setCurrentAnim] = useState(null);

  const handleTranslate = async () => {
    setLoading(true);
    setResult(null);
    try {
      const response = await apiClient.post('/translate/text-to-sign', null, {
        params: { text }
      });
      setResult(response.data);
      const anims = response.data.animations || [];
      if (anims.length > 0) {
        setCurrentAnim(anims[0]);
      }
    } catch (error) {
      console.error(error);
      alert('Lỗi khi dịch!');
    } finally {
      setLoading(false);
    }
  };

  // Giả lập hết animation sau 2 giây
  useEffect(() => {
    if (currentAnim) {
      const timer = setTimeout(() => setCurrentAnim(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [currentAnim]);

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Chuyển văn bản thành ký hiệu 3D
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Phần nhập văn bản */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Nhập văn bản... Ví dụ: xin chào"
          />
          <button
            onClick={handleTranslate}
            disabled={loading || !text.trim()}
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <FaSpinner className="animate-spin" /> : <FaPlay />}
            {loading ? 'Đang xử lý...' : 'Chuyển đổi'}
          </button>
          {result && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm">
              ✅ Đã tạo {result.animations?.length || 0} động tác
            </div>
          )}
        </div>

        {/* Phần hiển thị 3D */}
        <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg h-[500px]">
          <ThreeAvatar animationName={currentAnim} />
        </div>
      </div>
    </div>
  );
};

export default TextToSignPage;