import { useState, useEffect } from 'react';
import { getHistory, addHistory } from '../../services/user/history.service';
import { useAuth } from '../../contexts/AuthContext';

export const useHistory = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getHistory();
      setHistory(data);
    } catch (error) {
      console.error('Lỗi lấy lịch sử:', error);
    } finally {
      setLoading(false);
    }
  };

  const addHistoryItem = async (item) => {
    if (!user) return;
    try {
      const newItem = await addHistory({
        input_type: item.input_type || "text_to_sign",
        input_content: item.input_content,
        output_content: item.output_content
      });
      setHistory(prev => [newItem, ...prev]);
      fetchHistory(); // Nạp lại danh sách mới nhất
    } catch (error) {
      console.error('Lỗi thêm lịch sử:', error);
    }
  };

  useEffect(() => {
    fetchHistory();
    // eslint-disable-next-line
  }, [user]);

  return { history, loading, fetchHistory, addHistoryItem };
};