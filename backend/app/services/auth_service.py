from sqlalchemy.orm import Session
from app.models.user_model import User, UserCreate
from app.core.security import hash_password, verify_password
from fastapi import HTTPException, status

# Xóa từ khóa async đi vì SQLAlchemy chạy theo luồng đồng bộ
def register_user(db: Session, user_data: UserCreate):
    # Tìm user theo email
    existing = db.query(User).filter(User.email == user_data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed = hash_password(user_data.password)
    
    # Tạo bản ghi mới
    new_user = User(
        email=user_data.email,
        full_name=user_data.full_name,
        hashed_password=hashed,
        role=user_data.role,
        is_active=user_data.is_active
    )
    
    db.add(new_user)
    db.commit() # Lưu vào database
    db.refresh(new_user) # Cập nhật lại ID vừa được tự tạo
    
    return {"id": new_user.id, "email": new_user.email}

def authenticate_user(db: Session, email: str, password: str):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    if not verify_password(password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    if not user.is_active:
        raise HTTPException(status_code=403, detail="Account is disabled")
    return user