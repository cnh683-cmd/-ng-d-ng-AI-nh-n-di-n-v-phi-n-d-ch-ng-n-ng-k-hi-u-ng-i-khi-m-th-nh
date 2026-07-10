from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlalchemy.orm import Session
from app.core.config import settings

# Import công cụ kết nối và Model SQL Server
from app.core.database import get_db
from app.models.user_model import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")

# Xóa từ khóa 'async' đi vì chúng ta dùng đồng bộ cho SQL, thêm tham số db: Session
def get_current_user(
    token: str = Depends(oauth2_scheme), 
    db: Session = Depends(get_db)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id_str: str = payload.get("sub")
        if user_id_str is None:
            raise credentials_exception
            
        # SQL Server dùng số nguyên (int) cho ID, nên phải ép kiểu chuỗi thành số
        user_id = int(user_id_str)
        
    except (JWTError, ValueError): # Thêm ValueError để phòng trường hợp ép kiểu int bị lỗi
        raise credentials_exception
    
    # Truy vấn bằng SQLAlchemy thay vì MongoDB
    user = db.query(User).filter(User.id == user_id).first()
    
    if user is None:
        raise credentials_exception
    if not user.is_active:
        raise HTTPException(status_code=403, detail="Account is disabled")
        
    return user # Trả thẳng object User của SQL

def get_current_admin(current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin privileges required")
    return current_user