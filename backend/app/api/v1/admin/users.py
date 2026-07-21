from fastapi import APIRouter, Depends, Query
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.core.database import get_db
# Đã import thêm hàm xử lý cập nhật update_user_info ở cuối dòng này
from app.services.admin.user_management import get_all_users, toggle_user_active, delete_user, update_user_info
from app.api.v1.dependencies import get_current_admin

router = APIRouter(prefix="/admin/users", tags=["Admin - Users"])

@router.get("")
async def list_users(
    skip: int = Query(0), 
    limit: int = Query(100), 
    admin: dict = Depends(get_current_admin),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    return await get_all_users(db, skip, limit)

@router.patch("/{user_id}/toggle")
async def toggle_user(
    user_id: str, 
    admin: dict = Depends(get_current_admin),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    return await toggle_user_active(db, user_id)

@router.delete("/{user_id}")
async def remove_user(
    user_id: str, 
    admin: dict = Depends(get_current_admin),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    return await delete_user(db, user_id)

# Thêm API PUT xử lý sửa thông tin người dùng ở đây
@router.put("/{user_id}")
async def update_user(
    user_id: str, 
    update_data: dict, 
    admin: dict = Depends(get_current_admin),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    return await update_user_info(db, user_id, update_data)