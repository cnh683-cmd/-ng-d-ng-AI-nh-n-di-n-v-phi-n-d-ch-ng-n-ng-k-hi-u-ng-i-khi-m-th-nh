from sqlalchemy.orm import Session
from app.models.dictionary_model import Dictionary, DictionaryCreate
from fastapi import HTTPException

def add_dictionary_item(db: Session, item: DictionaryCreate):
    # Kiểm tra xem từ đã tồn tại chưa
    existing = db.query(Dictionary).filter(Dictionary.word == item.word).first()
    if existing:
        raise HTTPException(status_code=400, detail="Word already exists")
    
    # Tạo object mới
    new_item = Dictionary(**item.dict())
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return new_item

def update_dictionary_item(db: Session, item_id: int, item_update: dict):
    # Tìm mục cần cập nhật
    item = db.query(Dictionary).filter(Dictionary.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    
    # Cập nhật các trường dữ liệu
    for key, value in item_update.items():
        setattr(item, key, value)
        
    db.commit()
    db.refresh(item)
    return item

def delete_dictionary_item(db: Session, item_id: int):
    item = db.query(Dictionary).filter(Dictionary.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    
    db.delete(item)
    db.commit()
    return {"message": "Item deleted"}

def get_dictionary(db: Session, skip: int = 0, limit: int = 100):
    # Truy vấn danh sách từ điển
    return db.query(Dictionary).offset(skip).limit(limit).all()