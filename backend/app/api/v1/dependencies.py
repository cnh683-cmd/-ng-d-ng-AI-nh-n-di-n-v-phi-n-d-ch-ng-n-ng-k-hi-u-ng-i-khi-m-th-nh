from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
from app.core.config import settings

# Import Database của MongoDB
from app.core.database import get_db

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")

# Thêm 'async' và đổi kiểu của db sang AsyncIOMotorDatabase
async def get_current_user(
    token: str = Depends(oauth2_scheme), 
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id_str: str = payload.get("sub")
        if user_id_str is None:
            raise credentials_exception
            
        # Kiểm tra ID có chuẩn định dạng ObjectId của MongoDB không
        if not ObjectId.is_valid(user_id_str):
            raise credentials_exception
        
    except JWTError:
        raise credentials_exception
    
    # Truy vấn bằng MongoDB
    user = await db["users"].find_one({"_id": ObjectId(user_id_str)})
    
    if user is None:
        raise credentials_exception
    if not user.get("is_active"):
        raise HTTPException(status_code=403, detail="Account is disabled")
        
    # Gắn thêm key 'id' để tương thích với các file khác
    user["id"] = str(user["_id"])
    return user # Trả về dictionary (JSON)

# Đổi kiểu dữ liệu của current_user thành dict
async def get_current_admin(current_user: dict = Depends(get_current_user)):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin privileges required")
    return current_user