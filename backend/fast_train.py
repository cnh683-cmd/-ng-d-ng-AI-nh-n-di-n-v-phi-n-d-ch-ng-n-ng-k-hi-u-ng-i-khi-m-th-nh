import pandas as pd
import pickle
from sklearn.ensemble import RandomForestClassifier
import os
import numpy as np

# 1. Thiết lập đường dẫn
current_dir = os.path.dirname(os.path.abspath(__file__))
# Đường dẫn tìm tệp CSV gốc của bạn
csv_path = os.path.join(current_dir, "app", "models", "asl_data.csv")
# Đường dẫn lưu tệp mô hình (.pkl)
model_save_path = os.path.join(current_dir, "app", "models", "asl_model.pkl")

print(f"Đang tiến hành đọc dữ liệu thực tế từ: {csv_path}")

try:
    # 2. Đọc tệp dữ liệu asl_data.csv
    df = pd.read_csv(csv_path)
    
    # 3. Phân tách dữ liệu
    # Cột đầu tiên (index 0) là nhãn (Label - chữ cái)
    y = df.iloc[:, 0].values 
    # Các cột còn lại (từ index 1 trở đi) là tọa độ (Features)
    X = df.iloc[:, 1:].values
    
    # Kiểm tra danh sách các chữ cái có trong tệp
    unique_classes = np.unique(y)
    print(f"\nPhát hiện {len(unique_classes)} ký tự trong cơ sở dữ liệu:")
    print(", ".join(unique_classes))
    print(f"Tổng số mẫu huấn luyện: {len(X)} mẫu.")
    
    print("\nĐang tiến hành huấn luyện AI (quá trình này mất vài giây)...")
    
    # 4. Huấn luyện mô hình
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X, y)
    
    # 5. Lưu mô hình
    os.makedirs(os.path.dirname(model_save_path), exist_ok=True)
    with open(model_save_path, 'wb') as f:
        pickle.dump(model, f)
        
    print(f"\n✅ HOÀN TẤT! Đã tạo thành công mô hình nhận diện thực tế tại: {model_save_path}")
    print("👉 Hãy khởi động lại Server FastAPI để áp dụng mô hình mới!")

except FileNotFoundError:
    print(f"\n❌ LỖI: Không tìm thấy tệp {csv_path}.")
    print("Vui lòng đảm bảo tệp 'asl_data.csv' được đặt đúng trong thư mục 'backend/app/models/'.")
except Exception as e:
    print(f"\n❌ LỖI KHÔNG MONG MUỐN: {e}")