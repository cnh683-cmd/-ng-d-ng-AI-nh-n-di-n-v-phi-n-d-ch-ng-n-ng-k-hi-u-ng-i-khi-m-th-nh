import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
import pickle
import os
import numpy as np

# Định vị đường dẫn tuyệt đối để chạy ở bất kỳ đâu cũng không bị lỗi FileNotFoundError
current_dir = os.path.dirname(os.path.abspath(__file__))
data_path = os.path.join(current_dir, "app", "models", "asl_data.csv")
model_path = os.path.join(current_dir, "app", "models", "asl_model.pkl")

print(f"🔄 Đang nạp dữ liệu huấn luyện từ: {data_path}")

try:
    df = pd.read_csv(data_path)
except FileNotFoundError:
    print(f"❌ LỖI: Không tìm thấy file dữ liệu tại {data_path}. Bạn cần chạy file collect_data.py trước!")
    exit()

if df.empty or len(df) < 10:
    print("❌ LỖI: Dữ liệu quá ít để huấn luyện! Hãy chạy collect_data.py và lưu nhiều mẫu hơn.")
    exit()

# Tách nhãn (chữ cái) và dữ liệu tọa độ (42 đặc trưng)
X = df.drop('label', axis=1).values
y = df['label'].values

unique_classes = np.unique(y)
print(f"\nPhát hiện {len(unique_classes)} ký tự trong cơ sở dữ liệu VSL:")
print(", ".join(unique_classes))
print(f"Tổng số mẫu nạp vào hệ thống: {len(X)} mẫu.")

# Chia dữ liệu: 80% để học, 20% để kiểm định độ chính xác
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

print("\n🧠 AI đang tiến hành phân tích và học tập mẫu tay...")
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Đánh giá năng lực của AI
score = model.score(X_test, y_test)
print(f"🎯 ĐỘ CHÍNH XÁC CỦA MÔ HÌNH: {score * 100:.2f}%")

# Lưu mô hình vào đúng thư mục Backend
os.makedirs(os.path.dirname(model_path), exist_ok=True)
with open(model_path, 'wb') as f:
    pickle.dump(model, f)

print(f"\n✅ THÀNH CÔNG! Đã đóng gói mô hình AI hoạt động tại: {model_path}")
print("👉 Hãy bật lại server FastAPI để hệ thống tự nhận diện mô hình mới!")