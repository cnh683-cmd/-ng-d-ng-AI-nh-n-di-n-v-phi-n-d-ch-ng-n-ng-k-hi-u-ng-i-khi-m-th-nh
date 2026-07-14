from pydantic import BaseModel

class DictionaryBase(BaseModel):
    word: str
    meaning: str
    video_url: str

class DictionaryCreate(DictionaryBase):
    pass

class DictionaryResponse(DictionaryBase):
    id: str  # Đổi id thành chuỗi để khớp với MongoDB

    class Config:
        from_attributes = True