from fastapi import APIRouter, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.core.database import get_db
from app.api.v1.dependencies import get_current_admin

router = APIRouter(prefix="/admin/stats", tags=["Admin - Stats"])

@router.get("")
async def get_system_stats(
    admin: dict = Depends(get_current_admin),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    # Đếm số lượng trực tiếp bằng count_documents của MongoDB
    total_users = await db["users"].count_documents({})
    total_histories = await db["histories"].count_documents({})
    total_models = await db["models"].count_documents({})
    
    return {
        "total_users": total_users,
        "total_histories": total_histories,
        "total_models": total_models
    }