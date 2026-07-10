import cv2
import mediapipe as mp
import numpy as np

mp_hands = mp.solutions.hands
hands = mp_hands.Hands(static_image_mode=True, max_num_hands=1, min_detection_confidence=0.5)

def crop_hand_region(image, bbox=None, expand_ratio=0.2):
    """
    Nếu có bbox, crop và expand một chút để bao quanh tay.
    Nếu không có bbox, dùng MediaPipe để phát hiện bàn tay và crop.
    """
    if bbox:
        x1, y1, x2, y2 = bbox
        h, w = image.shape[:2]
        # Mở rộng bbox
        expand_w = int((x2 - x1) * expand_ratio)
        expand_h = int((y2 - y1) * expand_ratio)
        x1 = max(0, x1 - expand_w)
        y1 = max(0, y1 - expand_h)
        x2 = min(w, x2 + expand_w)
        y2 = min(h, y2 + expand_h)
        cropped = image[y1:y2, x1:x2]
        return cropped if cropped.size > 0 else image
    else:
        # Dùng MediaPipe detect hand
        rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        result = hands.process(rgb)
        if result.multi_hand_landmarks:
            h, w = image.shape[:2]
            x_min, y_min = w, h
            x_max, y_max = 0, 0
            for lm in result.multi_hand_landmarks[0].landmark:
                x, y = int(lm.x * w), int(lm.y * h)
                x_min = min(x_min, x)
                y_min = min(y_min, y)
                x_max = max(x_max, x)
                y_max = max(y_max, y)
            # Mở rộng thêm một chút
            expand = 20
            x_min = max(0, x_min - expand)
            y_min = max(0, y_min - expand)
            x_max = min(w, x_max + expand)
            y_max = min(h, y_max + expand)
            cropped = image[y_min:y_max, x_min:x_max]
            return cropped if cropped.size > 0 else image
        else:
            return image  # fallback

def preprocess_frame(frame, target_size=(224, 224), use_mediapipe=True):
    """Tiền xử lý một frame: crop tay, resize, normalize."""
    # Crop vùng tay (nếu có)
    if use_mediapipe:
        cropped = crop_hand_region(frame)
    else:
        cropped = frame
    # Resize
    resized = cv2.resize(cropped, target_size)
    # Chuyển RGB và normalize về [0,1]
    img = cv2.cvtColor(resized, cv2.COLOR_BGR2RGB)
    img = img.astype(np.float32) / 255.0
    # Chuyển sang (C, H, W)
    img = np.transpose(img, (2, 0, 1))
    return img