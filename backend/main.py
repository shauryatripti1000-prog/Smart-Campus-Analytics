from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pymongo import MongoClient
from passlib.context import CryptContext
import google.generativeai as genai
import os
from dotenv import load_dotenv

# Environment variables load karo (.env file se)
load_dotenv()

# --- DATABASE CONNECTION (Password ab code mein nahi hai) ---
MONGO_URL = os.getenv("MONGO_URL")
client = MongoClient(MONGO_URL)
db = client.smart_campus_db
users_collection = db.users

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# --- AI SETUP ---
GEMINI_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_KEY:
    genai.configure(api_key=GEMINI_KEY)
    model = genai.GenerativeModel('gemini-1.5-flash')
else:
    model = None

app = FastAPI()

# CORS Settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- MODELS ---
class UserAuth(BaseModel):
    name: str = ""
    email: str
    password: str

class ChatRequest(BaseModel):
    message: str

# --- SIGNUP ROUTE ---
@app.post("/signup")
def signup(user: UserAuth):
    existing_user = users_collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Yeh email pehle se registered hai!")
    
    hashed_password = pwd_context.hash(user.password)
    users_collection.insert_one({
        "name": user.name,
        "email": user.email,
        "password": hashed_password,
        "role": "student"
    })
    return {"message": "Account successfully ban gaya!"}

# --- LOGIN ROUTE ---
@app.post("/login")
def login(user: UserAuth):
    db_user = users_collection.find_one({"email": user.email})
    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    if not pwd_context.verify(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    return {"message": "Login successful", "user": {
        "name": db_user.get("name", "User"), 
        "email": db_user["email"], 
        "role": db_user.get("role", "student")
    }}

# --- DUMMY STUDENTS DATA ---
@app.get("/students")
def get_students():
    return [
        {"id": 1, "roll": "#550", "name": "Anya Dwivedi", "score": 93.9, "attendance": "100%", "risk": "Low"},
        {"id": 2, "roll": "#522", "name": "Myra Kapoor", "score": 92.9, "attendance": "100%", "risk": "Low"},
        {"id": 3, "roll": "#510", "name": "Rahul Sharma", "score": 45.0, "attendance": "60%", "risk": "High"}
    ]

# --- AI CHAT ROUTE ---
@app.post("/chat")
async def chat_with_ai(request: ChatRequest):
    if not model:
        return {"reply": "AI abhi active nahi hai kyunki API key set nahi hai."}
    try:
        response = model.generate_content(request.message)
        return {"reply": response.text}
    except Exception as e:
        return {"reply": "AI se connect nahi ho pa raha. API key check karo."}

@app.get("/")
def read_root():
    return {"message": "Backend is running!"}