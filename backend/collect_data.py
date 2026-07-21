import cv2
import mediapipe as mp
import csv
import os

# Tự động định vị và lưu vào đúng thư mục của Backend
current_dir = os.path.dirname(os.path.abspath(__file__))
csv_path = os.path.join(current_dir, "app", "models", "asl_data.csv")
os.makedirs(os.path.dirname(csv_path), exist_ok=True)

mp_hands = mp.solutions.hands
hands = mp_hands.Hands(max_num_hands=1, min_detection_confidence=0.7)
mp_draw = mp.solutions.drawing_utils

# Bảng 29 chữ cái tiếng Việt (VSL) đầy đủ
labels = ['A', 'Ă', 'Â', 'B', 'C', 'D', 'Đ', 'E', 'Ê', 'G', 'H', 'I', 'K', 'L', 'M', 'N', 'O', 'Ô', 'Ơ', 'P', 'Q', 'R', 'S', 'T', 'U', 'Ư', 'V', 'X', 'Y']

current_idx = 0
samples_collected = 0

# Kiểm tra file CSV cũ để tránh ghi đè mất dữ liệu đã thu thập trước đó
file_exists = os.path.exists(csv_path)
mode = 'w' if not file_exists else 'a'

with open(csv_path, mode, newline='', encoding='utf-8') as f:
    writer = csv.writer(f)
    if mode == 'w':
        header = ['label']
        for i in range(21):
            header.extend([f'x{i}', f'y{i}'])
        writer.writerow(header)

    cap = cv2.VideoCapture(0)
    print(f"📡 Dữ liệu thu thập sẽ được ghi vào: {csv_path}")
    
    while True:
        ret, frame = cap.read()
        if not ret: 
            break
        
        frame = cv2.flip(frame, 1)
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        result = hands.process(rgb_frame)
        
        landmarks_data = []
        if result.multi_hand_landmarks:
            hand_landmarks = result.multi_hand_landmarks[0]
            mp_draw.draw_landmarks(frame, hand_landmarks, mp_hands.HAND_CONNECTIONS)
            
            base_x = hand_landmarks.landmark[0].x
            base_y = hand_landmarks.landmark[0].y
            
            for lm in hand_landmarks.landmark:
                landmarks_data.extend([lm.x - base_x, lm.y - base_y])
        
        current_letter = labels[current_idx]
        
        cv2.putText(frame, f"VSL: {current_letter} | Da luu: {samples_collected} mau", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)
        cv2.putText(frame, "Nhan SPACE luu mau. Nhan 'N' chuyen chu", (10, 70), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 0, 0), 2)
                
        cv2.imshow("Thu thap Data VSL - ESC de thoat", frame)
        key = cv2.waitKey(1) & 0xFF
        
        if key == 27: 
            break
        elif key == 32 and len(landmarks_data) > 0:  # Phím SPACE
            writer.writerow([current_letter] + landmarks_data)
            samples_collected += 1
        elif key == ord('n'):  # Phím 'N'
            current_idx += 1
            samples_collected = 0
            if current_idx >= len(labels):
                print("🎉 ĐÃ THU THẬP XONG TOÀN BỘ 29 CHỮ CÁI VSL!")
                break

    cap.release()
    cv2.destroyAllWindows()