from pydantic import BaseModel, EmailStr
from uuid import UUID


class UserRegister(BaseModel):
    email: str
    password: str


class UserLogin(BaseModel):
    email: str
    password: str


class UserResponse(BaseModel):
    id: UUID
    email: str
    email_verified: bool
    subscription_tier: str
    sector_preferences: dict | None = None

    class Config:
        from_attributes = True


class UserUpdate(BaseModel):
    sector_preferences: dict | None = None


class PasswordResetRequest(BaseModel):
    email: str


class PasswordResetConfirm(BaseModel):
    token: str
    new_password: str


class MessageResponse(BaseModel):
    message: str
