from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

# Thay "localhost" bằng Server Name trong SSMS của bạn nếu cần
SERVER = 'localhost' 
DATABASE = 'SignLanguageDB'

# Chuỗi kết nối dùng Windows Authentication (Không cần tài khoản/mật khẩu)
SQLALCHEMY_DATABASE_URL = f"mssql+pyodbc://@{SERVER}/{DATABASE}?driver=ODBC+Driver+17+for+SQL+Server&Trusted_Connection=yes"

engine = create_engine(SQLALCHEMY_DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Hàm tạo session để gọi trong các API
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()