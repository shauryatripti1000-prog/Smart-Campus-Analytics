import sqlite3
import os
from passlib.context import CryptContext

DB_PATH = os.path.join(os.path.dirname(__file__), '..', 'data', 'smart_campus.db')

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

conn = sqlite3.connect(DB_PATH)
cur = conn.cursor()

cur.execute("""
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL,
    roll_no INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
""")

users = [
    ("admin@campus.edu", "admin123", "admin", None),
    ("aarav@campus.edu", "student123", "student", 501),
    ("diya@campus.edu", "student123", "student", 502),
    ("kabir@campus.edu", "student123", "student", 503),
    ("ananya@campus.edu", "student123", "student", 504),
    ("ishaan@campus.edu", "student123", "student", 505),
]

for email, password, role, roll in users:
    hashed = pwd_context.hash(password)
    try:
        cur.execute(
            "INSERT INTO users (email, password_hash, role, roll_no) VALUES (?, ?, ?, ?)",
            (email, hashed, role, roll)
        )
        print(f"OK Created: {email} ({role})")
    except sqlite3.IntegrityError:
        print(f"Already exists: {email}")

conn.commit()
conn.close()
print("\nUsers seeded successfully!")
print("\nLOGIN CREDENTIALS:")
print("Admin    -> admin@campus.edu / admin123")
print("Student  -> aarav@campus.edu / student123")