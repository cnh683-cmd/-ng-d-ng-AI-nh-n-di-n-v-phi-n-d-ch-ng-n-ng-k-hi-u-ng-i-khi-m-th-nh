from app.models.user_model import UserCreate
from app.core.security import hash_password, verify_password
from fastapi import HTTPException
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorDatabase

async def register_user(db: AsyncIOMotorDatabase, user_data: UserCreate):
    # Tìm user trong collection "users"
    existing = await db["users"].find_one({"email": user_data.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Tạo object user dạng Dictionary (JSON)
    new_user = {
        "email": user_data.email,
        "full_name": user_data.full_name,
        "hashed_password": hash_password(user_data.password),
        "role": user_data.role,
        "is_active": user_data.is_active,
        "created_at": datetime.utcnow()
    }
    
    # Insert vào MongoDB
    result = await db["users"].insert_one(new_user)
    
    # Ép kiểu ObjectId của MongoDB thành chuỗi (string) để trả về cho Frontend
    new_user["id"] = str(result.inserted_id)
    return new_user

async def authenticate_user(db: AsyncIOMotorDatabase, email: str, password: str):
    user = await db["users"].find_one({"email": email})
    if not user or not verify_password(password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    
    # Đính kèm ID dạng string để lát nữa tạo Token
    user["id"] = str(user["_id"])
    return user