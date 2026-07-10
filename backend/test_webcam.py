import cv2
import mediapipe as mp
import pickle
import numpy as np
import os

# 1. Tìm và load file Trí tuệ nhân tạo (Model)
current_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(current_dir, 'models', 'asl_model.pkl')

if not os.path.exists(model_path):
    print(f"⚠️ Lỗi: Không tìm thấy file model tại {model_path}")
    exit()

with open(model_path, 'rb') as f:
    model = pickle.load(f)
print("✅ Đã tải mô hình AI thành công! Đang bật camera...")

# 2. Khởi tạo MediaPipe (Bộ bắt nét tay)
mp_hands = mp.solutions.hands
hands = mp_hands.Hands(max_num_hands=1, min_detection_confidence=0.7)
mp_draw = mp.solutions.drawing_utils

# 3. Mở Camera
cap = cv2.VideoCapture(0)

while True:
    ret, frame = cap.read()
    if not ret:
        break
    
    # Lật ngược hình ảnh cho giống gương và chuyển hệ màu
    frame = cv2.flip(frame, 1)
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    
    # Đưa cho AI xử lý
    result = hands.process(rgb_frame)
    
    if result.multi_hand_landmarks:
        for hand_landmarks in result.multi_hand_landmarks:
            # Vẽ khung xương lên tay
            mp_draw.draw_landmarks(frame, hand_landmarks, mp_hands.HAND_CONNECTIONS)
            
            # Lấy tọa độ 21 điểm
            landmarks_data = []
            base_x = hand_landmarks.landmark[0].x
            base_y = hand_landmarks.landmark[0].y
            
            for lm in hand_landmarks.landmark:
                landmarks_data.extend([lm.x - base_x, lm.y - base_y])
            
            try:
                # Đưa 42 con số vào Model dự đoán
                features = np.array(landmarks_data).reshape(1, -1)
                prediction = model.predict(features)
                current_letter = str(prediction[0])
                
                # In chữ cái lên màn hình Camera
                cv2.rectangle(frame, (10, 10), (150, 80), (0, 0, 0), cv2.FILLED)
                cv2.putText(frame, current_letter, (50, 65), cv2.FONT_HERSHEY_SIMPLEX, 2, (0, 255, 0), 3)
            except Exception as e:
                print("Lỗi dự đoán:", e)

    # Hiển thị cửa sổ
    cv2.imshow("Test Nhan Dien VSL - Nhan ESC de thoat", frame)
    
    # Bấm phím ESC để tắt
    if cv2.waitKey(1) & 0xFF == 27:
        break

cap.release()
cv2.destroyAllWindows()