import { useState } from 'react';
import { signToText } from '../../services/user/translate.service';

export const useCamera = () => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const toggleStream = () => {
    setIsStreaming(prev => !prev);
    if (!isStreaming) {
      setRecognizedText('');
    }
  };

  const handleCapture = async (imageSrc) => {
    setIsProcessing(true);
    try {
      const result = await signToText(imageSrc);
      setRecognizedText(result.text);
    } catch (error) {
      console.error('Lỗi nhận diện:', error);
      setRecognizedText('Lỗi nhận diện');
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isStreaming,
    recognizedText,
    isProcessing,
    toggleStream,
    handleCapture,
  };
};