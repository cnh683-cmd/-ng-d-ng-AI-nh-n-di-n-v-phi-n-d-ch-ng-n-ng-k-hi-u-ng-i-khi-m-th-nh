from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List
from app.core.database import get_db
from app.services.ai_service import sign_to_text_from_image, text_to_sign, text_to_speech
from app.models.history_model import HistoryCreate
from app.services.user.history_service import create_history
from app.api.v1.dependencies import get_current_user
from app.models.user_model import User

router = APIRouter(prefix="/translate", tags=["Translation"])

class ImageRequest(BaseModel):
    image_base64: str

class LandmarkRequest(BaseModel):
    landmarks: List[float]

@router.post("/sign-to-text-image")
async def translate_sign_to_text_image(
    request: ImageRequest, 
    # current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    try:
        # Gọi hàm và nhận cả chữ cái lẫn tọa độ khung xương
        result_text, landmarks = await sign_to_text_from_image(request.image_base64) 
        return {"text": result_text, "landmarks": landmarks}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/sign-to-text")
async def translate_sign_to_text(request: LandmarkRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    pass

@router.post("/text-to-sign")
async def translate_text_to_sign(text: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return {"video_url": await text_to_sign(text)}

@router.post("/text-to-speech")
async def translate_text_to_speech(text: str, current_user: User = Depends(get_current_user)):
    return {"audio_base64": await text_to_speech(text)}