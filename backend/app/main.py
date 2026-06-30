from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routers import users, tasks

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Task Manager API",
    description="A robust FastAPI backend for the Task Manager Application.",
    version="1.0.0"
)

# CORS setup
# In production, specify list of origins instead of "*"
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(users.router)
app.include_router(tasks.router)


@app.get("/")
def read_root():
    return {
        "message": (
            "Welcome to the Task Manager API! "
            "Navigate to /docs for Swagger documentation."
        )
    }
