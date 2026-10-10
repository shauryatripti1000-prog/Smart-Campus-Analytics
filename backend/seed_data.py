import sqlite3
import random
import os
from datetime import datetime, timedelta

# Database path — backend folder ke bahar data folder mein
DB_PATH = os.path.join(os.path.dirname(__file__), '..', 'data', 'smart_campus.db')

# Tumhare 50 students (PDF se)
students = [
    (501, "Aarav Sharma", 92, 88, 85),
    (502, "Diya Patel", 74, 81, 79),
    (503, "Kabir Malhotra", 55, 62, 60),
    (504, "Ananya Iyer", 98, 95, 92),
    (505, "Ishaan Verma", 68, 72, 70),
    (506, "Meera Joshi", 84, 89, 81),
    (507, "Rohan Das", 51, 58, 54),
    (508, "Sneha Reddy", 79, 75, 83),
    (509, "Aditya Rao", 91, 93, 87),
    (510, "Tanvi Hegde", 63, 67, 65),
    (511, "Vivaan Saxena", 87, 82, 80),
    (512, "Kritika Nair", 72, 70, 76),
    (513, "Arjun Choudhury", 58, 52, 61),
    (514, "Zara Khan", 95, 91, 94),
    (515, "Devansh Gupta", 80, 85, 78),
    (516, "Riya Sen", 66, 61, 69),
    (517, "Parth Shukla", 75, 78, 73),
    (518, "Avani Mishra", 89, 94, 90),
    (519, "Yash Deshmukh", 53, 50, 57),
    (520, "Isha Gokhale", 83, 80, 85),
    (521, "Sai Kumar", 71, 74, 72),
    (522, "Myra Kapoor", 96, 97, 95),
    (523, "Krishna Bose", 60, 65, 58),
    (524, "Shreya Ghoshal", 78, 82, 80),
    (525, "Aryan Bhat", 85, 87, 83),
    (526, "Saanvi Pillai", 64, 69, 66),
    (527, "Pranav Mehta", 52, 55, 51),
    (528, "Khushi Kapoor", 90, 88, 91),
    (529, "Reyansh Sinha", 77, 73, 75),
    (530, "Alisha Fernandes", 82, 84, 86),
    (531, "Veer Pratap", 59, 60, 63),
    (532, "Ahana Dutta", 93, 90, 89),
    (533, "Dhruv Bansal", 73, 76, 71),
    (534, "Kavya Marar", 67, 70, 68),
    (535, "Tejas Jadhav", 56, 53, 59),
    (536, "Kiara Sodhi", 88, 92, 93),
    (537, "Samarth Jain", 81, 79, 82),
    (538, "Pari Chauhan", 62, 64, 60),
    (539, "Ishit Tiwari", 76, 80, 77),
    (540, "Navya Bhatia", 94, 96, 92),
    (541, "Vihaan Kulkarni", 50, 54, 52),
    (542, "Tara Agarwal", 86, 85, 88),
    (543, "Raghav Anand", 70, 72, 74),
    (544, "Mehak Singhal", 79, 83, 81),
    (545, "Ranveer Singh", 57, 59, 55),
    (546, "Shruti Saxena", 91, 89, 90),
    (547, "Daksh Sharma", 65, 68, 67),
    (548, "Nikita Roy", 84, 81, 85),
    (549, "Yuvan Reddy", 73, 75, 70),
    (550, "Anya Dwivedi", 97, 98, 96),
]

# Delete old DB if exists
if os.path.exists(DB_PATH):
    os.remove(DB_PATH)

conn = sqlite3.connect(DB_PATH)
cur = conn.cursor()

# Create tables
cur.executescript("""
CREATE TABLE students (
    roll_no INTEGER PRIMARY KEY,
    name TEXT,
    department TEXT,
    semester INTEGER,
    avg_marks REAL,
    cgpa REAL,
    backlogs INTEGER,
    attendance_pct REAL,
    login_count_last_30d INTEGER,
    assignments_submitted INTEGER,
    assignments_total INTEGER,
    avg_delay_days REAL,
    events_attended INTEGER,
    clubs_joined INTEGER,
    hackathons INTEGER,
    certifications INTEGER,
    aptitude_score REAL,
    coding_score REAL,
    mock_interview_score REAL,
    placement_readiness REAL,
    technical_score REAL,
    soft_skill_score REAL,
    student_satisfaction REAL,
    faculty_feedback REAL,
    success_score REAL,
    risk_level TEXT,
    risk_factors TEXT,
    segment TEXT
);
""")

