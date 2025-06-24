import time
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from app import models
from app import schemas
from app import crud

DATABASE_URL = "mysql+mysqlconnector://user:userpassword@mysql:3306/formulaire"

# On tente de se connecter jusqu'à ce que MySQL soit prêt
for i in range(10):
    try:
        engine = create_engine(DATABASE_URL)
        engine.connect()
        print("✅ Database connection established")
        break
    except Exception as e:
        print(f"⏳ Database not ready yet ({i+1}/10), retrying in 2s...")
        time.sleep(2)
else:
    print("❌ Could not connect to database after 10 tries, exiting...")
    exit(1)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Ajouter CORS pour permettre les requêtes depuis le frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # URL de ton frontend React (Vite utilise 5173)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def read_root():
    return {"message": "Backend OK"}

@app.post("/users/", response_model=schemas.UserOut)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    print(f"🔍 Tentative de création: {user.email}")
    result = crud.create_user(db=db, user=user)
    if result is None:
        print(f"❌ Échec de création pour: {user.email}")
        from fastapi import HTTPException
        raise HTTPException(status_code=400, detail="Erreur lors de la création de l'utilisateur")
    print(f"✅ Utilisateur créé: {result.email}")
    return result

@app.get("/users/", response_model=list[schemas.UserOut])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_users(db=db, skip=skip, limit=limit)