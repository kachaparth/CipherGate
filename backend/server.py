from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import hashlib
import sqlite3
import os

# Initialize FastAPI app
app = FastAPI()

# Set upload directory
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Set up SQLite database
DB_FILE = "file_hashes.db"
conn = sqlite3.connect(DB_FILE, check_same_thread=False)
cursor = conn.cursor()

# Create table to store file hashes
cursor.execute("""
    CREATE TABLE IF NOT EXISTS files (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        filename TEXT UNIQUE,
        stored_hash TEXT
    )
""")
conn.commit()

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow frontend access
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Function to generate a file hash
def generate_file_hash(file_path):
    """Reads a file and generates a SHA-256 hash."""
    hasher = hashlib.sha256()
    try:
        with open(file_path, "rb") as f:
            hasher.update(f.read())  # Read entire file at once
    except IOError as e:
        print(f"Error generating hash: {e}")
        return None
    return hasher.hexdigest()

@app.get("/")
def read_root():
    return {"message": "File Integrity Checker API"}

# Upload file and store hash
@app.post("/uploadFile")
async def upload_file(file: UploadFile = File(...), hash: str = Form(...)):
    file_path = os.path.join(UPLOAD_DIR, file.filename)

    try:
        # Save uploaded file
        with open(file_path, "wb") as buffer:
            buffer.write(await file.read())
    except IOError as e:
        return JSONResponse(content={"error": f"Error saving file: {e}"}, status_code=500)

    try:
        # Store file name & hash in database
        cursor.execute("INSERT INTO files (filename, stored_hash) VALUES (?, ?)", (file.filename, hash))
        conn.commit()
    except sqlite3.IntegrityError:
        return JSONResponse(content={"error": "File already exists!"}, status_code=400)

    return {"filename": file.filename, "hash": hash, "message": "File uploaded successfully!"}

# Get all stored files and their integrity status
@app.get("/getAllFiles")
async def get_all_files():
    cursor.execute("SELECT id, filename, stored_hash FROM files")
    files = cursor.fetchall()
    file_list = []

    for file_id, filename, stored_hash in files:
        file_path = os.path.join(UPLOAD_DIR, filename)
        if not os.path.exists(file_path):
            integrity_status = "Missing"
        else:
            current_hash = generate_file_hash(file_path)
            integrity_status = "OK" if current_hash == stored_hash else "Modified"

        file_list.append({"id": file_id, "path": filename, "hash": stored_hash, "integrity": integrity_status})

    return JSONResponse(content={"files": file_list})

# Check integrity of a specific file (Frontend sends hash every minute)
@app.post("/checkIntegrity")
async def check_integrity(data: dict):
    filename = data.get("filename")
    new_hash = data.get("hash")

    cursor.execute("SELECT stored_hash FROM files WHERE filename = ?", (filename,))
    result = cursor.fetchone()

    if not result:
        return JSONResponse(content={"status": "error", "message": "File not found in database"}, status_code=404)

    stored_hash = result[0]
    print("Cheking for file " + filename)
    print("New hash = " + new_hash)
    print("stored hash = " + stored_hash)
    integrity_status = "OK" if stored_hash == new_hash else "Modified"

    return {"filename": filename, "integrity": integrity_status}
