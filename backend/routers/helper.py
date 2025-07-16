from fastapi import HTTPException
def parse_user_from_id(db,uid):
    data_ref=db.collection("users").document(uid)
    if data_ref.get().exists:
        return data_ref.to_dict()
    else:
        raise HTTPException(404,"user does not exist")
