import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader
from ai.dataset import WLASLDataset
from ai.models.sign_cnn import SignCNN
from tqdm import tqdm
import os

def train():
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    print(f"Using device: {device}")

    # Đường dẫn dữ liệu
    json_path = 'ai/data/wlasl/WLASL_v0.3.json'
    video_dir = 'ai/data/wlasl/videos'
    
    # Tạo dataset
    train_dataset = WLASLDataset(json_path, video_dir, split='train')
    val_dataset = WLASLDataset(json_path, video_dir, split='val')
    
    train_loader = DataLoader(train_dataset, batch_size=8, shuffle=True, num_workers=2)
    val_loader = DataLoader(val_dataset, batch_size=8, shuffle=False, num_workers=2)
    
    num_classes = len(train_dataset.label_map)
    model = SignCNN(num_classes).to(device)
    
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=0.001)
    scheduler = optim.lr_scheduler.StepLR(optimizer, step_size=10, gamma=0.1)
    
    epochs = 30
    best_acc = 0.0
    
    for epoch in range(epochs):
        model.train()
        running_loss = 0.0
        for videos, labels in tqdm(train_loader, desc=f'Epoch {epoch+1}/{epochs} Training'):
            videos, labels = videos.to(device), labels.to(device)
            # videos shape: (batch, frames, C, H, W)
            # Lấy trung bình hoặc max qua frames để có vector đặc trưng cho video
            # Cách đơn giản: lấy frame giữa hoặc trung bình
            # Ở đây ta lấy frame đầu tiên (có thể cải thiện)
            frames = videos[:, 0, :, :, :]  # (batch, C, H, W)
            optimizer.zero_grad()
            outputs = model(frames)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()
            running_loss += loss.item()
        
        # Validation
        model.eval()
        correct = 0
        total = 0
        with torch.no_grad():
            for videos, labels in tqdm(val_loader, desc='Validating'):
                videos, labels = videos.to(device), labels.to(device)
                frames = videos[:, 0, :, :, :]
                outputs = model(frames)
                _, predicted = torch.max(outputs, 1)
                total += labels.size(0)
                correct += (predicted == labels).sum().item()
        
        acc = 100 * correct / total
        print(f'Epoch {epoch+1}, Loss: {running_loss/len(train_loader):.4f}, Val Acc: {acc:.2f}%')
        scheduler.step()
        
        if acc > best_acc:
            best_acc = acc
            torch.save(model.state_dict(), 'models/sign_cnn_best.pth')
            print(f'Best model saved with acc: {best_acc:.2f}%')

if __name__ == '__main__':
    train()