import mysql.connector
from mysql.connector import Error
from . import schemas
import os
from dotenv import load_dotenv
from fastapi import HTTPException
import re

# Charger les variables du .env
load_dotenv()

# Construire l'URL de connexion à la DB
MYSQL_USER = os.getenv("MYSQL_USER")
MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD")
MYSQL_HOST = os.getenv("MYSQL_HOST")
MYSQL_DATABASE = os.getenv("MYSQL_DATABASE")

# Expressions régulières pour valider les noms et les villes
NAME_REGEX = re.compile(r"^[A-Za-z\u00c0-\u00ff' -]{2,}$")
EMAIL_REGEX = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")

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

def create_user(user: schemas.UserCreate):
    try:
        cursor = connection.cursor(dictionary=True)
        # Vérifier si l'utilisateur existe déjà
        cursor.execute("SELECT * FROM users WHERE email = %s", (user.email,))
        existing_user = cursor.fetchone()
        if existing_user:
            print(f"❌ Utilisateur déjà existant: {user.email}")
            raise HTTPException(status_code=400, detail="L'utilisateur avec cet email existe déjà")

        # Valider l'email
        if not EMAIL_REGEX.match(user.email):
            print("❌ Email invalide.")
            raise HTTPException(status_code=400, detail="Email invalide.")

        # Valider les autres champs
        if not NAME_REGEX.match(user.first_name):
            print("❌ Prénom invalide.")
            raise HTTPException(status_code=400, detail="Prénom invalide.")
        if not NAME_REGEX.match(user.last_name):
            print("❌ Nom invalide.")
            raise HTTPException(status_code=400, detail="Nom invalide.")
        if not NAME_REGEX.match(user.city):
            print("❌ Ville invalide.")
            raise HTTPException(status_code=400, detail="Ville invalide.")
        if len(user.postal_code) != 5 or not user.postal_code.isdigit():
            print("❌ Code postal invalide.")
            raise HTTPException(status_code=400, detail="Code postal invalide.")

        cursor = connection.cursor()
        add_user = ("INSERT INTO users "
                    "(first_name, last_name, email, birth_date, city, postal_code) "
                    "VALUES (%s, %s, %s, %s, %s, %s)")
        data_user = (user.first_name, user.last_name, user.email, user.birth_date, user.city, user.postal_code)
        cursor.execute(add_user, data_user)
        connection.commit()
        user_id = cursor.lastrowid
        cursor.close()
        print(f"✅ User created with ID: {user_id}")
        return {"id": user_id, **user.dict(), "message": "✅ Formulaire enregistré avec succès !"}
    except Error as e:
        print(f"❌ Error during user creation: {e}")
        raise HTTPException(status_code=500, detail="Erreur lors de la création de l'utilisateur")

def get_users(skip: int = 0, limit: int = 100):
    try:
        cursor = connection.cursor(dictionary=True)
        query = "SELECT * FROM users LIMIT %s OFFSET %s"
        cursor.execute(query, (limit, skip))
        result = cursor.fetchall()
        # Convertir birth_date en chaîne de caractères
        for user in result:
            user['birth_date'] = str(user['birth_date'])
        cursor.close()
        return result
    except Error as e:
        print(f"❌ Error fetching users: {e}")
        raise HTTPException(status_code=500, detail="Erreur lors de la récupération des utilisateurs")