from pydantic import BaseModel, Field
from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime
from app.core.database import Base

# ==========================================
# 1. SQLALCHEMY MODEL (Tự động tạo bảng histories trong SSMS)
# ==========================================
class History(Base):
    __tablename__ = "histories"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True) # Lưu ID của user (số nguyên)
    input_type = Column(String(50))       # 'text' or 'sign'
    input_content = Column(Text)          # Dùng Text để lưu được chuỗi dài
    output_content = Column(Text)
    timestamp = Column(DateTime, default=datetime.utcnow)

# ==========================================
# 2. PYDANTIC SCHEMAS (Kiểm soát dữ liệu API)
# ==========================================
class HistoryBase(BaseModel):
    user_id: int  # Đổi từ str sang int cho khớp với SQL
    input_type: str  
    input_content: str
    output_content: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class HistoryCreate(HistoryBase):
    pass

class HistoryResponse(HistoryBase):
    id: int # Đổi id từ str sang int

    class Config:
        from_attributes = True # Cho phép Pydantic đọc dữ liệu từ model của SQLAlchemy