from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.auth.schemas import (
    UserRegister, UserLogin, UserResponse,
    UserUpdate, PasswordResetRequest, PasswordResetConfirm,
    MessageResponse
)

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/register", response_model=UserResponse)
async def register(data: UserRegister, db: AsyncSession = Depends(get_db)):
    """Register a new user. Returns user data and sets auth cookies."""
    # Implemented in Plan 02
    pass


@router.post("/login", response_model=UserResponse)
async def login(data: UserLogin, db: AsyncSession = Depends(get_db)):
    """Login with email/password. Sets JWT cookies."""
    # Implemented in Plan 02
    pass


@router.post("/logout", response_model=MessageResponse)
async def logout():
    """Clear auth cookies."""
    # Implemented in Plan 02
    pass


@router.post("/refresh", response_model=MessageResponse)
async def refresh():
    """Refresh access token using refresh token cookie."""
    # Implemented in Plan 02
    pass


@router.get("/me", response_model=UserResponse)
async def get_me(db: AsyncSession = Depends(get_db)):
    """Get current authenticated user."""
    # Implemented in Plan 02
    pass


@router.patch("/me", response_model=UserResponse)
async def update_me(data: UserUpdate, db: AsyncSession = Depends(get_db)):
    """Update current user profile (sector preferences)."""
    # Implemented in Plan 02
    pass


@router.post("/password-reset/request", response_model=MessageResponse)
async def request_password_reset(data: PasswordResetRequest, db: AsyncSession = Depends(get_db)):
    """Request password reset link."""
    # Implemented in Plan 02
    pass


@router.post("/password-reset/confirm", response_model=MessageResponse)
async def confirm_password_reset(data: PasswordResetConfirm, db: AsyncSession = Depends(get_db)):
    """Confirm password reset with token."""
    # Implemented in Plan 02
    pass
