from fastapi import FastAPI, UploadFile, File, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

import hashlib
import sqlite3
import os
import time
import asyncio


app = FastAPI()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

DB_FILE = "file_hashes.db"
conn = sqlite3.connect(DB_FILE)
cursor = conn.cursor()
cursor.execute("""
    CREATE TABLE IF NOT EXISTS files (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        file_path TEXT UNIQUE,
        stored_hash TEXT
    )
""")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


active_connections = set()

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    active_connections.add(websocket)
    try:
        while True:
            await asyncio.sleep(10) 
    except Exception:
        pass
    finally:
        active_connections.remove(websocket)

async def check_file_integrity():
    while True:
        cursor.execute("SELECT id, file_path, stored_hash FROM files")
        files = cursor.fetchall()

        for file_id, file_path, stored_hash in files:
            current_hash = calculate_hash(file_path)

            if current_hash is None:
                message = f"❌ File missing: {file_path}"
            elif current_hash != stored_hash:
                message = f"⚠️ WARNING: File {file_path} has been modified!"
                cursor.execute("UPDATE files SET stored_hash = ? WHERE id = ?", (current_hash, file_id))
                conn.commit()
            else:
                continue  

            for connection in active_connections:
                await connection.send_text(message)

        await asyncio.sleep(180)  

@app.on_event("startup")
async def start_monitoring():
    asyncio.create_task(check_file_integrity())




def generate_file_hash(file_path):
    hasher = hashlib.sha256()
    with open(file_path, "rb") as f:
        while chunk := f.read(8192):
            hasher.update(chunk)
    return hasher.hexdigest()


@app.get("/")
def readRoot():
    return {"Hello": "World"}

@app.post("/uploadFile")
async def uploadFiles(file: UploadFile = File(...)):
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    
    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())

    file_hash = generate_file_hash(file_path)

    try:
        cursor.execute("INSERT INTO files (filename, hash) VALUES (?, ?)", (file.filename, file_hash))
        conn.commit()
    except sqlite3.IntegrityError:
        return {"error": "File already exists!"}

    return {"filename": file.filename, "hash": file_hash, "message": "File uploaded successfully!"}


@app.get("/getAllFiles")
async def get_all_files():
    cursor.execute("SELECT id, file_path, stored_hash FROM files")
    files = cursor.fetchall()
    return JSONResponse(content={"files": [{"id": f[0], "path": f[1], "hash": f[2]} for f in files]})
