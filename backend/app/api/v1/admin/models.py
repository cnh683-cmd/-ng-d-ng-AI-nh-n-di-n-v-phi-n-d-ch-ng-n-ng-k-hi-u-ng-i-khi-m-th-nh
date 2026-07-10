from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.admin.model_management import save_model_file, add_model_entry, get_models
from app.api.v1.dependencies import get_current_admin
from app.models.user_model import User  # Sửa thành User ở đây

router = APIRouter(prefix="/admin/models", tags=["Admin - Models"])

@router.post("/upload")
async def upload_model(
    file: UploadFile = File(...),
    version: str = Form(...),
    accuracy: float = Form(0.0),
    admin: User = Depends(get_current_admin), # Sửa thành User
    db: Session = Depends(get_db)             # Thêm db
):
    try:
        file_path = await save_model_file(file, version)
        model_id = add_model_entry(db, version, file_path, accuracy)
        return {"id": model_id, "message": "Model uploaded successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("")
def list_models(
    admin: User = Depends(get_current_admin), # Sửa thành User
    db: Session = Depends(get_db)             # Thêm db
):
    return get_models(db)