for roll, name, maths, sci, eng in students:
    avg_marks = (maths + sci + eng) / 3
    cgpa = round(avg_marks / 10, 2)
    backlogs = 1 if avg_marks < 50 else 0
    
    # Attendance correlated with marks
    attendance_pct = min(100, max(45, avg_marks + random.randint(-8, 8)))
    
    # LMS
    login_count = max(1, int(avg_marks / 3.5) + random.randint(-3, 3))
    assignments_total = 20
    assignments_submitted = max(2, int(avg_marks / 5) + random.randint(-2, 2))
    avg_delay = max(0, round((100 - avg_marks) / 25 + random.uniform(-1, 1), 1))
    
    # Engagement
    events = random.randint(0, 8)
    clubs = random.randint(0, 3)
    hackathons = random.randint(0, 4)
    certs = random.randint(0, 3)
    
    # Placement
    aptitude = min(100, max(20, avg_marks + random.randint(-12, 12)))
    coding = min(100, max(20, avg_marks + random.randint(-18, 10)))
    mock = min(100, max(20, avg_marks + random.randint(-12, 12)))
    placement_readiness = round((aptitude + coding + mock) / 3, 1)
    
    # Skills
    tech_score = min(100, max(20, avg_marks + random.randint(-8, 8)))
    soft_score = min(100, max(20, avg_marks + random.randint(-12, 12)))
    
    # Feedback
    satisfaction = round(random.uniform(3, 5), 1)
    faculty_fb = round(random.uniform(3, 5), 1)
    
    # ========== SUCCESS SCORE CALCULATION ==========
    academic_score = avg_marks
    attendance_score = attendance_pct
    lms_score = (login_count / 30) * 50 + (assignments_submitted / assignments_total) * 50
    placement_score = placement_readiness
    skills_score = (tech_score + soft_score) / 2
    engagement_score = min(100, events * 3 + clubs * 5 + hackathons * 8 + certs * 6)
    feedback_score = ((satisfaction / 5) * 50 + (faculty_fb / 5) * 50)
    
    success_score = round(
        0.30 * academic_score +
        0.20 * attendance_score +
        0.15 * lms_score +
        0.15 * placement_score +
        0.10 * skills_score +
        0.05 * engagement_score +
        0.05 * feedback_score,
        1
    )
    
    # ========== RISK IDENTIFICATION ==========
    risk_factors = []
    if backlogs > 0:
        risk_factors.append(f"{backlogs} backlog(s)")
    if avg_marks < 50:
        risk_factors.append("Low marks (<50%)")
    if attendance_pct < 75:
        risk_factors.append(f"Low attendance ({attendance_pct:.0f}%)")
    if login_count < 5:
        risk_factors.append("Low LMS engagement")
    if assignments_submitted / assignments_total < 0.6:
        risk_factors.append("Poor assignment submission")
    if placement_readiness < 50:
        risk_factors.append("Low placement readiness")
    
    if success_score < 50 or len(risk_factors) >= 3:
        risk_level = "High"
    elif success_score < 70 or len(risk_factors) >= 2:
        risk_level = "Medium"
    else:
        risk_level = "Low"
    
    # ========== SEGMENTATION ==========
    if avg_marks > 75 and placement_readiness < 60:
        segment = "High Academic, Low Placement"
    elif avg_marks < 50 and attendance_pct < 70:
        segment = "At-Risk: Disengaged"
    elif avg_marks > 75 and placement_readiness > 75:
        segment = "Star Performer"
    elif attendance_pct < 60:
        segment = "Chronic Absentee"
    else:
        segment = "Steady Performer"
    
    cur.execute("""
        INSERT INTO students VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        roll, name, "CSE", 4, round(avg_marks, 1), cgpa, backlogs,
        round(attendance_pct, 1), login_count, assignments_submitted, assignments_total,
        avg_delay, events, clubs, hackathons, certs,
        round(aptitude, 1), round(coding, 1), round(mock, 1), placement_readiness,
        round(tech_score, 1), round(soft_score, 1),
        satisfaction, faculty_fb,
        success_score, risk_level, ", ".join(risk_factors) if risk_factors else "None",
        segment
    ))

conn.commit()
conn.close()
print(f"✅ {len(students)} students added to database!")
print(f"📁 Database: {DB_PATH}")