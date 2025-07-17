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

# @router.get("/room_status_all")
# def get_all_room_statuses():
#     room_ref = db.collection("boysHostelLookup")
#     user_ref = db.collection("users")

#     rooms = room_ref.stream()

#     room_statuses = {}  # like {"C405": 2}
#     room_users = {}     # like {"C405": {name: "dvewb", admissionNumber: "U24AI091"}}

#     for room in rooms:
#         room_id = room.id
#         data = room.to_dict()

#         # Save room status (count = 0, 1, 2, or -1 if maintenance)
#         room_statuses[room_id] = data.get("count", 0)

#         # Get user details (we'll just pick first member)
#         members = data.get("members", [])
#         if members:
#             user_doc = user_ref.document(members[0]).get()
#             if user_doc.exists:
#                 user_data = user_doc.to_dict()
#                 room_users[room_id] = {
#                     "name": user_data.get("name", ""),
#                     "admissionNumber": user_data.get("admissionNumber", "")
#                 }

#     return {
#         "statuses": room_statuses,
#         "users": room_users
#     }
