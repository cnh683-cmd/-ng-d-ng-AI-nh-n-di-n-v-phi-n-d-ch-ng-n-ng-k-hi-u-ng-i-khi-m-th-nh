import os
import shutil
from sqlalchemy.orm import Session
from datetime import datetime
from fastapi import UploadFile, HTTPException
from app.models.model_db import Model # Đảm bảo bạn đã import đúng đường dẫn đến class Model SQL

MODEL_DIR = "models/"

async def save_model_file(file: UploadFile, version: str):
    # Đảm bảo thư mục tồn tại
    os.makedirs(MODEL_DIR, exist_ok=True)
    file_path = os.path.join(MODEL_DIR, f"sign_model_{version}.pth")
    with open(file_path, "wb") as f:
        shutil.copyfileobj(file.file, f)
    return file_path

def add_model_entry(db: Session, version: str, file_path: str, accuracy: float = 0.0):
    # Tạo object Model theo chuẩn SQLAlchemy
    new_model = Model(
        version=version,
        file_path=file_path,
        accuracy=accuracy,
        uploaded_at=datetime.utcnow()
    )
    db.add(new_model)
    db.commit()
    db.refresh(new_model)
    return new_model.id

def get_models(db: Session):
    # Truy vấn lấy danh sách model và sắp xếp theo thời gian mới nhất
    return db.query(Model).order_by(Model.uploaded_at.desc()).limit(100).all()