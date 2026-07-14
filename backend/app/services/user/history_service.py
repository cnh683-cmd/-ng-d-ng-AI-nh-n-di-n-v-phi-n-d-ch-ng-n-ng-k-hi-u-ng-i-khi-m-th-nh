from motor.motor_asyncio import AsyncIOMotorDatabase
from app.models.history_model import HistoryCreate
from datetime import datetime

async def create_history(db: AsyncIOMotorDatabase, history: HistoryCreate):
    # Khởi tạo object Dictionary (ánh xạ trực tiếp thành JSON trong MongoDB)
    db_history = {
        "user_id": history.user_id,
        "input_type": history.input_type,
        "input_content": history.input_content,
        "output_content": history.output_content,
        "timestamp": datetime.utcnow()
    }
    
    # Thêm vào Database
    result = await db["histories"].insert_one(db_history)
    
    return str(result.inserted_id) # Trả về ID vừa được MongoDB tự động tạo

async def get_histories_by_user(db: AsyncIOMotorDatabase, user_id: str, skip: int = 0, limit: int = 50):
    # Truy vấn collection histories, lọc, sắp xếp giảm dần theo thời gian và phân trang
    cursor = db["histories"].find({"user_id": user_id}).sort("timestamp", -1).skip(skip).limit(limit)
    histories = await cursor.to_list(length=limit)
    
    # Đổi tên _id của MongoDB thành id để Frontend dễ đọc
    for h in histories:
        h["id"] = str(h.pop("_id"))
        
    return histories