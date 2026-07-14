from fastapi import APIRouter, Depends, HTTPException
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
        
    return {
        "id": str(user["_id"]),
        "email": user["email"],
        "full_name": user["full_name"],
        "role": user["role"],
        "is_active": user["is_active"],
        "created_at": user["created_at"]
    }

@router.put("/me", response_model=UserResponse)
async def update_profile(
    update_data: UserUpdate, 
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db) # Truyền db MongoDB vào
):
    user = await update_user_profile(db, current_user["id"], update_data)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    return {
        "id": str(user["_id"]),
        "email": user["email"],
        "full_name": user["full_name"],
        "role": user["role"],
        "is_active": user["is_active"],
        "created_at": user["created_at"]
    }