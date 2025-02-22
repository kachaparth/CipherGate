from typing import Union

from fastapi import FastAPI, UploadFile, File


app = FastAPI()


@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.post("/uploadFile")
def uploadFile(file: UploadFile = File(...)):
    print(file.filename)