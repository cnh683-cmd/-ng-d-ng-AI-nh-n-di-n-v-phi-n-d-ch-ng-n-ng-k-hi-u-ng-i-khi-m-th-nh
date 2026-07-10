import apiClient from '../api.client';

let mockHistory = [
  { id: '1', userId: '2', inputType: 'text', inputContent: 'Xin chào', outputContent: 'video_xin_chao.mp4', timestamp: new Date().toISOString() },
  { id: '2', userId: '2', inputType: 'sign', inputContent: 'cử chỉ A', outputContent: 'A', timestamp: new Date(Date.now() - 86400000).toISOString() },
];

export const getHistory = async (userId) => {
  return new Promise((resolve) => {
    const data = mockHistory.filter(item => item.userId === userId);
    setTimeout(() => resolve(data), 300);
  });
};

export const addHistory = async (historyItem) => {
  return new Promise((resolve) => {
    const newItem = { ...historyItem, id: Date.now().toString() };
    mockHistory.push(newItem);
    resolve(newItem);
  });
};