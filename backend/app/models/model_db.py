from sqlalchemy import Column, Integer, String, Float, DateTime
from app.core.database import Base
from datetime import datetime

class Model(Base):
    __tablename__ = "models"

    id = Column(Integer, primary_key=True, index=True)
    version = Column(String(50), nullable=False)
    file_path = Column(String(500), nullable=False)
    accuracy = Column(Float, default=0.0)
    uploaded_at = Column(DateTime, default=datetime.utcnow)