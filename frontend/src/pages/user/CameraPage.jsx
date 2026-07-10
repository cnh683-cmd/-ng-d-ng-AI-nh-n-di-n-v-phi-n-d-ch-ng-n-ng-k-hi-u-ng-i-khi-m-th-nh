import React, { useRef, useEffect, useState } from 'react';

const CameraPage = () => {
  const videoRef = useRef(null);
  const hiddenCanvasRef = useRef(null);
  const displayCanvasRef = useRef(null); 
  const [currentLetter, setCurrentLetter] = useState("");
  const [word, setWord] = useState("");
  const isProcessingRef = useRef(false);

  // Bộ nhớ đệm thời gian để tự động ghép chữ
  const stableLetterRef = useRef("");
  const timerRef = useRef(null);

  const drawSkeleton = (ctx, landmarks, width, height) => {
    ctx.clearRect(0, 0, width, height);
    if (!landmarks || landmarks.length === 0) return;

    const connections = [
      [0,1], [1,2], [2,3], [3,4], [0,5], [5,6], [6,7], [7,8],
      [5,9], [9,10], [10,11], [11,12], [9,13], [13,14], [14,15], 
      [15,16], [13,17], [17,18], [18,19], [19,20], [0,17]
    ];

    ctx.strokeStyle = '#00FF00';
    ctx.lineWidth = 4;
    connections.forEach(([i, j]) => {
      ctx.beginPath();
      ctx.moveTo(landmarks[i].x * width, landmarks[i].y * height);
      ctx.lineTo(landmarks[j].x * width, landmarks[j].y * height);
      ctx.stroke();
    });

    ctx.fillStyle = '#FF0000';
    landmarks.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x * width, p.y * height, 5, 0, 2 * Math.PI);
      ctx.fill();
    });
  };

  useEffect(() => {
    let isMounted = true;
    let captureInterval;

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 }, audio: false });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play();
            startCapturing();
          };
        }
      } catch (err) { console.error("Lỗi Camera: ", err); }
    };

    const startCapturing = () => {
      captureInterval = setInterval(async () => {
        if (!isMounted || !videoRef.current || isProcessingRef.current) return;
        if (videoRef.current.videoWidth === 0) return;

        isProcessingRef.current = true;
        
        const canvas = hiddenCanvasRef.current;
        const ctx = canvas.getContext("2d");
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const imageBase64 = canvas.toDataURL("image/jpeg", 0.4);

        try {
          const token = localStorage.getItem('access_token'); 
          const response = await fetch('http://127.0.0.1:8000/api/v1/translate/sign-to-text-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': token ? `Bearer ${token}` : '' },
            body: JSON.stringify({ image_base64: imageBase64 })
          });
          
          if(response.ok) {
              const data = await response.json();
              if (isMounted) {
                  const detectedLetter = data.text || "";
                  setCurrentLetter(detectedLetter);
                  
                  // --- LOGIC TỰ ĐỘNG GHÉP CHỮ (1.5 GIÂY) ---
                  if (detectedLetter !== stableLetterRef.current) {
                      // Nếu chữ bị thay đổi, reset lại đồng hồ
                      stableLetterRef.current = detectedLetter;
                      clearTimeout(timerRef.current);
                      
                      // Nếu có chữ thật, bắt đầu đếm 1.5 giây
                      if (detectedLetter !== "") {
                          timerRef.current = setTimeout(() => {
                              // Chữ cái sẽ tự động rớt xuống đây
                              setWord(prev => prev + detectedLetter);
                          }, 1500); 
                      }
                  }
                  // ----------------------------------------

                  const displayCtx = displayCanvasRef.current.getContext("2d");
                  displayCanvasRef.current.width = videoRef.current.videoWidth;
                  displayCanvasRef.current.height = videoRef.current.videoHeight;
                  drawSkeleton(displayCtx, data.landmarks, displayCanvasRef.current.width, displayCanvasRef.current.height);
              }
          }
        } catch (error) { console.error("Lỗi:", error); } 
        finally { isProcessingRef.current = false; }
      }, 100); 
    };

    startCamera();

    return () => {
      isMounted = false;
      clearInterval(captureInterval);
      clearTimeout(timerRef.current);
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 relative">
      <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">Nhận diện Ký hiệu</h1>
      
      <div className="flex justify-center mb-6">
        <div className="relative rounded-lg overflow-hidden border-4 border-gray-800 bg-black shadow-lg" style={{ width: '640px', height: '480px' }}>
          
          <video ref={videoRef} className="absolute top-0 left-0 w-full h-full object-cover" style={{ transform: 'scaleX(-1)' }} autoPlay playsInline muted></video>
          <canvas ref={displayCanvasRef} className="absolute top-0 left-0 w-full h-full object-cover pointer-events-none z-10" style={{ transform: 'scaleX(-1)' }}></canvas>
          <canvas ref={hiddenCanvasRef} style={{ display: 'none' }}></canvas>
          
          {currentLetter && (
            <div className="absolute top-4 left-4 bg-white px-4 py-2 rounded-lg font-bold text-red-500 text-4xl shadow z-20">
              {currentLetter}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col items-center p-6 bg-blue-50 border border-blue-200 rounded-xl shadow-sm z-30">
        <h3 className="text-lg text-blue-800 mb-2 font-medium">Từ đã ghép:</h3>
        <p className="text-4xl font-bold text-blue-900 tracking-widest mb-4">{word || "..."}</p>
        <div className="flex gap-4">
            <button onClick={() => setWord(prev => prev + " ")} className="px-6 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 font-medium">
                Dấu Cách (Space)
            </button>
            <button onClick={() => setWord(prev => prev.slice(0, -1))} className="px-6 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 font-medium">
                Xóa 1 ký tự
            </button>
            <button onClick={() => setWord("")} className="px-6 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 font-medium">
                Xóa tất cả
            </button>
        </div>
      </div>
    </div>
  );
};

export default CameraPage;