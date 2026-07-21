import cv2
import mediapipe as mp
import pickle
import numpy as np
import os

# Định vị mô hình AI nằm trong backend/app/models
current_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(current_dir, "app", "models", "asl_model.pkl")

if not os.path.exists(model_path):
    print(f"⚠️ Lỗi: Không tìm thấy mô hình AI tại {model_path}")
    print("Vui lòng thực hiện chạy file train_model.py trước!")
    exit()

with open(model_path, 'rb') as f:
    model = pickle.load(f)
print("✅ Đã tải mô hình AI thành công! Đang mở webcam test...")

mp_hands = mp.solutions.hands
hands = mp_hands.Hands(max_num_hands=1, min_detection_confidence=0.7)
mp_draw = mp.solutions.drawing_utils

cap = cv2.VideoCapture(0)

while True:
    ret, frame = cap.read()
    if not ret:
        break
    
    frame = cv2.flip(frame, 1)
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    result = hands.process(rgb_frame)
    
    if result.multi_hand_landmarks:
        for hand_landmarks in result.multi_hand_landmarks:
            mp_draw.draw_landmarks(frame, hand_landmarks, mp_hands.HAND_CONNECTIONS)
            
            landmarks_data = []
            base_x = hand_landmarks.landmark[0].x
            base_y = hand_landmarks.landmark[0].y
            
            for lm in hand_landmarks.landmark:
                landmarks_data.extend([lm.x - base_x, lm.y - base_y])
            
            try:
                features = np.array(landmarks_data).reshape(1, -1)
                prediction = model.predict(features)
                current_letter = str(prediction[0])
                
                # Vẽ nhãn kết quả trực tiếp lên khung hình camera
                cv2.rectangle(frame, (10, 10), (150, 80), (0, 0, 0), cv2.FILLED)
                cv2.putText(frame, current_letter, (50, 65), cv2.FONT_HERSHEY_SIMPLEX, 2, (0, 255, 0), 3)
            except Exception as e:
                print("Lỗi nhận diện:", e)

    cv2.imshow("Test AI truc tiep - Nhan ESC de thoat", frame)
    
    if cv2.waitKey(1) & 0xFF == 27:
        break

cap.release()
cv2.destroyAllWindows()