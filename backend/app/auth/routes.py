import logging
from fastapi import APIRouter, Depends, HTTPException, Response, Request, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import get_settings
from app.database import get_db
from app.auth.dependencies import get_current_user
from app.auth.models import User
from app.auth.schemas import (
    UserRegister, UserLogin, UserResponse,
    UserUpdate, PasswordResetRequest, PasswordResetConfirm,
    MessageResponse
)
from app.auth.services import (
    create_user, authenticate_user, get_user_by_email,
    create_access_token, create_refresh_token,
    create_password_reset_token, verify_token,
    get_user_by_id, hash_password,
)

logger = logging.getLogger(__name__)
settings = get_settings()
router = APIRouter(prefix="/api/auth", tags=["auth"])

COOKIE_SETTINGS = {
    "httponly": True,
    "secure": False,  # Set True in production (HTTPS)
    "samesite": "lax",
    "path": "/",
}


def _set_auth_cookies(response: Response, user: User):
    access_token = create_access_token(user.id)
    refresh_token = create_refresh_token(user.id)

    response.set_cookie(
        key="access_token",
        value=access_token,
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        **COOKIE_SETTINGS,
    )
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        max_age=settings.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60,
        **COOKIE_SETTINGS,
    )


def _clear_auth_cookies(response: Response):
    response.delete_cookie("access_token", path="/")
    response.delete_cookie("refresh_token", path="/")


@router.post("/register", response_model=UserResponse)
async def register(data: UserRegister, response: Response, db: AsyncSession = Depends(get_db)):
    if len(data.password) < 8:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 8 characters",
        )

    existing = await get_user_by_email(db, data.email)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered",
        )

    user = await create_user(db, data.email, data.password)
    _set_auth_cookies(response, user)
    return user


@router.post("/login", response_model=UserResponse)
async def login(data: UserLogin, response: Response, db: AsyncSession = Depends(get_db)):
    user = await authenticate_user(db, data.email, data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    _set_auth_cookies(response, user)
    return user


@router.post("/logout", response_model=MessageResponse)
async def logout(response: Response):
    _clear_auth_cookies(response)
    return {"message": "Logged out"}


@router.post("/refresh", response_model=MessageResponse)
async def refresh(request: Request, response: Response, db: AsyncSession = Depends(get_db)):
    refresh_token = request.cookies.get("refresh_token")
    if not refresh_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="No refresh token",
        )

    payload = verify_token(refresh_token, expected_type="refresh")
    if not payload:
        _clear_auth_cookies(response)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token",
        )

    from uuid import UUID
    user = await get_user_by_id(db, UUID(payload["sub"]))
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )

    access_token = create_access_token(user.id)
    response.set_cookie(
        key="access_token",
        value=access_token,
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        **COOKIE_SETTINGS,
    )
    return {"message": "Token refreshed"}


@router.get("/me", response_model=UserResponse)
async def get_me(user: User = Depends(get_current_user)):
    return user


@router.patch("/me", response_model=UserResponse)
async def update_me(
    data: UserUpdate,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if data.sector_preferences is not None:
        user.sector_preferences = data.sector_preferences
    await db.flush()
    await db.refresh(user)
    return user


@router.post("/password-reset/request", response_model=MessageResponse)
async def request_password_reset(data: PasswordResetRequest, db: AsyncSession = Depends(get_db)):
    user = await get_user_by_email(db, data.email)
    if user:
        token = create_password_reset_token(user.id)
        reset_link = f"{settings.FRONTEND_URL}/reset-password?token={token}"
        logger.info(f"Password reset link for {user.email}: {reset_link}")
    # Always return success to prevent email enumeration
    return {"message": "If the email exists, a reset link has been sent"}


@router.post("/password-reset/confirm", response_model=MessageResponse)
async def confirm_password_reset(data: PasswordResetConfirm, db: AsyncSession = Depends(get_db)):
    if len(data.new_password) < 8:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 8 characters",
        )

    payload = verify_token(data.token, expected_type="password_reset")
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset token",
        )

    from uuid import UUID
    user = await get_user_by_id(db, UUID(payload["sub"]))
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    user.password_hash = hash_password(data.new_password)
    await db.flush()
    return {"message": "Password updated successfully"}
