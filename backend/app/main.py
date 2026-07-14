from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.user import auth, profile, translate, history, feedback as user_feedback
from app.api.v1.admin import users, dictionary, models, stats, feedback as admin_feedback

app = FastAPI(title="Sign Language Translation API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/v1")
app.include_router(profile.router, prefix="/api/v1")
app.include_router(translate.router, prefix="/api/v1/translate") 
app.include_router(history.router, prefix="/api/v1")
app.include_router(user_feedback.router, prefix="/api/v1")

app.include_router(users.router, prefix="/api/v1")
app.include_router(dictionary.router, prefix="/api/v1")
app.include_router(models.router, prefix="/api/v1")
app.include_router(stats.router, prefix="/api/v1")
app.include_router(admin_feedback.router, prefix="/api/v1")

@app.get("/")
async def root():
    return {"message": "Sign Language Translation API is running with MongoDB!"}