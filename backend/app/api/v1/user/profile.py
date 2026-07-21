import os
import uuid
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from app.models.user_model import UserResponse, UserUpdate
from app.api.v1.dependencies import get_current_user
from app.services.user.profile_service import get_user_by_id, update_user_profile
from app.core.database import get_db
from motor.motor_asyncio import AsyncIOMotorDatabase

router = APIRouter(prefix="/profile", tags=["User Profile"])

@router.get("/me", response_model=UserResponse)
async def get_profile(
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db) # Truyền db MongoDB vào
):
    # Dùng current_user["id"] thay vì current_user.id
    user = await get_user_by_id(db, current_user["id"])
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    # Gắn thêm trường "id" dạng chuỗi từ "_id" của MongoDB để UserResponse tự động map dữ liệu
    user["id"] = str(user["_id"])
    return user

@router.put("/me", response_model=UserResponse)
async def update_profile(
    update_data: UserUpdate, 
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db) # Truyền db MongoDB vào
):
    user = await update_user_profile(db, current_user["id"], update_data)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    # Gắn thêm trường "id" dạng chuỗi từ "_id" của MongoDB
    user["id"] = str(user["_id"])
    return user

# API MỚI: Tiếp nhận file upload từ React và lưu vào thư mục cục bộ của Server
@router.post("/upload-avatar")
async def upload_avatar(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    # Chỉ chấp nhận định dạng là file ảnh
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File tải lên phải là hình ảnh.")
    
    # Tạo tên file duy nhất sử dụng uuid để không bị trùng lặp
    file_extension = os.path.splitext(file.filename)[1]
    unique_filename = f"avatar_{uuid.uuid4().hex}{file_extension}"
    
    # Lưu file vật lý vào thư mục uploads của Backend
    upload_dir = "uploads"
    if not os.path.exists(upload_dir):
        os.makedirs(upload_dir)
        
    file_path = os.path.join(upload_dir, unique_filename)
    
    try:
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Không thể lưu file: {str(e)}")
        
    # URL tương đối lưu vào DB và trả lại cho Client (VD: /uploads/avatar_xxxx.png)
    avatar_url = f"/uploads/{unique_filename}"
    return {"avatar_url": avatar_url}