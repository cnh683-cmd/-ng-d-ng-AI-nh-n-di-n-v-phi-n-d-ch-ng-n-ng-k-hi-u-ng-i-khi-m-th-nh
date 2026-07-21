from pydantic import BaseModel
from datetime import datetime
from typing import List

class HistoryCreate(BaseModel):
    input_type: str = "text_to_sign"
    input_content: str
    output_content: List[str]  # Mảng lưu danh sách ký tự

class HistoryResponse(BaseModel):
    id: str
    user_id: str
    input_type: str
    input_content: str
    output_content: List[str]
    timestamp: datetime

    class Config:
        from_attributes = True