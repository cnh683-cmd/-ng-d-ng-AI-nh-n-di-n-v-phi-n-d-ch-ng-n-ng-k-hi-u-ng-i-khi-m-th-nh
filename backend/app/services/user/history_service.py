from typing import Any  # Dùng Any để dọn sạch lỗi Pylance
from app.models.history_model import HistoryCreate
from datetime import datetime

async def create_history(db: Any, user_id: str, history: HistoryCreate):
    """
    Tạo lịch sử mới. 
    Nhận user_id từ Token ở Router truyền xuống thay vì lấy trong history payload.
    """
    # Khởi tạo object Dictionary (ánh xạ trực tiếp thành JSON trong MongoDB)
    db_history = {
        "user_id": user_id,  # Lưu dạng chuỗi để đồng bộ, tránh lỗi ép kiểu ObjectId
        "input_type": history.input_type,
        "input_content": history.input_content,
        "output_content": history.output_content,
        "timestamp": datetime.utcnow()
    }
    
    # Thêm vào Database
    result = await db["histories"].insert_one(db_history)
    
    return str(result.inserted_id) # Trả về ID vừa được MongoDB tự động tạo


async def get_histories_by_user(db: Any, user_id: str, skip: int = 0, limit: int = 50):
    """
    Truy vấn danh sách lịch sử của user theo user_id dạng chuỗi.
    """
    # Tìm kiếm theo user_id chuỗi, sắp xếp giảm dần theo thời gian và phân trang
    cursor = db["histories"].find({"user_id": user_id}).sort("timestamp", -1).skip(skip).limit(limit)
    histories = await cursor.to_list(length=limit)
    
    # Đổi tên _id của MongoDB thành id để Frontend dễ đọc
    for h in histories:
        h["id"] = str(h.pop("_id"))
        
    return histories
