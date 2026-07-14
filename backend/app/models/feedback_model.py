from pydantic import BaseModel, Field
from datetime import datetime

class FeedbackBase(BaseModel):
    user_id: str # Đổi sang string cho MongoDB
    content: str
    status: str = "pending"
    created_at: datetime = Field(default_factory=datetime.utcnow)

class FeedbackCreate(FeedbackBase):
    pass

class FeedbackResponse(FeedbackBase):
    id: str # Đổi sang string

    class Config:
        from_attributes = True