import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
import pickle
import os

# 1. Định vị các file
current_dir = os.path.dirname(os.path.abspath(__file__))
data_path = os.path.join(current_dir, 'asl_data.csv')
model_dir = os.path.join(current_dir, 'models')
model_path = os.path.join(model_dir, 'asl_model.pkl')

print(f"🔄 Đang tìm đọc dữ liệu từ: {data_path}")

try:
    df = pd.read_csv(data_path)
except FileNotFoundError:
    print("❌ LỖI: Không tìm thấy file asl_data.csv! Bạn đã chạy file collect_data.py chưa?")
    exit()

if df.empty or len(df) < 10:
    print("❌ LỖI: Dữ liệu quá ít hoặc rỗng! Lúc chạy collect_data.py bạn nhớ bấm DẤU CÁCH (Space) nhiều lần để lưu ảnh nhé!")
    exit()

# 2. Chuẩn bị dữ liệu
X = df.drop('label', axis=1)
y = df['label']

# Chia dữ liệu: 80% để học, 20% để thi thử
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

print(f"🧠 Đang huấn luyện AI với {len(X_train)} mẫu tay...")
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# 3. Kiểm tra độ thông minh
score = model.score(X_test, y_test)
print(f"🎯 Độ chính xác của mô hình: {score * 100:.2f}%")

# 4. Xuất não thẳng vào thư mục models
if not os.path.exists(model_dir):
    os.makedirs(model_dir)

with open(model_path, 'wb') as f:
    pickle.dump(model, f)

print(f"✅ THÀNH CÔNG! Đã thay não mới tại: {model_path}")