from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user_model import User
from app.models.history_model import History # Giả định bạn có model History
from app.models.model_db import Model      # Model của bảng models
from app.api.v1.dependencies import get_current_admin

router = APIRouter(prefix="/admin/stats", tags=["Admin - Stats"])

@router.get("")
def get_system_stats(
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    # Đếm số lượng từ các bảng trong SQL Server
    total_users = db.query(User).count()
    total_histories = db.query(History).count()
    total_models = db.query(Model).count()
    
    return {
        "total_users": total_users,
        "total_histories": total_histories,
        "total_models": total_models
    }