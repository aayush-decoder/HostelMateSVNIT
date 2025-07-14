from typing import Optional,List
from pydantic import BaseModel

class UserCreate(BaseModel):
    admission_number: str
    room_id: str
    contact_number:str

class UserResponse(BaseModel):
    uid: str
    admission_number: str
    room_id: str
    contact_number:str
    requested_room: Optional[List[str]] = []
    incoming_requests: Optional[List[str]] = []

class Token(BaseModel):
    access_token: str
    token_type: str
