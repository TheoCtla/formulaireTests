from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
import models
import schemas

def create_user(db: Session, user: schemas.UserCreate):
    print(f"🔍 Création user: {user.email}")
    db_user = models.User(
        first_name=user.first_name,
        last_name=user.last_name,
        email=user.email,
        birth_date=user.birth_date,
        city=user.city,
        postal_code=user.postal_code
    )
    try:
        db.add(db_user)
        print("📝 User ajouté en session")
        db.commit()
        print("💾 Session commitée")
        db.refresh(db_user)
        print(f"✅ User créé avec ID: {db_user.id}")
    except IntegrityError as e:
        db.rollback()
        print(f"❌ Erreur d'intégrité: {e}")
        return None
    except Exception as e:
        db.rollback()
        print(f"❌ Erreur inattendue: {e}")
        return None
    return db_user

def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()