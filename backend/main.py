from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pymongo import MongoClient
from passlib.context import CryptContext
import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

# --- DATABASE CONNECTION ---
MONGO_URL = os.getenv("MONGO_URL")
client = MongoClient(MONGO_URL)
db = client.smart_campus_db
users_collection = db.users

# Password encryption (72 byte limit fix)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto", bcrypt__truncate_error=False)

# --- AI SETUP ---
GEMINI_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_KEY:
    genai.configure(api_key=GEMINI_KEY)
    model = genai.GenerativeModel('gemini-1.5-flash')
else:
    model = None

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class UserAuth(BaseModel):
    name: str = ""
    email: str
    password: str

class ChatRequest(BaseModel):
    message: str

@app.post("/signup")
def signup(user: UserAuth):
    existing_user = users_collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Yeh email pehle se registered hai!")
    
    # Password ko 72 characters tak truncate karo (bcrypt ki limit)
    password_to_hash = user.password[:72]
    hashed_password = pwd_context.hash(password_to_hash)
    
    users_collection.insert_one({
        "name": user.name, "email": user.email, "password": hashed_password, "role": "student"
    })
    return {"message": "Account successfully ban gaya!"}

@app.post("/login")
def login(user: UserAuth):
    db_user = users_collection.find_one({"email": user.email})
    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    password_to_check = user.password[:72]
    if not pwd_context.verify(password_to_check, db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    return {"message": "Login successful", "user": {
        "name": db_user.get("name", "User"), "email": db_user["email"], "role": db_user.get("role", "student")
    }}

@app.get("/students")
def get_students():
    return [
        {"id": 1, "roll": "#550", "name": "Anya Dwivedi", "score": 93.9, "attendance": "100%", "risk": "Low"},
        {"id": 2, "roll": "#522", "name": "Myra Kapoor", "score": 92.9, "attendance": "100%", "risk": "Low"},
        {"id": 3, "roll": "#510", "name": "Rahul Sharma", "score": 45.0, "attendance": "60%", "risk": "High"}
    ]

@app.get("/")
def read_root():
    return {"message": "Backend is running!"}

@app.post("/chat")
async def chat_with_ai(request: ChatRequest):
    if not model:
        return {"reply": "AI abhi active nahi hai."}
    try:
        response = model.generate_content(request.message)
        return {"reply": response.text}
    except Exception as e:
        return {"reply": "AI se connect nahi ho pa raha."}