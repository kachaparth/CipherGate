from typing import Union

from fastapi import FastAPI, UploadFile, File

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this later to restrict origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.post("/uploadFile")
def uploadFile(file: UploadFile = File(...)):
    print(file.filename)