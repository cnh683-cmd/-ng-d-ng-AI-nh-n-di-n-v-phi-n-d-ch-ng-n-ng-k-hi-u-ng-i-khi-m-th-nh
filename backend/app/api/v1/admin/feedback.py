from fastapi import APIRouter, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.core.database import get_db
from app.api.v1.dependencies import get_current_admin

router = APIRouter(prefix="/admin/feedback", tags=["Admin - Feedback"])

@router.get("")
async def get_all_feedbacks(
    admin: dict = Depends(get_current_admin),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    cursor = db["feedbacks"].find()
    feedbacks = await cursor.to_list(length=1000)
    for fb in feedbacks:
        fb["id"] = str(fb.pop("_id"))
    return feedbacks