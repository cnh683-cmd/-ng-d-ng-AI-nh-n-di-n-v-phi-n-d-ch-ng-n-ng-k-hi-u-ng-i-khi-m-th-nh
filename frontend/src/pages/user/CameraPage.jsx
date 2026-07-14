import React, { useRef, useEffect, useState } from 'react';

const CameraPage = () => {
  const videoRef = useRef(null);
  const hiddenCanvasRef = useRef(null);
  const displayCanvasRef = useRef(null); 
  const [currentLetter, setCurrentLetter] = useState("");
  const [word, setWord] = useState("");
  const isProcessingRef = useRef(false);

  const stableLetterRef = useRef("");
  const timerRef = useRef(null);

  // --- HÀM XỬ LÝ LƯU LỊCH SỬ VÀO DATABASE ---
  const handleSaveHistory = async () => {
    if (!word.trim()) {
        alert("Chưa có từ nào để lưu!");
        return;
    }
    try {
        const token = localStorage.getItem('access_token');
        const response = await fetch('http://127.0.0.1:8000/api/v1/translate/save-history', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': token ? `Bearer ${token}` : '' 
            },
            body: JSON.stringify({
                input_type: "camera",
                input_content: "Quét từ Camera", 
                output_content: word.trim()      
            })
        });

        if (response.ok) {
            alert("✅ Đã lưu vào lịch sử thành công!");
        } else {
            alert("❌ Lỗi khi lưu lịch sử từ server!");
        }
    } catch (error) {
        console.error("Lỗi khi lưu:", error);
        alert("❌ Lỗi kết nối khi lưu lịch sử!");
    }
  };

  // --- HÀM VẼ GÂN TAY + KHUNG NHẬN DIỆN ---
  const drawSkeleton = (ctx, landmarks, width, height, letter, confidence) => {
    ctx.clearRect(0, 0, width, height);
    if (!landmarks || landmarks.length === 0) return;

    // 1. VẼ GÂN TAY (GIỮ NGUYÊN BẢN SẮC)
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

    // 2. TÍNH TOÁN KHUNG BAO NGOÀI (BOUNDING BOX)
    let minX = 1, minY = 1, maxX = 0, maxY = 0;
    landmarks.forEach(p => {
      if (p.x < minX) minX = p.x;
      if (p.y < minY) minY = p.y;
      if (p.x > maxX) maxX = p.x;
      if (p.y > maxY) maxY = p.y;
    });

    const padding = 20;
    const boxX = minX * width - padding;
    const boxY = minY * height - padding;
    const boxW = (maxX - minX) * width + padding * 2;
    const boxH = (maxY - minY) * height + padding * 2;

    // Vẽ viền chữ nhật màu xanh lơ giống ảnh
    ctx.strokeStyle = '#00FFFF'; 
    ctx.lineWidth = 3;
    ctx.strokeRect(boxX, boxY, boxW, boxH);

    // 3. VẼ TEXT ĐỘ TIN CẬY
    if (letter && confidence) {
      const text = `${letter} (ước lượng) ${confidence}%`;
      ctx.font = "bold 16px Arial";
      const textWidth = ctx.measureText(text).width;
      
      // Vẽ background cho text
      ctx.fillStyle = '#00FFFF';
      ctx.fillRect(boxX, boxY - 30, textWidth + 10, 30);
      
      // Vẽ text (dùng ctx.scale(-1, 1) để lật trục X, giúp chữ không bị ngược kính)
      ctx.save();
      ctx.scale(-1, 1);
      ctx.fillStyle = '#000000';
      ctx.fillText(text, -(boxX + textWidth + 10) + 5, boxY - 9);
      ctx.restore();
    }
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
                  const confidence = data.confidence || 0; // Hứng độ tin cậy từ Backend
                  
                  setCurrentLetter(detectedLetter);
                  
                  if (detectedLetter !== stableLetterRef.current) {
                      stableLetterRef.current = detectedLetter;
                      clearTimeout(timerRef.current);
                      
                      if (detectedLetter !== "") {
                          timerRef.current = setTimeout(() => {
                              setWord(prev => prev + detectedLetter);
                          }, 1500); 
                      }
                  }

                  const displayCtx = displayCanvasRef.current.getContext("2d");
                  displayCanvasRef.current.width = videoRef.current.videoWidth;
                  displayCanvasRef.current.height = videoRef.current.videoHeight;
                  
                  // Gọi hàm vẽ, TRUYỀN THÊM letter VÀ confidence
                  drawSkeleton(
                      displayCtx, 
                      data.landmarks, 
                      displayCanvasRef.current.width, 
                      displayCanvasRef.current.height,
                      detectedLetter,
                      confidence
                  );
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
          
        </div>
      </div>

      <div className="flex flex-col items-center p-6 bg-blue-50 border border-blue-200 rounded-xl shadow-sm z-30">
        <h3 className="text-lg text-blue-800 mb-2 font-medium">Từ đã ghép:</h3>
        <p className="text-4xl font-bold text-blue-900 tracking-widest mb-4">{word || "..."}</p>
        
        {/* KHU VỰC CHỨA CÁC NÚT BẤM */}
        <div className="flex gap-4">
            <button onClick={handleSaveHistory} className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 font-medium shadow-sm transition-colors">
                Lưu Kết Quả
            </button>
            <button onClick={() => setWord(prev => prev + " ")} className="px-6 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 font-medium transition-colors">
                Dấu Cách (Space)
            </button>
            <button onClick={() => setWord(prev => prev.slice(0, -1))} className="px-6 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 font-medium transition-colors">
                Xóa 1 ký tự
            </button>
            <button onClick={() => setWord("")} className="px-6 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 font-medium transition-colors">
                Xóa tất cả
            </button>
        </div>
      </div>
    </div>
  );
};

export default CameraPage;