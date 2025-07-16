import json
import os
import firebase_admin
from firebase_admin import credentials, firestore

# ---- Firebase Init ----
cred = credentials.Certificate("firebase_credentials.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

# ---- Constants ----
MAINTENANCE_ROOMS = [
    "A-211", "B-209", "C-214",
    "C-301", "C-302",
    "A-407", "A-415", "A-417", "C-401",
    "A-501", "A-502", "A-503", "A-511", "A-513", "B-506", "A-517", "C-501", "C-512",
    "A-601", "A-602", "A-611", "A-613", "A-615", "A-617", "B-602", "C-612", "C-618",
    "A-701", "A-702", "A-703", "A-705", "A-707", "A-711", "A-713", "A-714",
    "B-702", "B-704", "B-706", "B-707", "B-709", "B-711",
    "C-701", "C-702", "C-712", "C-713", "C-714",
    "A-801", "A-802", "A-803", "A-804", "A-805", "A-806", "A-807",
    "C-802", "C-803", "C-805", "C-807", "C-809"
]

MAINTENANCE_ROOMS = [room.replace("-", "") for room in MAINTENANCE_ROOMS]  


with open("test/roommates_new.json") as f:
    data = json.load(f)

roommate_counter = {}


for room_entry in data:
    room_id = room_entry["room"].replace("-", "").upper()  
    hostel = "swami"

    # Updating roommate count
    if room_id not in roommate_counter:
        roommate_counter[room_id] = 0

    roommate_counter[room_id] += len(room_entry["roommates"])

    # Uploading each of the user (girls ka bhi isme hi add hoga)
    for person in room_entry["roommates"]:
        admission_no = person["admission_no"].lower()
        user_data = {
            "admissionNumber": person["admission_no"],
            "name": person["name"],
            "contactNumber": "",
            "incommingRequests": [],
            "requestedRooms": [], # {"roomId": "", "uid": ""} expected
            "roomId": room_id,
            "hostel": hostel
        }

        db.collection("users").document(admission_no).set(user_data)
        print(f"✅ Uploaded: {admission_no} → {person['name']}")

# ---- Upload boysHostelLookup ----
for room, count in roommate_counter.items():
    if count > 2:
        raise ValueError(f"❌ Room {room} has more than 2 roommates!")

# Adding all maintenence rooms too
all_rooms = set(roommate_counter.keys()) | set(MAINTENANCE_ROOMS)



for room in all_rooms:
    if room in MAINTENANCE_ROOMS:
        count = -1
    else:
        count = roommate_counter.get(room, 0)

    db.collection("boysHostelLookup").document(room).set({
        "count": count
    })
    print(f"Room {room}: count = {count}")
