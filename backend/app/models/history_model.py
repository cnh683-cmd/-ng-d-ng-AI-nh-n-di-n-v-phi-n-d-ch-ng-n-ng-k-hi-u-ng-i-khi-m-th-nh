from pydantic import BaseModel, Field
from datetime import datetime

class HistoryBase(BaseModel):
    user_id: str  # Đổi sang string
    input_type: str  
    input_content: str
    output_content: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class HistoryCreate(HistoryBase):
    pass

class HistoryResponse(HistoryBase):
    id: str # Đổi sang string

    class Config:
        from_attributes = True