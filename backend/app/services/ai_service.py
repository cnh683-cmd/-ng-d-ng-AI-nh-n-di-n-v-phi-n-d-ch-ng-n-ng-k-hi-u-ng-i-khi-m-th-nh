import pickle
import os
import numpy as np
import cv2
import base64
import mediapipe as mp
from sqlalchemy.orm import Session

# Tìm đường dẫn đến file Model
current_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.dirname(os.path.dirname(current_dir))
model_path = os.path.join(backend_dir, 'models', 'asl_model.pkl')

model = None
if os.path.exists(model_path):
    with open(model_path, 'rb') as f:
        model = pickle.load(f)
    print(f"✅ Đã load thành công AI Model (.pkl)")
else:
    print(f"⚠️ Không tìm thấy file tại: {model_path}")

# Khởi tạo MediaPipe trên Backend
mp_hands = mp.solutions.hands
hands = mp_hands.Hands(static_image_mode=True, max_num_hands=1, min_detection_confidence=0.5)

async def sign_to_text_from_image(base64_str: str):
    # CHÚ Ý: Đã thêm tham số thứ 3 (độ tin cậy) là 0.0 vào các giá trị return khi có lỗi
    if model is None: return "Model chưa sẵn sàng", [], 0.0
    
    try:
        if "," in base64_str:
            base64_str = base64_str.split(",")[1]
            
        img_data = base64.b64decode(base64_str)
        nparr = np.frombuffer(img_data, np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        result = hands.process(rgb_frame)
        
        if result.multi_hand_landmarks:
            hand_landmarks = result.multi_hand_landmarks[0]
            landmarks_data = []
            base_x = hand_landmarks.landmark[0].x
            base_y = hand_landmarks.landmark[0].y
            
            for lm in hand_landmarks.landmark:
                landmarks_data.extend([lm.x - base_x, lm.y - base_y])
            
            features = np.array(landmarks_data).reshape(1, -1)
            
            # 1. Dự đoán ra chữ cái (VD: "A")
            prediction = model.predict(features)
            
            # 2. TÍNH TOÁN ĐỘ TIN CẬY (CONFIDENCE)
            confidence = 0.0
            try:
                # Lấy mảng xác suất của tất cả các lớp
                probabilities = model.predict_proba(features)
                # Nhặt ra con số cao nhất
                max_prob = np.max(probabilities)
                # Nhân 100 và làm tròn 2 chữ số (VD: 0.8912 -> 89.12)
                confidence = round(max_prob * 100, 2)
            except AttributeError:
                # Đề phòng model của bạn dùng thuật toán không hỗ trợ predict_proba
                confidence = 100.0
            
            draw_points = [{"x": lm.x, "y": lm.y} for lm in hand_landmarks.landmark]
            
            # TRẢ VỀ 3 BIẾN: Chữ cái, Tọa độ, và Độ tin cậy
            return str(prediction[0]), draw_points, confidence
        else:
            return "", [], 0.0
            
    except Exception as e:
        print("Lỗi xử lý ảnh trên Server:", e)
        return "Lỗi", [], 0.0

async def sign_to_text(landmarks: list, db: Session) -> str:
    pass 
async def text_to_sign(text: str):
    return "URL_video_demo"
async def text_to_speech(text: str):
    return "base64_audio_data"