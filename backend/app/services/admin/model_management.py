import os
import shutil
from datetime import datetime
from fastapi import UploadFile
from motor.motor_asyncio import AsyncIOMotorDatabase

MODEL_DIR = "models/"

async def save_model_file(file: UploadFile, version: str):
    os.makedirs(MODEL_DIR, exist_ok=True)
    file_path = os.path.join(MODEL_DIR, f"sign_model_{version}.pth")
    with open(file_path, "wb") as f:
        shutil.copyfileobj(file.file, f)
    return file_path

async def add_model_entry(db: AsyncIOMotorDatabase, version: str, file_path: str, accuracy: float = 0.0):
    new_model = {
        "version": version,
        "file_path": file_path,
        "accuracy": accuracy,
        "uploaded_at": datetime.utcnow()
    }
    result = await db["models"].insert_one(new_model)
    return str(result.inserted_id)

async def get_models(db: AsyncIOMotorDatabase):
    cursor = db["models"].find().sort("uploaded_at", -1).limit(100)
    models = await cursor.to_list(length=100)
    for model in models:
        model["id"] = str(model.pop("_id"))
    return models