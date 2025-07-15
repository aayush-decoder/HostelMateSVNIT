from fastapi import  Depends ,APIRouter, Request, HTTPException
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel, EmailStr
from typing import Optional
import db as mydb
from firebase_admin import firestore 
from firebase_admin import auth as firebase_auth

from auth.schemas import update_user, UserResponse
from auth.jwt_config import create_access_token, get_current_user
from .check_room import check_room_data, check_room_status

router = APIRouter(tags=["Users"])
db = firestore.client()  

# auth/routes.py
# EMAIL_REGEX = r"^[ui]24[a-z]{2}\d{3}@[a-z]+\.svnit\.in$"


@router.post("/login")
async def token(request: Request):
    body = await request.json()
    id_token = body.get("idToken")
    print("token recived")
    if not id_token:
        raise HTTPException(status_code=400, detail="Missing idToken")
    try:
        decoded = firebase_auth.verify_id_token(id_token)
        email = decoded.get("email")
        uid = email.split("@")[0].lower()
        username = decoded.get("name")

        if not check_room_data(db, uid):
            db.collection("users").document(uid).set({
                "admissionNumber": uid,
                "roomId": "not_updated",
                "contactNumber": "",
                "requestedRoom": "",
                "incoming_requests": [],
                "name": username,
                "hostel":""
            })

        jwt_token = create_access_token({"sub": uid})
        return {"access_token": jwt_token, "token_type": "bearer"}

    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Invalid Firebase token: {str(e)}")

@router.post("add_contact_number/{user_id}")
async def update_contact(contact_num:str,current_user:dict=Depends(get_current_user)):
    uid=current_user["uid"]
    doc_ref = db.collection("users").document(uid)
    if not doc_ref.get().exists:
        raise Exception("User does not exist")
    doc_ref.update({
        "contactNumber":contact_num
    })

@router.post("/request_exchange/{target_user_id}")
async def request_exchange(target_user_id:str,current_user:dict=Depends(get_current_user)):
    my_data=db.collection("users").document(current_user["uid"])
    his_room=db.collection("users").document(target_user_id)
    if his_room.get().exists and target_user_id!=current_user["uid"]:
        room_details=his_room.get().to_dict()
        current_user["requestedRoom"]=room_details["roomId"]
        my_data.update(
            current_user
        )
        room_details["incommingRequests"].append()
        his_room.update(
            room_details
        )
        return {"messsage":"success"}
    else:
        raise HTTPException(status_code=404, detail="room not found")


# @router.delete("/{user_id}")
# async def delete_user(user_id: str):
#     if not mydb.get_user_by_id(user_id):
#         raise HTTPException(status_code=404, detail="User not found")
#     mydb.delete_user(user_id)
#     return {"message": "User deleted"}

@router.get("/incoming-requests")
async def get_incoming_requests(current_user: dict = Depends(get_current_user)):
    print(current_user)
    incoming_uids = current_user.get("incommingRequests", [])
    print(incoming_uids)

    if not incoming_uids:
        return []

    users_data = []
    db = firestore.client()  
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
    #room mate logic
    print("reached me")
    room_mate="no details found"
    if current_user["roomId"]!="":
        doc_ref = db.collection("boysHostelLookup").document(current_user["roomId"])
        if doc_ref.get().exists:
            member_list=doc_ref.get().to_dict()["members"]
            if len(member_list)==2:
                mem1=member_list[0] 
                mem2=member_list[0] 
                if mem1!=current_user["admissionNumber"]:
                    room_mate=mem1
                else:
                    room_mate=mem2
                doc_ref2 = db.collection("users").document(room_mate).get()
                if doc_ref2.exists:
                    room_mate=doc_ref2.to_dict()["name"]
    
    current_user.update({"room_mate":room_mate})
    return UserResponse(**current_user)


@router.post("/update_room_details/{room_no}")
def update_room_details(details:update_user,current_user:dict=Depends(get_current_user)):
    # this checks both things that if room exists and number of occupants
    room_status=check_room_status(db,details.room_id.upper())
    room_ref=db.collection("boysHostelLookup").document(details.room_id.upper())
    room=room_ref.get().to_dict()
    if room_status<2 and room_status>0:
        current_user["roomId"]=details.room_id.upper()
        current_user["conatactNumber"]=details.contact_number
        current_user["hostel"]=details.hostel
        room["count"]+=1
        room["members"].append(current_user["uid"])
        # if we have current user that means user data exists so no need to check
        user_ref=db.collection("users").document(current_user["uid"])
        user_ref.update(current_user)
        room_ref.update(room)
    elif (room_status<0):
        return {"message","under_maintinance"}
    else:
        return {"message","room is full"}


@router.get("/room_details/{branch_name}")
def get_room_details(branch_name: str):
    MAX_STUDENTS = 250
    admissionNumberTemplate = f"u24{branch_name.lower()}"
    users_data = []

    for roll_no in range(1, MAX_STUDENTS + 1):
        formatted_roll = f"{roll_no:03d}" 
        uid = admissionNumberTemplate + formatted_roll
        doc_ref = db.collection("users").document(uid).get()

        if doc_ref.exists:
            data = doc_ref.to_dict()
            users_data.append({
                "uid": uid,
                "name": data.get("name"),
                "roomId": data.get("roomId"),
                "hostel": data.get("hostel"),
                "contactNumber": data.get("contactNumber")
            })

    return users_data

