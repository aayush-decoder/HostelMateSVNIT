# routers/users.py
from fastapi import APIRouter, HTTPException,Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr
from typing import Optional
import db
from firebase_admin import db
from firebase import auth as firebase_auth
from auth.schemas import UserCreate,UserResponse,Token
from auth.jwt_config import create_access_token, get_current_user

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

@router.post("/login", response_model=Token)
async def login(id_token:str):
    try:
        decoded_token=firebase_auth.verify_id_token(id_token)
        uid=decoded_token["uid"]
        email=decoded_token.get("email")
        uid=email.split("@")[0]
        access_token = create_access_token(data={"sub": uid, "email": email})
    except:
        raise HTTPException(status_code=401, detail="Invalid ID token")
    return {"access_token": access_token, "token_type": "bearer"}


@router.put("add_contact_number/{user_id}")
async def update_contact(contact_num:str,current_user:dict=Depends(get_current_user)):
    uid=current_user["uid"]
    doc_ref = db.collection("users").document(uid)
    if not doc_ref.get().exists:
        raise Exception("User does not exist")
    doc_ref.update({
        "contactNumber":contact_num
    })

@router.put("/request_exchange/{target_user_id}")
async def request_exchange(target_user_id:str,current_user:dict=Depends(get_current_user)):
    my_data=db.collections("users").document(current_user["uid"])
    his_room=db.collections("users").document(target_user_id)
    if his_room.get().exists:
        room_details=his_room.get().to_dict()
        current_user["requestedRoom"]=room_details["roomId"]
        my_data.update(
            current_user
        )
        room_details["incomingRequests"].append()
        his_room.update(
            room_details
        )
        return {"messsage":"success"}
    else:
        raise HTTPException(status_code=404, detail="room not found")


@router.delete("/{user_id}")
async def delete_user(user_id: str):
    if not db.get_user_by_id(user_id):
        raise HTTPException(status_code=404, detail="User not found")
    db.delete_user(user_id)
    return {"message": "User deleted"}


@router.get("/incoming-requests")
async def get_incoming_requests(current_user: dict = Depends(get_current_user)):
    incoming_uids = current_user.get("incoming_requests", [])

    if not incoming_uids:
        return []

    users_data = []
    for uid in incoming_uids:
        user_doc = db.collection("users").document(uid).get()
        if user_doc.exists:
            u = user_doc.to_dict()
            users_data.append({
                "uid": uid,
                "name": u.get("name"),  
                "room_id": u.get("roomId"),
                "admission_number": u.get("admissionNumber")
            })

    return users_data

@router.get("/me", response_model=UserResponse)
def read_users_me(current_user: dict = Depends(get_current_user)):
    return UserResponse(**current_user)