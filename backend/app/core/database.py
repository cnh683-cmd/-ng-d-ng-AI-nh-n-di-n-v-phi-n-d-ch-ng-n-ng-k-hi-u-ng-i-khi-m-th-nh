from motor.motor_asyncio import AsyncIOMotorClient

MONGO_URL = "mongodb://localhost:27017"
DATABASE_NAME = "SignLanguageDB"

# Biến toàn cục lưu trữ connection
client = None

async def get_db():
    global client
    # Chỉ khởi tạo kết nối khi FastAPI đã sẵn sàng, tránh lỗi Event Loop
    if client is None:
        client = AsyncIOMotorClient(MONGO_URL)
    
    db = client[DATABASE_NAME]
    yield db