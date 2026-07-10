from pydantic import BaseModel, Field
from sqlalchemy import Column, Integer, String, Text
from app.core.database import Base

# ==========================================
# 1. SQLALCHEMY MODEL (Bảng từ điển)
# ==========================================
class Dictionary(Base):
    __tablename__ = "dictionary"

    id = Column(Integer, primary_key=True, index=True)
    word = Column(String(255), unique=True, index=True)
    meaning = Column(Text)
    video_url = Column(String(500))

# ==========================================
# 2. PYDANTIC SCHEMAS (Kiểm soát dữ liệu)
# ==========================================
class DictionaryBase(BaseModel):
    word: str
    meaning: str
    video_url: str

class DictionaryCreate(DictionaryBase):
    pass

class DictionaryResponse(DictionaryBase):
    id: int

    class Config:
        from_attributes = True