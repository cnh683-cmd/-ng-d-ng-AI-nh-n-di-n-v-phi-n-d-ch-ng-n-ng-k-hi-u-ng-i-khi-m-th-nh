from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings

# Biến toàn cục lưu trữ connection
client = None

async def get_db():
    global client
    # Chỉ khởi tạo kết nối khi FastAPI đã sẵn sàng, tránh lỗi Event Loop
    if client is None:
        # Lấy trực tiếp MONGO_URI từ file .env đã cấu hình
        client = AsyncIOMotorClient(settings.MONGO_URI)
    
    # Lấy trực tiếp DB_NAME từ file .env (sign_language_db)
    db = client[settings.DB_NAME]
    yield db