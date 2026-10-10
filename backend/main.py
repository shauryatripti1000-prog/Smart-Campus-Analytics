from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
import sqlite3
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_PATH = os.path.join(os.path.dirname(__file__), '..', 'data', 'smart_campus.db')

# Security config
SECRET_KEY = "your-super-secret-key-change-this-in-production-2024"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

# ============= MODELS =============
class RegisterInput(BaseModel):
    email: EmailStr
    password: str
    role: str = "student"
    roll_no: int = None

class LoginInput(BaseModel):
    email: EmailStr
    password: str

# ============= AUTH HELPERS =============
def verify_password(plain, hashed):
    return pwd_context.verify(plain, hashed)

def create_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# ============= AUTH ROUTES =============
@app.post("/auth/register")
def register(data: RegisterInput):
    conn = get_db()
    cur = conn.cursor()
    
    existing = cur.execute("SELECT id FROM users WHERE email = ?", (data.email,)).fetchone()
    if existing:
        conn.close()
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed = pwd_context.hash(data.password)
    cur.execute(
        "INSERT INTO users (email, password_hash, role, roll_no) VALUES (?, ?, ?, ?)",
        (data.email, hashed, data.role, data.roll_no)
    )
    conn.commit()
    user_id = cur.lastrowid
    conn.close()
    
    token = create_token({"sub": str(user_id), "email": data.email, "role": data.role, "roll_no": data.roll_no})
    return {"token": token, "role": data.role, "email": data.email, "roll_no": data.roll_no}

@app.post("/auth/login")
def login(data: LoginInput):
    conn = get_db()
    user = conn.execute("SELECT * FROM users WHERE email = ?", (data.email,)).fetchone()
    conn.close()
    
    if not user or not verify_password(data.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    token = create_token({
        "sub": str(user["id"]),
        "email": user["email"],
        "role": user["role"],
        "roll_no": user["roll_no"]
    })
    return {
        "token": token,
        "role": user["role"],
        "email": user["email"],
        "roll_no": user["roll_no"]
    }

@app.get("/auth/me")
def me(user = Depends(get_current_user)):
    return user

# ============= PROTECTED ROUTES =============
@app.get("/")
def home():
    return {"message": "Smart Campus Analytics API"}

@app.get("/students")
def get_students(user = Depends(get_current_user)):
    if user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin only")
    conn = get_db()
    rows = conn.execute("SELECT * FROM students ORDER BY success_score DESC").fetchall()
    conn.close()
    return [dict(r) for r in rows]

@app.get("/students/me")
def my_data(user = Depends(get_current_user)):
    if user["role"] != "student" or not user.get("roll_no"):
        raise HTTPException(status_code=403, detail="Student only")
    conn = get_db()
    row = conn.execute("SELECT * FROM students WHERE roll_no = ?", (user["roll_no"],)).fetchone()
    conn.close()
    if not row:
        raise HTTPException(status_code=404, detail="Student data not found")
    return dict(row)

@app.get("/stats")
def get_stats(user = Depends(get_current_user)):
    if user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin only")
    conn = get_db()
    total = conn.execute("SELECT COUNT(*) FROM students").fetchone()[0]
    avg = conn.execute("SELECT AVG(success_score) FROM students").fetchone()[0]
    high = conn.execute("SELECT COUNT(*) FROM students WHERE risk_level = 'High'").fetchone()[0]
    med = conn.execute("SELECT COUNT(*) FROM students WHERE risk_level = 'Medium'").fetchone()[0]
    low = conn.execute("SELECT COUNT(*) FROM students WHERE risk_level = 'Low'").fetchone()[0]
    conn.close()
    return {
        "total_students": total,
        "avg_success_score": round(avg or 0, 1),
        "high_risk": high,
        "medium_risk": med,
        "low_risk": low,
    }

@app.get("/segments")
def get_segments(user = Depends(get_current_user)):
    if user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin only")
    conn = get_db()
    rows = conn.execute("""
        SELECT segment, COUNT(*) as count, AVG(success_score) as avg_score
        FROM students GROUP BY segment
    """).fetchall()
    conn.close()
    return [dict(r) for r in rows]

@app.get("/students/{roll_no}")
def get_student(roll_no: int, user = Depends(get_current_user)):
    if user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin only")
    conn = get_db()
    row = conn.execute("SELECT * FROM students WHERE roll_no = ?", (roll_no,)).fetchone()
    conn.close()
    return dict(row) if row else {"error": "Not found"}