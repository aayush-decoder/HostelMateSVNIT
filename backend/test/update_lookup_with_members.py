import json
from firebase_admin import credentials, firestore, initialize_app

cred = credentials.Certificate("firebase_credentials.json")
initialize_app(cred)
db = firestore.client()


with open("test/roommates.json") as f:
    room_data = json.load(f)


for entry in room_data:
    room = entry["room"].replace("-", "").upper()
    members = [member["admission_no"].lower() for member in entry["roommates"]]

    doc_ref = db.collection("boysHostelLookup").document(room)
    doc_ref.update({"members": members})

    print(f"Updated room {room} with members: {members}")
