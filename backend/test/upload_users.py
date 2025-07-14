import json
import os
from firebase_admin import credentials, firestore, initialize_app

cred = credentials.Certificate("firebase_credentials.json")  
initialize_app(cred)
db = firestore.client()

with open("test/roommates.json") as f:
    room_data = json.load(f)

doc_id = 1
for room_entry in room_data:
    room_id = room_entry["room"]
    for person in room_entry["roommates"]:
        user_data = {
            "admissionNumber": person["admission_no"],
            "name": person["name"],
            "contactNumber": "",
            "incommingRequests": [],
            "requestedRoom": "",
            "roomId": room_id
        }
        db.collection("users").document(str(doc_id)).set(user_data)
        print(f"Uploaded user {doc_id}: {user_data['name']}")
        doc_id += 1
