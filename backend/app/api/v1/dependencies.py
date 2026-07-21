from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from bson import ObjectId
from typing import Any
from app.core.config import settings
from app.core.database import get_db

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")

async def get_current_user(
    token: str = Depends(oauth2_scheme), 
    db: Any = Depends(get_db)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    # ------------------- ĐOẠN CODE DEBUG -------------------
    print("\n=== START DEBUG TOKEN VALIDATION ===")
    print(f"-> Token nhận được: {token[:20]}...{token[-10:] if len(token) > 20 else ''}")
    # ------------------------------------------------------

    try:
        # Chốt chặn 1: Giải mã Token
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        print(f"-> Payload giải mã thành công: {payload}")
        
        user_id_str: str = payload.get("sub")
        print(f"-> user_id_str (sub): '{user_id_str}'")
        
        if user_id_str is None:
            print("❌ LỖI: Trường 'sub' trong token bị trống (None)!")
            raise credentials_exception
            
        # Chốt chặn 2: Kiểm tra định dạng ObjectId
        if not ObjectId.is_valid(user_id_str):
            print(f"❌ LỖI: 'sub' là '{user_id_str}' KHÔNG phải là định dạng ObjectId hợp lệ của MongoDB!")
            raise credentials_exception
        
    except JWTError as e:
        print(f"❌ LỖI JWT: {str(e)} (Có thể do hết hạn token hoặc sai SECRET_KEY)")
        raise credentials_exception
    
    # Chốt chặn 3: Truy vấn database
    user = await db["users"].find_one({"_id": ObjectId(user_id_str)})
    
    if user is None:
        print(f"❌ LỖI: Không tìm thấy User nào có ID là '{user_id_str}' trong MongoDB!")
        raise credentials_exception
        
    if not user.get("is_active"):
        print("❌ LỖI: Tài khoản của User đang bị khóa (is_active = False)!")
        raise HTTPException(status_code=403, detail="Account is disabled")
        
    print("✅ XÁC THỰC THÀNH CÔNG: Chào mừng", user.get("email", "User"))
    print("=== END DEBUG TOKEN VALIDATION ===\n")

    user["id"] = str(user["_id"])
    return user

async def get_current_admin(current_user: dict = Depends(get_current_user)):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin privileges required")
    return current_user