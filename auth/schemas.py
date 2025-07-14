from typing import Optional,List
from pydantic import BaseModel

class UserCreate(BaseModel):
    admission_number: str
    room_id: str
    contact_number:str

class UserResponse(BaseModel):
    uid: str
    admissionNumber: str
    roomId: str
    contactNumber:str
    requestedRoom: Optional[str] = ""
    incomingRequests: Optional[List[str]] = []

class Token(BaseModel):
    access_token: str
    token_type: str
