from pydantic import BaseModel

class UserCreate(BaseModel):
    first_name: str
    last_name: str
    email: str
    birth_date: str
    city: str
    postal_code: str

class UserOut(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: str
    birth_date: str
    city: str
    postal_code: str

    class Config:
        from_attributes = True