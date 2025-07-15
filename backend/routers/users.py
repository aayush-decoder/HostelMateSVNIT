# routers/users.py
from fastapi import APIRouter, HTTPException,Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr
from typing import Optional
import db
from firebase_admin import db
from firebase import auth as firebase_auth
from auth.schemas import update_user,UserResponse,Token
from auth.jwt_config import create_access_token, get_current_user
import re
from check_room import check_room_data ,check_room_status

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

# auth/routes.py
from fastapi import APIRouter, Request, HTTPException
from firebase_admin import auth as firebase_auth
from auth.jwt_config import create_access_token
import re

router = APIRouter(tags=["Auth"])


EMAIL_REGEX = r"^[ui]24[a-z]{2}\d{3}@[a-z]+\.svnit\.in$"

@router.post("/login")
async def token(request: Request):
    body = await request.json()
    id_token = body.get("idToken")

    if not id_token:
        raise HTTPException(status_code=400, detail="Missing idToken")

    try:
        decoded = firebase_auth.verify_id_token(id_token)
        email = decoded.get("email")
        # email check here
        uid = email.split("@")[0].lower()

        #check room data
        #if not add data
        if not check_room_data(db,uid):
            db.collections("users").document(uid).set(
                {
                    "admissionNumber":uid,
                    "roomId": "not_updated",
                    "contactNumber": "",
                    "requestedRoom":"",
                    "incoming_requests": []
                }
            )

        # if not re.match(EMAIL_REGEX, email):
        #     raise HTTPException(status_code=403, detail="Only institutional emails allowed")

        jwt_token = create_access_token({"sub": uid})
        return {"access_token": jwt_token, "token_type": "bearer"}

    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Invalid Firebase token: {str(e)}")



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
    if his_room.get().exists and target_user_id!=current_user["uid"]:
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

@router.post("/update_room_details/{room_no}")
def update_room_details(details:update_user,current_user:dict=Depends(get_current_user)):
    # this checks both things that if room exists and number of occupants
    room_status=check_room_status(db,details.room_id.upper())
    room_ref=db.collections("boysHostelLookup").document(details.room_id.upper())
    room=room_ref.get().to_dict()
    if room_status<2 and room_status>0:
        current_user["roomId"]=details.room_id.upper()
        current_user["conatactNumber"]=details.contact_number
        current_user["hostel"]=details.hostel
        room["count"]+=1
        # if we have current user that means user data exists so no need to check
        user_ref=db.collections("users").document(current_user["uid"])
        user_ref.update(current_user)
        room_ref.update(room)
    elif (room_status<0):
        return {"message","under_maintinance"}
    else:
        return {"message","room is full"}

@router.get("/room_details/{branch_name}")
def get_room_details(branch_name:str):
    #logic not clear
    pass
        
