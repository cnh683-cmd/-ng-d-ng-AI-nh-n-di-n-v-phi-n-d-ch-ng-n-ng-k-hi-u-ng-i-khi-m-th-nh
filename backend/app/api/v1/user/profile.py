from fastapi import APIRouter, Depends
from app.models.user_model import UserResponse, UserUpdate
from app.api.v1.dependencies import get_current_user
from app.services.user.profile_service import get_user_by_id, update_user_profile

router = APIRouter(prefix="/profile", tags=["User Profile"])

@router.get("/me", response_model=UserResponse)
async def get_profile(current_user = Depends(get_current_user)):
    user = await get_user_by_id(str(current_user.id))
    return {
        "id": str(user["_id"]),
        "email": user["email"],
        "full_name": user["full_name"],
        "role": user["role"],
        "is_active": user["is_active"],
        "created_at": user["created_at"]
    }

@router.put("/me", response_model=UserResponse)
async def update_profile(update_data: UserUpdate, current_user = Depends(get_current_user)):
    user = await update_user_profile(str(current_user.id), update_data)
    return {
        "id": str(user["_id"]),
        "email": user["email"],
        "full_name": user["full_name"],
        "role": user["role"],
        "is_active": user["is_active"],
        "created_at": user["created_at"]
    }