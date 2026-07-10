import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import { FaCamera, FaStop } from 'react-icons/fa';

const CameraView = ({ onCapture, isStreaming, onToggleStream }) => {
  const webcamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      setCapturedImage(imageSrc);
      if (onCapture) onCapture(imageSrc);
    }
  };

  useEffect(() => {
    // Nếu không streaming, clear ảnh
    if (!isStreaming) {
      setCapturedImage(null);
    }
  }, [isStreaming]);

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative w-full max-w-md rounded-lg overflow-hidden shadow-lg bg-gray-900">
        {isStreaming ? (
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="w-full h-auto"
          />
        ) : (
          <div className="h-64 flex items-center justify-center text-gray-400 bg-gray-800">
            <span>Camera đã tắt</span>
          </div>
        )}
        {capturedImage && !isStreaming && (
          <img src={capturedImage} alt="captured" className="w-full h-auto" />
        )}
      </div>
      <div className="flex space-x-4">
        {!isStreaming ? (
          <button
            onClick={onToggleStream}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center space-x-2"
          >
            <FaCamera /> <span>Bật camera</span>
          </button>
        ) : (
          <>
            <button
              onClick={capture}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center space-x-2"
            >
              <FaCamera /> <span>Chụp</span>
            </button>
            <button
              onClick={onToggleStream}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md flex items-center space-x-2"
            >
              <FaStop /> <span>Tắt camera</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default CameraView;