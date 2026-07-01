import os
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
cors_origins_str = os.getenv("CORS_ORIGINS", "*")
origins = [origin.strip() for origin in cors_origins_str.split(",") if origin.strip()]

# Starlette raises RuntimeError if allow_origins is ["*"] and allow_credentials is True
allow_credentials = True
if "*" in origins:
    allow_credentials = False

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=allow_credentials,
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
