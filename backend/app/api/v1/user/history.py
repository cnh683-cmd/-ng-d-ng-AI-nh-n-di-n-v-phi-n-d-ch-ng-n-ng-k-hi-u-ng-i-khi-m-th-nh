from fastapi import APIRouter, Depends, Query
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.core.database import get_db
from app.services.user.history_service import get_histories_by_user
from app.api.v1.dependencies import get_current_user

router = APIRouter(prefix="/history", tags=["History"])

@router.get("")
async def get_history(
    skip: int = Query(0), 
    limit: int = Query(10), 
    current_user: dict = Depends(get_current_user), # Dùng dict thay vì class User
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    # Gọi hàm có await, lấy ID chuẩn từ current_user
    histories = await get_histories_by_user(db, current_user["id"], skip, limit)
    return histories