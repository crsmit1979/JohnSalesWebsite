# main.py
import sqlite3

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware


DATABASE = "users.db"


# -------------------------
# Database setup
# -------------------------

def initialize_database():
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()

    # Create the table if it doesn't exist
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE
        )
    """)

    # Add initial users if they don't already exist
    cursor.execute("""
        INSERT OR IGNORE INTO users (id, name, email)
        VALUES (?, ?, ?)
    """, (1, "John Doe", "john@example.com"))

    cursor.execute("""
        INSERT OR IGNORE INTO users (id, name, email)
        VALUES (?, ?, ?)
    """, (2, "Jane Steward", "jane.stweard@example.com"))

    conn.commit()
    conn.close()


# Initialize database when application starts
initialize_database()


# -------------------------
# FastAPI
# -------------------------

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -------------------------
# Routes
# -------------------------

@app.get("/")
def root():
    return {
        "message": "Hello, World!",
        "status": "success"
    }


@app.get("/api/users")
def get_users():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row

    cursor = conn.cursor()

    cursor.execute("""
        SELECT id, name, email
        FROM users
    """)

    users = cursor.fetchall()

    conn.close()

    return [dict(user) for user in users]


@app.get("/api/users/{user_id}")
def get_user(user_id: int):
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row

    cursor = conn.cursor()

    cursor.execute("""
        SELECT id, name, email
        FROM users
        WHERE id = ?
    """, (user_id,))

    user = cursor.fetchone()

    conn.close()

    if user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return dict(user)