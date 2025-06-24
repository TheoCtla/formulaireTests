import time
from fastapi import FastAPI, Depends
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
import models
import schemas
import crud

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
    return crud.create_user(db=db, user=user)

@app.get("/users/", response_model=list[schemas.UserOut])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_users(db=db, skip=skip, limit=limit)