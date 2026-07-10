from sqlalchemy.orm import Session
from app.core.security import hash_password
from app.models.user_model import User, UserUpdate
from fastapi import HTTPException, status

# Bỏ async, thêm tham số db: Session, đổi kiểu user_id thành int
def get_user_by_id(db: Session, user_id: int):
    # Truy vấn tìm user theo id bằng SQLAlchemy
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

def update_user_profile(db: Session, user_id: int, update_data: UserUpdate):
    # Lấy thông tin user hiện tại
    user = get_user_by_id(db, user_id)
    
    # Chuyển dữ liệu gửi lên thành dạng từ điển, loại bỏ các trường trống
    update_dict = update_data.dict(exclude_unset=True)
    
    if "password" in update_dict:
        update_dict["hashed_password"] = hash_password(update_dict["password"])
        del update_dict["password"]
        
    if not update_dict:
        raise HTTPException(status_code=400, detail="No changes made")
        
    # Ghi đè từng trường dữ liệu mới vào object user
    for key, value in update_dict.items():
        setattr(user, key, value)
        
    # Lưu thay đổi vào SQL Server
    db.commit()
    db.refresh(user)
    
    return user