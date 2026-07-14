from fastapi import APIRouter, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.core.database import get_db
from app.api.v1.dependencies import get_current_user
from datetime import datetime

router = APIRouter(prefix="/feedback", tags=["Feedback"])

@router.post("")
# Đổi thành async, đổi db sang AsyncIOMotorDatabase của MongoDB
async def send_feedback(
    content: str, 
    current_user: dict = Depends(get_current_user), # current_user giờ là dict
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    # Tạo object Dictionary (JSON) cho MongoDB
    new_feedback = {
        "user_id": current_user["id"], # Lấy ID của user hiện tại dạng chuỗi
        "content": content,
        "status": "pending",
        "created_at": datetime.utcnow()
    }
    
    # Lưu vào database MongoDB
    result = await db["feedbacks"].insert_one(new_feedback)
    
    # Lấy ID vừa được tự động sinh ra
    return {"id": str(result.inserted_id), "message": "Feedback sent"}