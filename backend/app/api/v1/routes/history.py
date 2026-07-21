from fastapi import APIRouter, Depends, HTTPException
from app.api.v1.dependencies import get_current_user
from app.core.database import get_db
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.models.history_model import HistoryCreate, HistoryResponse
from bson import ObjectId
from datetime import datetime
from typing import List

router = APIRouter(prefix="/history", tags=["History"])

# API Lưu lịch sử
@router.post("/", response_model=dict)
async def create_history(
    data: HistoryCreate,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    history_doc = {
        "user_id": ObjectId(current_user["id"]),
        "input_type": data.input_type,
        "input_content": data.input_content,
        "output_content": data.output_content,  # Mảng các chữ cái ký hiệu
        "timestamp": datetime.utcnow()  # Sử dụng utcnow đồng bộ với database
    }
    result = await db["histories"].insert_one(history_doc)
    return {"message": "Lưu lịch sử thành công", "id": str(result.inserted_id)}

# API Lấy danh sách lịch sử
@router.get("/", response_model=List[HistoryResponse])
async def get_history(
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    # Lấy lịch sử của user hiện tại và sắp xếp mới nhất lên đầu theo timestamp
    cursor = db["histories"].find({"user_id": ObjectId(current_user["id"])}).sort("timestamp", -1)
    histories = []
    async for doc in cursor:
        doc["id"] = str(doc["_id"])
        doc["user_id"] = str(doc["user_id"])
        histories.append(doc)
    return histories