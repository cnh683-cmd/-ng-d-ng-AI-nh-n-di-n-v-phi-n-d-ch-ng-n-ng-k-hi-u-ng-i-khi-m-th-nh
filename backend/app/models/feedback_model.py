from pydantic import BaseModel, Field
from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime
from app.core.database import Base

# ==========================================
# 1. SQLALCHEMY MODEL (Tạo bảng feedbacks)
# ==========================================
class Feedback(Base):
    __tablename__ = "feedbacks"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True) # Lưu ID user dạng số nguyên
    content = Column(Text, nullable=False)
    status = Column(String(50), default="pending")
    created_at = Column(DateTime, default=datetime.utcnow)

# ==========================================
# 2. PYDANTIC SCHEMAS (Giao tiếp API)
# ==========================================
class FeedbackBase(BaseModel):
    user_id: int # Đổi từ str sang int cho khớp với SQL
    content: str
    status: str = "pending"
    created_at: datetime = Field(default_factory=datetime.utcnow)

class FeedbackCreate(FeedbackBase):
    pass

class FeedbackResponse(FeedbackBase):
    id: int # Đổi id từ str sang int

    class Config:
        from_attributes = True