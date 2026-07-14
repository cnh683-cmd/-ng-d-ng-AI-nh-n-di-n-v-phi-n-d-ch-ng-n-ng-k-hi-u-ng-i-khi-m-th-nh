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