from firebase import db

def get_user_by_id(user_id: str):
    doc = db.collection("users").document(user_id).get()
    return doc.to_dict() if doc.exists else None

def create_user(user_id: str, data: dict):
    db.collection("users").document(user_id).set(data)

def update_user(user_id: str, data: dict):
    db.collection("users").document(user_id).update(data)

def delete_user(user_id: str):
    db.collection("users").document(user_id).delete()
