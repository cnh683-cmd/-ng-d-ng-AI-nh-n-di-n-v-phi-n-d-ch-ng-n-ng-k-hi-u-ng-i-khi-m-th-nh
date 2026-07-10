import React, { useState } from 'react';
import { useDictionary } from '../../hooks/admin/useDictionary';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { FaEdit, FaTrash, FaCheck } from 'react-icons/fa';

const ManageDictionary = () => {
  const { items, loading, addItem, updateItem, deleteItem } = useDictionary();
  const [newWord, setNewWord] = useState('');
  const [newVideo, setNewVideo] = useState('');
  const [newImage, setNewImage] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editWord, setEditWord] = useState('');

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newWord.trim()) return;
    await addItem({
      word: newWord,
      videoUrl: newVideo || 'https://example.com/demo.mp4',
      imageUrl: newImage || 'https://example.com/demo.png',
      labelIndex: 0,
      approved: false,
    });
    setNewWord('');
    setNewVideo('');
    setNewImage('');
  };

  const handleUpdate = async (id) => {
    await updateItem(id, { word: editWord });
    setEditingId(null);
    setEditWord('');
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Quản lý từ điển</h1>
      <form onSubmit={handleAdd} className="bg-white p-4 rounded-lg shadow-md mb-6 flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-sm font-medium text-gray-700">Từ vựng</label>
          <input
            type="text"
            value={newWord}
            onChange={(e) => setNewWord(e.target.value)}
            className="border border-gray-300 rounded-md p-2 w-48"
            placeholder="Từ mới"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Video URL</label>
          <input
            type="text"
            value={newVideo}
            onChange={(e) => setNewVideo(e.target.value)}
            className="border border-gray-300 rounded-md p-2 w-48"
            placeholder="URL video"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Ảnh URL</label>
          <input
            type="text"
            value={newImage}
            onChange={(e) => setNewImage(e.target.value)}
            className="border border-gray-300 rounded-md p-2 w-48"
            placeholder="URL ảnh"
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Từ</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Video</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ảnh</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {items.map(item => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {editingId === item.id ? (
                      <input
                        type="text"
                        value={editWord}
                        onChange={(e) => setEditWord(e.target.value)}
                        className="border border-gray-300 rounded p-1"
                      />
                    ) : (
                      item.word
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.videoUrl ? <a href={item.videoUrl} className="text-primary-600 underline" target="_blank">Xem</a> : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.imageUrl ? <img src={item.imageUrl} alt={item.word} className="h-8 w-8 object-cover rounded" /> : 'N/A'}
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