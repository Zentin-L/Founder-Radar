from pydantic import BaseModel, Field, field_validator


class RequestAccessCreate(BaseModel):
    email: str
    firm: str = Field(min_length=2, max_length=255)
    role: str = Field(min_length=2, max_length=255)
    sector: str = Field(min_length=1, max_length=100)
    stageFocus: str = Field(min_length=1, max_length=100)
    message: str | None = Field(default=None, max_length=4000)

    @field_validator("email")
    @classmethod
    def validate_email(cls, value: str) -> str:
        email = value.strip()
        if "@" not in email or "." not in email.split("@")[-1]:
            raise ValueError("Please enter a valid email.")
        return email


class RequestAccessCreateResponse(BaseModel):
    success: bool


class RequestAccessVerifyResponse(BaseModel):
    success: bool
    message: str
