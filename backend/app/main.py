from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import get_settings
from app.auth.routes import router as auth_router
from app.startups.routes import router as startups_router
from app.signals.routes import router as signals_router
from app.scoring.routes import router as scoring_router

settings = get_settings()

app = FastAPI(
    title="Founder Radar API",
    description="Real-time startup growth signal tracking for VC analysts",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth_router)
app.include_router(startups_router)
app.include_router(signals_router)
app.include_router(scoring_router)


@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "version": "0.1.0"}
