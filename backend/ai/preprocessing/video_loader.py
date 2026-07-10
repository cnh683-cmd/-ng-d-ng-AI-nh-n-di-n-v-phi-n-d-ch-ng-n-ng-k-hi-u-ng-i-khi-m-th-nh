import os
import json
import requests
import cv2
import numpy as np
from tqdm import tqdm
from urllib.parse import urlparse
import time

def load_wlasl_json(json_path):
    with open(json_path, 'r') as f:
        data = json.load(f)
    return data

def download_video(url, save_path):
    """Tải video từ URL, xử lý cả YouTube (cần youtube-dl) và direct link."""
    # Nếu là YouTube, dùng youtube-dl
    if 'youtube.com' in url or 'youtu.be' in url:
        import yt_dlp
        ydl_opts = {
            'outtmpl': save_path,
            'quiet': True,
            'format': 'mp4',
        }
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([url])
    else:
        # Direct download
        response = requests.get(url, stream=True)
        if response.status_code == 200:
            with open(save_path, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    f.write(chunk)
        else:
            raise Exception(f"Failed to download: {url}")

def extract_frames(video_path, output_dir, bbox=None, target_size=(224, 224), sample_rate=1):
    """
    Trích xuất frame từ video, crop theo bbox nếu có, resize về target_size.
    sample_rate: lấy 1 frame mỗi sample_rate frame.
    """
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        return []
    
    frames = []
    frame_count = 0
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        if frame_count % sample_rate == 0:
            if bbox:
                x1, y1, x2, y2 = bbox
                # Crop theo bbox
                cropped = frame[y1:y2, x1:x2]
                if cropped.size > 0:
                    resized = cv2.resize(cropped, target_size)
                    frames.append(resized)
            else:
                resized = cv2.resize(frame, target_size)
                frames.append(resized)
        frame_count += 1
    cap.release()
    return frames

# Ví dụ sử dụng:
# data = load_wlasl_json('ai/data/wlasl/WLASL_v0.3.json')
# for item in data:
#     gloss = item['gloss']
#     for inst in item['instances']:
#         url = inst['url']
#         video_id = inst['video_id']
#         save_path = f'ai/data/wlasl/videos/{gloss}_{video_id}.mp4'
#         if not os.path.exists(save_path):
#             download_video(url, save_path)
#         frames = extract_frames(save_path, None, bbox=inst['bbox'], target_size=(224,224))
#         # Lưu frames hoặc xử lý tiếp