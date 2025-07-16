from typing import Optional,List
from pydantic import BaseModel

class update_user(BaseModel):
    room_id: str
    contact_number:Optional[str]
    hostel:str

class UserResponse(BaseModel):
    uid: str
    admissionNumber: str
    roomId: str
    hostel:str
    contactNumber:str
    room_mate:str
    name:str
    requestedRooms: List[Optional[dict]]
    incommingRequests: Optional[List[str]] = []

class Token(BaseModel):
    access_token: str
    token_type: str
