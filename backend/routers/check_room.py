from fastapi import APIRouter, HTTPException,Depends
# for checking if we have room data
def check_room_data(db,uid):
    data_obj=db.collection("users").document(uid)
    data_get=data_obj().get()
    if data_get.exists:
        return True
    else:
        return False

def check_room_status(db,room_id):
    doc_ref=db.collection("boysHostelLookup").document(room_id.upper())
    doc=doc_ref.get()
    if doc.exists:
        return doc.to_dict()["count"]
    else:
        raise HTTPException(status_code=404, detail="room does not exist")