from sqlalchemy.orm import Session
from app.models.user_model import User
from fastapi import HTTPException, status

def get_all_users(db: Session, skip: int = 0, limit: int = 100):
    # Truy vấn lấy toàn bộ user từ bảng users trong SQL Server
    users = db.query(User).offset(skip).limit(limit).all()
    return users

def toggle_user_active(db: Session, user_id: int):
    # Tìm user theo ID (số nguyên)
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Đảo ngược trạng thái hoạt động
    user.is_active = not user.is_active
    db.commit()
    db.refresh(user)
    
    return {"user_id": user_id, "is_active": user.is_active}

def delete_user(db: Session, user_id: int):
    # Tìm và xóa user
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    db.delete(user)
    db.commit()
    return {"message": "User deleted"}