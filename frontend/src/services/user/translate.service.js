import apiClient from '../api.client';

export const textToSign = async (text) => {
  // Giả lập gọi API -> trả về video URL
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ output: 'https://example.com/video_sample.mp4', text: text });
    }, 500);
  });
};

export const signToText = async (imageBase64) => {
  // Giả lập nhận diện
  return new Promise((resolve) => {
    setTimeout(() => {
      // Ngẫu nhiên trả về một từ
      const words = ['Xin chào', 'Cảm ơn', 'Tạm biệt', 'Vui vẻ', 'Học tập'];
      const randomWord = words[Math.floor(Math.random() * words.length)];
      resolve({ text: randomWord });
    }, 700);
  });
};

export const textToSpeech = async (text) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ audioUrl: 'https://example.com/speech.mp3', text });
    }, 500);
  });
};