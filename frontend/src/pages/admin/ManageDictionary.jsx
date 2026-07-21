import React, { useState } from 'react';
import { useDictionary } from '../../hooks/admin/useDictionary';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { FaEdit, FaTrash, FaCheck } from 'react-icons/fa';

const ManageDictionary = () => {
  const { items, loading, addItem, updateItem, deleteItem } = useDictionary();
  const [newWord, setNewWord] = useState('');
  const [newLabelIndex, setNewLabelIndex] = useState(0);
  const [editingId, setEditingId] = useState(null);
  const [editWord, setEditWord] = useState('');

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newWord.trim()) return;
    await addItem({
      word: newWord,
      label_index: newLabelIndex,
      approved: false, // Mặc định khi thêm là chưa duyệt
    });
    setNewWord('');
    setNewLabelIndex(0);
  };

  const handleUpdate = async (id) => {
    await updateItem(id, { word: editWord });
    setEditingId(null);
    setEditWord('');
  };

  // TẠO MẢNG MỚI ĐÃ SẮP XẾP THEO BẢNG CHỮ CÁI (A-Z)
  const sortedItems = [...items].sort((a, b) => {
    if (!a.word || !b.word) return 0;
    return a.word.localeCompare(b.word);
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Quản lý từ điển</h1>
      
      <form onSubmit={handleAdd} className="bg-white p-4 rounded-lg shadow-md mb-6 flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-sm font-medium text-gray-700">Ký hiệu (Word)</label>
          <input
            type="text"
            value={newWord}
            onChange={(e) => setNewWord(e.target.value)}
            className="border border-gray-300 rounded-md p-2 w-48 mt-1"
            placeholder="A, B, C..."
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Label Index</label>
          <input
            type="number"
            value={newLabelIndex}
            onChange={(e) => setNewLabelIndex(parseInt(e.target.value) || 0)}
            className="border border-gray-300 rounded-md p-2 w-32 mt-1"
          />
        </div>
        <button type="submit" className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-md">
          Thêm
        </button>
      </form>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ký hiệu</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Label Index</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {/* SỬ DỤNG MẢNG sortedItems THAY VÌ items */}
              {sortedItems.map(item => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {editingId === item.id ? (
                      <input
                        type="text"
                        value={editWord}
                        onChange={(e) => setEditWord(e.target.value)}
                        className="border border-gray-300 rounded p-1 w-full"
                      />
                    ) : (
                      item.word
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.label_index ?? item.labelIndex}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs ${item.approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {item.approved ? 'Đã duyệt' : 'Chờ duyệt'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {editingId === item.id ? (
                      <button onClick={() => handleUpdate(item.id)} className="text-green-600 hover:text-green-900 mr-3">
                        <FaCheck />
                      </button>
                    ) : (
                      <button onClick={() => { setEditingId(item.id); setEditWord(item.word); }} className="text-blue-600 hover:text-blue-900 mr-3">
                        <FaEdit />
                      </button>
                    )}
                    <button onClick={() => deleteItem(item.id)} className="text-red-600 hover:text-red-900">
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageDictionary;