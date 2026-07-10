from sqlalchemy.orm import Session
from app.models.history_model import History, HistoryCreate
from datetime import datetime

# Xóa 'async', thêm tham số 'db: Session'
def create_history(db: Session, history: HistoryCreate):
    # Khởi tạo object History (ánh xạ trực tiếp xuống dòng trong bảng SQL)
    db_history = History(
        user_id=history.user_id,
        input_type=history.input_type,
        input_content=history.input_content,
        output_content=history.output_content,
        timestamp=datetime.utcnow()
    )
    
    # Thêm vào Database và lưu lại
    db.add(db_history)
    db.commit()
    db.refresh(db_history)
    
    return db_history.id # Trả về ID (số nguyên) vừa được tự động tạo

# Đổi user_id từ str sang int
def get_histories_by_user(db: Session, user_id: int, skip: int = 0, limit: int = 50):
    # Truy vấn bảng History, lọc theo user_id, sắp xếp giảm dần theo thời gian và phân trang
    histories = db.query(History)\
        .filter(History.user_id == user_id)\
        .order_by(History.timestamp.desc())\
        .offset(skip)\
        .limit(limit)\
        .all()
        
    return histories