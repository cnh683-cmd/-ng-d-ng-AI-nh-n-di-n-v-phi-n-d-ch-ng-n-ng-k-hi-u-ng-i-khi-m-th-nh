import torch
import cv2
import numpy as np
from PIL import Image
import torchvision.transforms as transforms

# Load model (giả định đường dẫn file model)
MODEL_PATH = "models/sign_cnn.pth"
model = torch.load(MODEL_PATH, map_location=torch.device('cpu'))
model.eval()

transform = transforms.Compose([
    transforms.Resize((64, 64)),
    transforms.ToTensor(),
])

async def predict_sign(image_bytes):
    # Chuyển đổi bytes thành ảnh
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    img_pil = Image.fromarray(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))
    
    # Preprocess
    img_tensor = transform(img_pil).unsqueeze(0)
    
    # Dự đoán
    with torch.no_grad():
        output = model(img_tensor)
        _, predicted = torch.max(output, 1)
        
    # Trả về kết quả (cần mapping index sang ký tự)
    return str(predicted.item())