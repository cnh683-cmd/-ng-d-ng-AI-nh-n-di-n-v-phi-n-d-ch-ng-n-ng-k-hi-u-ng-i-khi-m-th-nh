import React, { useState, useRef, useEffect } from 'react';

const TranslationStationPage = () => {
  const [textInput, setTextInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(false); 
  const [currentDisplayLetter, setCurrentDisplayLetter] = useState("");
  const [spelledWord, setSpelledWord] = useState("");
  const [processedLetters, setProcessedLetters] = useState([]); 
  
  const recognitionRef = useRef(null);
  const playIntervalRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false; 
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'vi-VN'; 

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setTextInput(transcript); 
        setIsFinished(false); 
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Lỗi Micro:", event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
    return () => clearInterval(playIntervalRef.current);
  }, []);

  const toggleListen = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const removeVietnameseTones = (str) => {
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    return str.replace(/[^a-z ]/g, '').replace(/\s+/g, ' ');
  };

  const handleTextChange = (e) => {
      setTextInput(e.target.value);
      setIsFinished(false); 
  };

  const playSignLanguage = () => {
    if (!textInput.trim()) return;
    
    setIsPlaying(true);
    setIsFinished(false);
    setSpelledWord("");
    setCurrentDisplayLetter("");
    clearInterval(playIntervalRef.current);

    const cleanText = removeVietnameseTones(textInput).trim(); 
    const letters = cleanText.split(''); 
    
    setProcessedLetters(letters); 
    let index = 0;

    if (letters.length === 0) {
        setIsPlaying(false);
        return;
    }

    playIntervalRef.current = setInterval(() => {
      if (index < letters.length) {
        const char = letters[index];
        setCurrentDisplayLetter(char);
        setSpelledWord(prev => prev + char);
        index++;
      } else {
        clearInterval(playIntervalRef.current);
        setIsPlaying(false);
        setCurrentDisplayLetter("");
        setTimeout(() => setIsFinished(true), 500); 
      }
    }, 1200); 
  };

  // LƯU LỊCH SỬ THỦ CÔNG - Đã sửa lỗi 307 và 405
  const handleSaveHistory = async () => {
    if (!textInput.trim()) return;
    try {
const token = localStorage.getItem('access_token');
      const cleanLetters = processedLetters.filter(char => char.trim() !== '');

      // Gọi API trực tiếp không có dấu "/" ở cuối
      const response = await fetch('http://127.0.0.1:8000/api/v1/history', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '' 
        },
        body: JSON.stringify({
          input_type: "text_to_sign",
          input_content: textInput.trim(),
          output_content: cleanLetters 
        })
      });

      if (response.ok) {
        alert("🎉 Đã lưu kết quả dịch vào lịch sử thành công!");
      } else {
        const errData = await response.json();
        alert(`❌ Lỗi lưu lịch sử: ${errData.detail || 'Thử lại sau'}`);
      }
    } catch (error) {
      console.error("Lỗi kết nối API:", error);
      alert("❌ Lỗi kết nối đến Server.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Trạm Phiên Dịch Ký Hiệu</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* CỘT TRÁI: NHẬP LIỆU */}
        <div className="w-full md:w-1/3 bg-white p-6 rounded-xl shadow-md border border-gray-100 flex flex-col z-10">
          <label className="text-lg font-semibold text-gray-700 mb-2">1. Nhập liệu:</label>
          <p className="text-sm text-gray-500 mb-4">Gõ văn bản hoặc nói tiếng Việt.</p>
          
          <textarea
            className="w-full h-40 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none mb-4"
            placeholder="Ví dụ: xin chao..."
            value={textInput}
            onChange={handleTextChange}
            disabled={isPlaying || isListening}
          ></textarea>

          <div className="flex gap-3 mb-4">
            <button 
                onClick={toggleListen}
                disabled={isPlaying}
                className={`flex-1 py-3 px-4 rounded-lg font-medium text-white flex justify-center items-center gap-2 transition-colors ${
                    isListening ? 'bg-red-500 animate-pulse' : 'bg-green-500 hover:bg-green-600'
                }`}
            >
                {isListening ? '🎙️ Đang nghe...' : '🎤 Nói vào Micro'}
            </button>
          </div>

          <button 
            onClick={playSignLanguage}
            disabled={isPlaying || !textInput.trim()}
            className="w-full py-4 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 shadow-md disabled:bg-gray-400"
          >
            {isPlaying ? '⏳ Đang dịch...' : '▶️ Bắt đầu chuyển đổi'}
          </button>
        </div>

        {/* CỘT PHẢI: KHU VỰC HIỂN THỊ ẢNH */}
        <div className="w-full md:w-2/3 bg-gray-50 rounded-xl shadow-lg border-4 border-gray-200 relative flex flex-col items-center justify-center min-h-[500px] overflow-hidden">
            
            {isPlaying && currentDisplayLetter ? (
                <div className="w-full h-full flex flex-col items-center justify-center p-8">
                    {/* TRẠNG THÁI 1: ĐANG ĐỌC TỪNG CHỮ */}
                    {currentDisplayLetter === ' ' ? (
                        <div className="h-64 w-64 flex items-center justify-center bg-gray-100 rounded-2xl shadow-inner border-2 border-dashed border-gray-300 animate-fade-in">
                            <span className="text-gray-400 text-xl font-medium">(khoảng trắng)</span>
                        </div>
                    ) : (
                        <img 
                            src={`/signs/${currentDisplayLetter.toUpperCase()}.jpg`} 
                            alt={`Ký hiệu ${currentDisplayLetter}`}
                            className="h-64 w-64 object-cover rounded-2xl shadow-md border-4 border-white animate-fade-in"
                            style={{ imageRendering: 'high-quality', filter: 'contrast(1.1) brightness(1.05)' }}
                            onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'block';
                            }}
                        />
                    )}
                    
                    <div className="text-[150px] font-black text-blue-600 hidden drop-shadow-md lowercase">
                        {currentDisplayLetter}
                    </div>
                </div>
            
            ) : isFinished ? (
                <div className="w-full h-full flex flex-col items-center justify-center p-6">
                    {/* TRẠNG THÁI 2: ĐÃ HIỂN THỊ HÀNG NGANG */}
                    <div className="w-full flex items-center overflow-x-auto overflow-y-hidden whitespace-nowrap gap-4 pb-10">
                        {processedLetters.map((char, index) => (
                            char === ' ' ? (
                                <div key={index} className="w-10 flex-shrink-0"></div> 
                            ) : (
                                <div key={index} className="flex flex-col items-center flex-shrink-0 animate-fade-in">
                                    <img 
                                        src={`/signs/${char.toUpperCase()}.jpg`} 
                                        alt={`Ký hiệu ${char}`}
                                        className="h-28 w-28 object-cover rounded-xl shadow-sm border-2 border-white mb-3"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.nextSibling.style.display = 'block';
                                        }}
                                    />
                                    <div className="text-5xl font-black text-blue-600 hidden lowercase mb-3">{char}</div>
                                    <span className="text-xl font-bold text-gray-700 bg-gray-200 px-4 py-1 rounded-full lowercase">{char}</span>
                                </div>
                            )
                        ))}
                    </div>

                    {/* NÚT BẤM LƯU THỦ CÔNG */}
                    <button 
                        onClick={handleSaveHistory}
                        className="mt-4 px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-full shadow-lg transition-all flex items-center gap-2 transform hover:-translate-y-0.5"
                    >
                        💾 Lưu kết quả vào lịch sử
                    </button>
                </div>
            
            ) : (
                <div className="text-gray-400 text-2xl font-medium">
                    {/* TRẠNG THÁI 3: CHỜ ĐỢI NHẬP LIỆU */}
                    {isPlaying ? "Chuẩn bị..." : "Khu vực hiển thị ký hiệu"}
                </div>
            )}

            <div className="absolute bottom-6 left-0 w-full text-center px-4 pointer-events-none">
                <div className="bg-white text-blue-800 px-8 py-3 rounded-full inline-block text-2xl font-bold tracking-[0.2em] border-2 border-blue-200 shadow-lg whitespace-pre-wrap">
                    {spelledWord || "..."}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default TranslationStationPage;