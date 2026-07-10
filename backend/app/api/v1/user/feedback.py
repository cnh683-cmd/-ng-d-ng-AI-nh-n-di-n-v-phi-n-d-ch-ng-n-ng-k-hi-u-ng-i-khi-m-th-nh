from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.feedback_model import Feedback, FeedbackCreate
from app.api.v1.dependencies import get_current_user
from app.models.user_model import User

router = APIRouter(prefix="/feedback", tags=["Feedback"])

@router.post("")
# Bỏ async, thêm db: Session để tương tác với SQL
def send_feedback(
    content: str, 
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Tạo object Feedback mới
    new_feedback = Feedback(
        user_id=current_user.id, # ID dạng số nguyên
        content=content,
        status="pending"
    )
    
    # Lưu vào database
    db.add(new_feedback)
    db.commit()
    db.refresh(new_feedback)
    
    return {"id": new_feedback.id, "message": "Feedback sent"}