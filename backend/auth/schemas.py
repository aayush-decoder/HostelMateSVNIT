from typing import Optional,List
from pydantic import BaseModel

class update_user(BaseModel):
    room_id: str
    contact_number:str
    hostel:str

class UserResponse(BaseModel):
    uid: str
    admissionNumber: str
    roomId: str
    hostel:str
    contactNumber:str
    room_mate:str
    name:str
    requestedRoom: Optional[str] = ""
    incommingRequests: Optional[List[str]] = []

class Token(BaseModel):
    access_token: str
    token_type: str
