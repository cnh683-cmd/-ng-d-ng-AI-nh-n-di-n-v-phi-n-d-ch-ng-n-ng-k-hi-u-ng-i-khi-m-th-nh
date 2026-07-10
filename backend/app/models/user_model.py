from pydantic import BaseModel, EmailStr
from datetime import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime
from app.core.database import Base

# ==========================================
# 1. SQLALCHEMY MODEL (Dùng để tạo bảng trong SSMS)
# ==========================================
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(100))
    role = Column(String(50), default="user")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

# ==========================================
# 2. PYDANTIC SCHEMAS (Dùng để giao tiếp với Frontend)
# ==========================================
class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: str = "user"
    is_active: bool = True

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int  # Đổi từ chuỗi String sang số nguyên Integer
    created_at: datetime

    class Config:
        from_attributes = True # Cho phép Pydantic đọc dữ liệu từ model của SQLAlchemy

class UserUpdate(BaseModel):
    full_name: str | None = None
    email: EmailStr | None = None
    password: str | None = None