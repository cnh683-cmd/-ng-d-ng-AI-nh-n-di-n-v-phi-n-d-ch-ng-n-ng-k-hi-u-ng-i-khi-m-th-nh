from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.feedback_model import Feedback
from app.api.v1.dependencies import get_current_admin
from app.models.user_model import User

router = APIRouter(prefix="/admin/feedback", tags=["Admin - Feedback"])

@router.get("")
def get_all_feedbacks(
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    # Lấy toàn bộ phản hồi từ bảng feedbacks
    return db.query(Feedback).all()