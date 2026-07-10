from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.admin.dictionary_management import (
    add_dictionary_item, 
    update_dictionary_item, 
    delete_dictionary_item, 
    get_dictionary
)
from app.models.dictionary_model import DictionaryCreate
from app.api.v1.dependencies import get_current_admin
from app.models.user_model import User

router = APIRouter(prefix="/admin/dictionary", tags=["Admin - Dictionary"])

@router.get("")
def list_dictionary(
    skip: int = Query(0), 
    limit: int = Query(100), 
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    return get_dictionary(db, skip, limit)

@router.post("")
def create_dictionary(
    item: DictionaryCreate, 
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    return add_dictionary_item(db, item)

@router.put("/{item_id}")
def update_dictionary(
    item_id: int, 
    update_data: dict, 
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    return update_dictionary_item(db, item_id, update_data)

@router.delete("/{item_id}")
def delete_dictionary(
    item_id: int, 
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    return delete_dictionary_item(db, item_id)