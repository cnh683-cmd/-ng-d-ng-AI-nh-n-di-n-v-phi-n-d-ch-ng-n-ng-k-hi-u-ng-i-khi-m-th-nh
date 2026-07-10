from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.admin.user_management import get_all_users, toggle_user_active, delete_user
from app.api.v1.dependencies import get_current_admin
from app.models.user_model import User

router = APIRouter(prefix="/admin/users", tags=["Admin - Users"])

@router.get("")
# Bỏ async, thêm db: Session
def list_users(
    skip: int = Query(0), 
    limit: int = Query(100), 
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    # Truyền db vào hàm service
    return get_all_users(db, skip, limit)

@router.patch("/{user_id}/toggle")
# Bỏ async, thêm db: Session
def toggle_user(
    user_id: int, # Nhận vào int thay vì str
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    # Truyền db vào hàm service
    return toggle_user_active(db, user_id)

@router.delete("/{user_id}")
# Bỏ async, thêm db: Session
def remove_user(
    user_id: int, # Nhận vào int thay vì str
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    # Truyền db vào hàm service
    return delete_user(db, user_id)