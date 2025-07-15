from fastapi import HTTPException

def check_room_data(db, uid):
    doc = db.collection("users").document(uid).get()
    return doc.exists

def check_room_status(db, room_id):
    doc_ref = db.collection("boysHostelLookup").document(room_id.upper())
    doc = doc_ref.get()
    if doc.exists:
        return doc.to_dict()["count"]
    else:
        raise HTTPException(status_code=404, detail="Room does not exist")
