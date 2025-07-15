from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel, EmailStr
from typing import Optional
import db as mydb
from firebase_admin import firestore 
from firebase import auth as firebase_auth
from auth.schemas import update_user, UserResponse
from auth.jwt_config import create_access_token, get_current_user
from .check_room import check_room_data, check_room_status, get_room_members


router = APIRouter(tags=["Utility"])

db = firestore.client()  

class User(BaseModel):
    name: str
    email: EmailStr
    age: Optional[int] = None


@router.get("/room_members/{roomId}")
def send_room_members(roomId: str):
    return {"members": get_room_members(db, roomId)}

@router.get("/check_status/{roomId}")
def send_room_status(roomId: str):
    return {"status": check_room_status(db, roomId)}

