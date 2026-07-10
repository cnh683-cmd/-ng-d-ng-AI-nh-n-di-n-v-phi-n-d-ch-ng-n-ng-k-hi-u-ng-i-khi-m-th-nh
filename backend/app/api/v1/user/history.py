from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.user.history_service import get_histories_by_user
from app.api.v1.dependencies import get_current_user

# Import User của SQL thay cho UserInDB cũ
from app.models.user_model import User

router = APIRouter(prefix="/history", tags=["History"])

@router.get("")
# Bỏ async, truyền thêm db: Session
def get_history(
    skip: int = Query(0), 
    limit: int = Query(10), 
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Truyền db vào, không cần await, không cần ép kiểu str() cho ID
    histories = get_histories_by_user(db, current_user.id, skip, limit)
    return histories