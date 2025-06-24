import time
import os
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from dotenv import load_dotenv
from app import models
from app import schemas
from app import crud
import mysql.connector
from mysql.connector import Error
from fastapi.responses import RedirectResponse

# Charger les variables du .env
load_dotenv()

# Construire l'URL de connexion à la DB
MYSQL_USER = os.getenv("MYSQL_USER")
MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD")
MYSQL_HOST = os.getenv("MYSQL_HOST")
MYSQL_DATABASE = os.getenv("MYSQL_DATABASE")

try:
    connection = mysql.connector.connect(
        host=MYSQL_HOST,
        user=MYSQL_USER,
        password=MYSQL_PASSWORD,
        database=MYSQL_DATABASE
    )
    if connection.is_connected():
        print("✅ Database connection established")
except Error as e:
    print(f"❌ Error: {e}")

app = FastAPI()

# Ajouter CORS pour permettre les requêtes depuis le frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Backend OK"}

@app.post("/users/", response_model=schemas.UserOut)
def create_user(user: schemas.UserCreate):
    print(f"🔍 Tentative de création: {user}")  # Log des données reçues
    result = crud.create_user(user=user)
    if result is None:
        print(f"❌ Échec de création pour: {user.email}")
        raise HTTPException(status_code=400, detail="Erreur lors de la création de l'utilisateur")
    print(f"✅ Utilisateur créé: {user.email}")
    return result

@app.get("/users/", response_model=list[schemas.UserOut])
def read_users(skip: int = 0, limit: int = 100):
    return crud.get_users(skip=skip, limit=limit)

@app.get("/{full_path:path}")
def catch_all(full_path: str):
    print(f"🔄 Redirection de l'URL incorrecte: {full_path}")
    return RedirectResponse(url="/")