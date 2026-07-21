from fastapi import APIRouter, Depends, HTTPException
from motor.motor_asyncio import AsyncIOMotorDatabase
from pydantic import BaseModel
from typing import List
from app.core.database import get_db
from app.services.ai_service import sign_to_text_from_image, text_to_sign, text_to_speech
from app.models.history_model import HistoryCreate
from app.services.user.history_service import create_history
from app.api.v1.dependencies import get_current_user

router = APIRouter(tags=["Translation"])

class ImageRequest(BaseModel):
    image_base64: str

class LandmarkRequest(BaseModel):
    landmarks: List[float]

class SaveHistoryRequest(BaseModel):
    input_type: str
    input_content: str
    output_content: list  # ✅ ĐÃ SỬA Ở ĐÂY: Đổi 'str' thành 'list' để khớp với Database

@router.post("/sign-to-text-image")
async def translate_sign_to_text_image(request: ImageRequest, db: AsyncIOMotorDatabase = Depends(get_db)):
    try:
        # Hứng thêm biến 'confidence'
        result_text, landmarks, confidence = await sign_to_text_from_image(request.image_base64) 
        # Trả về thêm 'confidence' cho Frontend dùng
        return {"text": result_text, "landmarks": landmarks, "confidence": confidence}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/text-to-sign")
async def translate_text_to_sign(text: str, current_user: dict = Depends(get_current_user), db: AsyncIOMotorDatabase = Depends(get_db)):
    return {"video_url": await text_to_sign(text)}

@router.post("/text-to-speech")
async def translate_text_to_speech(text: str, current_user: dict = Depends(get_current_user)):
    return {"audio_base64": await text_to_speech(text)}

@router.post("/save-history")
async def save_history_record(
    req: SaveHistoryRequest, 
    current_user: dict = Depends(get_current_user), 
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    try:
        new_history = HistoryCreate(
            user_id=current_user["id"], 
            input_type=req.input_type,
            input_content=req.input_content,
            output_content=req.output_content
        )
        
        # 🚨 ĐÂY LÀ DÒNG DUY NHẤT CẦN SỬA: Thêm current_user["id"] vào làm tham số thứ 2
        await create_history(db, current_user["id"], new_history) 
        
        return {"status": "success", "message": "Đã lưu lịch sử thành công"}
    except Exception as e:
        print(f"Lỗi hệ thống khi lưu: {e}") 
        raise HTTPException(status_code=500, detail=str(e))
