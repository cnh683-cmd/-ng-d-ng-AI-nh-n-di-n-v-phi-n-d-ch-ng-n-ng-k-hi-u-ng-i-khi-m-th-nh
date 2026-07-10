import os
import json
import cv2
import numpy as np
import torch
from torch.utils.data import Dataset, DataLoader
from ai.preprocessing.hand_cropper import preprocess_frame
from ai.preprocessing.video_loader import extract_frames
import random

class WLASLDataset(Dataset):
    def __init__(self, json_path, video_dir, split='train', target_size=(224, 224), max_frames=30, sample_rate=2):
        self.data = []
        self.label_map = {}
        with open(json_path, 'r') as f:
            wlasl = json.load(f)
        
        # Xây dựng map từ gloss sang index
        glosses = sorted(set([item['gloss'] for item in wlasl]))
        self.label_map = {gloss: idx for idx, gloss in enumerate(glosses)}
        
        # Lọc instances theo split
        for item in wlasl:
            gloss = item['gloss']
            for inst in item['instances']:
                if inst['split'] == split:
                    video_id = inst['video_id']
                    video_path = os.path.join(video_dir, f"{gloss}_{video_id}.mp4")
                    if os.path.exists(video_path):
                        self.data.append({
                            'video_path': video_path,
                            'label': self.label_map[gloss],
                            'bbox': inst.get('bbox'),
                            'gloss': gloss
                        })
        self.target_size = target_size
        self.max_frames = max_frames
        self.sample_rate = sample_rate

    def __len__(self):
        return len(self.data)

    def __getitem__(self, idx):
        item = self.data[idx]
        frames = extract_frames(item['video_path'], None, bbox=item['bbox'], target_size=self.target_size, sample_rate=self.sample_rate)
        # Lấy tối đa max_frames, nếu ít hơn thì padding
        if len(frames) > self.max_frames:
            frames = frames[:self.max_frames]
        else:
            # Padding với frame cuối cùng hoặc zero
            while len(frames) < self.max_frames:
                frames.append(frames[-1] if frames else np.zeros((self.target_size[0], self.target_size[1], 3), dtype=np.uint8))
        # Tiền xử lý từng frame
        processed = [preprocess_frame(f, self.target_size) for f in frames]
        # Stack thành tensor: (max_frames, C, H, W)
        video_tensor = torch.tensor(np.stack(processed), dtype=torch.float32)
        label = torch.tensor(item['label'], dtype=torch.long)
        return video_tensor, label