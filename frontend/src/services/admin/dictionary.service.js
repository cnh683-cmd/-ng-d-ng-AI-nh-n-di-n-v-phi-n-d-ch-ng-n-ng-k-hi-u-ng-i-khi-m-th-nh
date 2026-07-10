import apiClient from '../api.client';

let mockDictionary = [
  { id: '1', word: 'Xin chào', videoUrl: 'video1.mp4', imageUrl: 'image1.png', labelIndex: 0, approved: true },
  { id: '2', word: 'Cảm ơn', videoUrl: 'video2.mp4', imageUrl: 'image2.png', labelIndex: 1, approved: true },
  { id: '3', word: 'Tạm biệt', videoUrl: 'video3.mp4', imageUrl: 'image3.png', labelIndex: 2, approved: false },
];

export const getDictionary = async () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockDictionary), 300);
  });
};

export const addDictionaryItem = async (item) => {
  return new Promise((resolve) => {
    const newItem = { ...item, id: Date.now().toString() };
    mockDictionary.push(newItem);
    resolve(newItem);
  });
};

export const updateDictionaryItem = async (id, updated) => {
  return new Promise((resolve, reject) => {
    const index = mockDictionary.findIndex(item => item.id === id);
    if (index !== -1) {
      mockDictionary[index] = { ...mockDictionary[index], ...updated };
      resolve(mockDictionary[index]);
    } else {
      reject(new Error('Item not found'));
    }
  });
};

export const deleteDictionaryItem = async (id) => {
  return new Promise((resolve, reject) => {
    const index = mockDictionary.findIndex(item => item.id === id);
    if (index !== -1) {
      mockDictionary.splice(index, 1);
      resolve({ message: 'Deleted' });
    } else {
      reject(new Error('Item not found'));
    }
  });
};