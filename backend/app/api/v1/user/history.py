from fastapi import APIRouter, Depends, Query, status, HTTPException
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.core.database import get_db
# Import cả 2 hàm từ service
from app.services.user.history_service import get_histories_by_user, create_history
from app.api.v1.dependencies import get_current_user
from app.models.history_model import HistoryCreate, HistoryResponse
from typing import List

router = APIRouter(prefix="/history", tags=["History"])

# 1. API Lấy lịch sử dịch (GET)
@router.get("", response_model=List[HistoryResponse])
async def get_history(
    skip: int = Query(0), 
    limit: int = Query(10), 
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    # Gọi service lấy danh sách
    histories = await get_histories_by_user(db, current_user["id"], skip, limit)
    return histories


# 2. API Lưu lịch sử dịch mới (POST)
@router.post("", status_code=status.HTTP_201_CREATED)
async def save_history(
    data: HistoryCreate,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    try:
        # Gọi service tạo mới, truyền db, user_id lấy từ token và data body vào
        history_id = await create_history(db, current_user["id"], data)
        return {"message": "Lưu lịch sử thành công", "id": history_id}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Lỗi hệ thống khi lưu trữ: {str(e)}"
        )