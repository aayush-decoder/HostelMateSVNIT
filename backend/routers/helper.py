from fastapi import HTTPException
def parse_user_from_id(db,uid):
    data_ref=db.collection("users").document(uid)
    if data_ref.get().exists:
        return data_ref.to_dict()
    else:
        raise HTTPException(404,"user does not exist")

def fetch_all_users(db):
    users_ref = db.collection("users")
    docs = users_ref.get()  # Fetch all documents

    all_users = []
    for doc in docs:
        user_data = doc.to_dict()
        user_data["uid"] = doc.id
        all_users.append(user_data)

    return all_users
