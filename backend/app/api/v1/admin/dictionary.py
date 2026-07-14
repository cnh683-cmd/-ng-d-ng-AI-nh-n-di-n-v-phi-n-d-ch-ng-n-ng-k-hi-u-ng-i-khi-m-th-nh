from fastapi import APIRouter, Depends, Query
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.core.database import get_db
from app.services.admin.dictionary_management import (
    add_dictionary_item, 
    update_dictionary_item, 
    delete_dictionary_item, 
    get_dictionary
)
from app.models.dictionary_model import DictionaryCreate
from app.api.v1.dependencies import get_current_admin

router = APIRouter(prefix="/admin/dictionary", tags=["Admin - Dictionary"])

@router.get("")
async def list_dictionary(
    skip: int = Query(0), 
    limit: int = Query(100), 
    admin: dict = Depends(get_current_admin),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    return await get_dictionary(db, skip, limit)

@router.post("")
async def create_dictionary(
    item: DictionaryCreate, 
    admin: dict = Depends(get_current_admin),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    return await add_dictionary_item(db, item)

@router.put("/{item_id}")
async def update_dictionary(
    item_id: str, 
    update_data: dict, 
    admin: dict = Depends(get_current_admin),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    return await update_dictionary_item(db, item_id, update_data)

@router.delete("/{item_id}")
async def delete_dictionary(
    item_id: str, 
    admin: dict = Depends(get_current_admin),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    return await delete_dictionary_item(db, item_id)