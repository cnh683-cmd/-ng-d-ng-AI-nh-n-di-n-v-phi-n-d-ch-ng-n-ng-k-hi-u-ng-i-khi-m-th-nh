from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.models.user_model import UserUpdate
from app.core.security import hash_password

async def get_user_by_id(db: AsyncIOMotorDatabase, user_id: str):
    # Tìm user bằng ObjectId
    return await db["users"].find_one({"_id": ObjectId(user_id)})

async def update_user_profile(db: AsyncIOMotorDatabase, user_id: str, update_data: UserUpdate):
    # Lấy các trường có dữ liệu để update (loại bỏ trường None)
    update_dict = update_data.model_dump(exclude_unset=True)
    
    # Nếu người dùng có đổi mật khẩu thì băm lại mật khẩu mới
    if "password" in update_dict and update_dict["password"]:
        update_dict["hashed_password"] = hash_password(update_dict.pop("password"))
        
    if update_dict:
        # Cập nhật vào MongoDB ($set)
        await db["users"].update_one(
            {"_id": ObjectId(user_id)},
            {"$set": update_dict}
        )
        
    # Trả về thông tin mới nhất
    return await get_user_by_id(db, user_id)