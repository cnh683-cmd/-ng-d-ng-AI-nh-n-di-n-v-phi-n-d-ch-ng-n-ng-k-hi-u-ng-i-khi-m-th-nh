from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm
from app.core.database import get_db
from app.models.user_model import UserCreate
from app.services.auth_service import register_user, authenticate_user
from app.core.security import create_access_token
from motor.motor_asyncio import AsyncIOMotorDatabase
import traceback

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register")
async def register(user: UserCreate, db: AsyncIOMotorDatabase = Depends(get_db)):
    # ===============================================================
    # CỖ MÁY QUÉT SỰ THẬT: In ra chính xác những gì Frontend đã gửi
    # ===============================================================
    print("\n" + "🔥" * 30)
    print("SỰ THẬT VỀ MẬT KHẨU FRONTEND GỬI LÊN:")
    print(f"- Chiều dài thực tế: {len(user.password)} ký tự")
    print(f"- Nội dung thực tế : {user.password}")
    print("🔥" * 30 + "\n")
    # ===============================================================
    
    try:
        new_user = await register_user(db, user)
        return {"id": new_user["id"], "email": new_user["email"]}
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi từ Python: {str(e)}")

@router.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: AsyncIOMotorDatabase = Depends(get_db)):
    user = await authenticate_user(db, form_data.username, form_data.password)
    token = create_access_token(data={"sub": user["id"]})
    return {"access_token": token, "token_type": "bearer"}