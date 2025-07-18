from fastapi import FastAPI
from routers import users, root
from fastapi.middleware.cors import CORSMiddleware

app=FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://hostel-mate-svnit.vercel.app", "http://127.0.0.1"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(root.router)
app.include_router(users.router)


@app.get("/")
def read_root():
    return{"message":"Hello"}