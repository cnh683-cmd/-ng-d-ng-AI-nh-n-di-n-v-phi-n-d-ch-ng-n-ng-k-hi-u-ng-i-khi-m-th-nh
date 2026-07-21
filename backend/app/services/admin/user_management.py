from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
from fastapi import HTTPException

async def get_all_users(db: AsyncIOMotorDatabase, skip: int = 0, limit: int = 100):
    cursor = db["users"].find().skip(skip).limit(limit)
    users = await cursor.to_list(length=limit)
    for user in users:
        user["id"] = str(user.pop("_id"))
    return users

async def toggle_user_active(db: AsyncIOMotorDatabase, user_id: str):
    user = await db["users"].find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    new_status = not user.get("is_active", True)
    await db["users"].update_one({"_id": ObjectId(user_id)}, {"$set": {"is_active": new_status}})
    return {"user_id": user_id, "is_active": new_status}

async def delete_user(db: AsyncIOMotorDatabase, user_id: str):
    result = await db["users"].delete_one({"_id": ObjectId(user_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User deleted"}

# --- THÊM HÀM NÀY VÀO CUỐI FILE ---
async def update_user_info(db: AsyncIOMotorDatabase, user_id: str, update_data: dict):
    # Chỉ cho phép cập nhật các trường an toàn (ví dụ: full_name)
    allowed_data = {k: v for k, v in update_data.items() if k in ["full_name"]}
    
    if not allowed_data:
        return {"message": "Không có dữ liệu hợp lệ để cập nhật"}
        
    result = await db["users"].update_one(
        {"_id": ObjectId(user_id)}, 
        {"$set": allowed_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
        
    return {"message": "Cập nhật thành công", "updated_data": allowed_data}