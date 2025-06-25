from pydantic import BaseModel, EmailStr, constr, validator
from datetime import date

class UserCreate(BaseModel):
    first_name: constr(min_length=2)
    last_name: constr(min_length=2)
    email: EmailStr
    birth_date: date
    city: constr(min_length=2)
    postal_code: str

    @validator('postal_code')
    def validate_postal_code(cls, v):
        import re
        if not re.match(r"^\d{5}$", v):
            raise ValueError('Le code postal doit contenir exactement 5 chiffres.')
        return v

class UserOut(UserCreate):
    id: int

    class Config:
        from_attributes = True