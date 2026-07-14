from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.core.database import get_db
from app.services.admin.model_management import save_model_file, add_model_entry, get_models
from app.api.v1.dependencies import get_current_admin

router = APIRouter(prefix="/admin/models", tags=["Admin - Models"])

@router.post("/upload")
async def upload_model(
    file: UploadFile = File(...),
    version: str = Form(...),
    accuracy: float = Form(0.0),
    admin: dict = Depends(get_current_admin), 
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    try:
        file_path = await save_model_file(file, version)
        model_id = await add_model_entry(db, version, file_path, accuracy)
        return {"id": model_id, "message": "Model uploaded successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("")
async def list_models(
    admin: dict = Depends(get_current_admin), 
    db: AsyncIOMotorDatabase = Depends(get_db)             
):
    return await get_models(db)