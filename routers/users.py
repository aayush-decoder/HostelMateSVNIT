# routers/users.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from typing import Optional
import db

router = APIRouter(prefix="/users", tags=["Users"])

class User(BaseModel):
    name: str
    email: EmailStr
    age: Optional[int] = None

@router.get("/{user_id}")
async def get_user(user_id: str):
    user = db.get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.post("/{user_id}")
async def create_user(user_id: str, user: User):
    if db.get_user_by_id(user_id):
        raise HTTPException(status_code=400, detail="User already exists")
    db.create_user(user_id, user.model_dump())
    return {"message": "User created"}

@router.put("/{user_id}")
async def update_user(user_id: str, user: User):
    if not db.get_user_by_id(user_id):
        raise HTTPException(status_code=404, detail="User not found")
    db.update_user(user_id, user.model_dump())
    return {"message": "User updated"}

@router.delete("/{user_id}")
async def delete_user(user_id: str):
    if not db.get_user_by_id(user_id):
        raise HTTPException(status_code=404, detail="User not found")
    db.delete_user(user_id)
    return {"message": "User deleted"}
