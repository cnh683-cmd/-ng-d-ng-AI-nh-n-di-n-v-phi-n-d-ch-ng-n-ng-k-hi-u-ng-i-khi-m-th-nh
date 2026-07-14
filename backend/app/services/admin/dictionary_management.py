from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
from app.models.dictionary_model import DictionaryCreate
from fastapi import HTTPException

async def add_dictionary_item(db: AsyncIOMotorDatabase, item: DictionaryCreate):
    existing = await db["dictionary"].find_one({"word": item.word})
    if existing:
        raise HTTPException(status_code=400, detail="Word already exists")
    
    new_item = item.model_dump() # Chuyển pydantic model sang json
    result = await db["dictionary"].insert_one(new_item)
    new_item["id"] = str(result.inserted_id)
    return new_item

async def update_dictionary_item(db: AsyncIOMotorDatabase, item_id: str, item_update: dict):
    result = await db["dictionary"].update_one(
        {"_id": ObjectId(item_id)}, 
        {"$set": item_update}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Item not found")
    
    updated_item = await db["dictionary"].find_one({"_id": ObjectId(item_id)})
    updated_item["id"] = str(updated_item.pop("_id"))
    return updated_item

async def delete_dictionary_item(db: AsyncIOMotorDatabase, item_id: str):
    result = await db["dictionary"].delete_one({"_id": ObjectId(item_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Item not found")
    return {"message": "Item deleted"}

async def get_dictionary(db: AsyncIOMotorDatabase, skip: int = 0, limit: int = 100):
    cursor = db["dictionary"].find().skip(skip).limit(limit)
    items = await cursor.to_list(length=limit)
    for item in items:
        item["id"] = str(item.pop("_id"))
    return items