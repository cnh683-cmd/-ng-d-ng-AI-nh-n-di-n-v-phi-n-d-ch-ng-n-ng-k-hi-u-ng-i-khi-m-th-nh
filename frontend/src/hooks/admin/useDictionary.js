import { useState, useEffect } from 'react';
import { getDictionary, addDictionaryItem, updateDictionaryItem, deleteDictionaryItem } from '../../services/admin/dictionary.service';

export const useDictionary = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const data = await getDictionary();
      setItems(data);
    } catch (error) {
      console.error('Lỗi lấy từ điển:', error);
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (item) => {
    try {
      const newItem = await addDictionaryItem(item);
      setItems(prev => [...prev, newItem]);
      return newItem;
    } catch (error) {
      console.error('Lỗi thêm từ:', error);
      throw error;
    }
  };

  const updateItem = async (id, updated) => {
    try {
      const result = await updateDictionaryItem(id, updated);
      setItems(prev => prev.map(item => item.id === id ? result : item));
      return result;
    } catch (error) {
      console.error('Lỗi cập nhật từ:', error);
      throw error;
    }
  };

  const deleteItem = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa từ này?')) return;
    try {
      await deleteDictionaryItem(id);
      setItems(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error('Lỗi xóa từ:', error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return { items, loading, fetchItems, addItem, updateItem, deleteItem };
};