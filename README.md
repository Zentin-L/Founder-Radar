# Founder Radar

Real-time signal feed that helps VC analysts discover early-stage startups showing breakout growth signals before they raise funding.

## Tech Stack

- **Frontend**: Next.js 15, TypeScript, TanStack Query
- **Backend**: Python, FastAPI, SQLAlchemy 2.0
- **Database**: PostgreSQL 16, Redis 7
- **Auth**: JWT in httpOnly cookies

## Quick Start

### Prerequisites

- Docker & Docker Compose
- Node.js 20+
- Python 3.12+

### 1. Start databases

```bash
docker-compose up -d
```

### 2. Set up backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
cp ../.env.example .env
alembic upgrade head
uvicorn app.main:app --reload
```

### 3. Set up frontend

```bash
cd frontend
npm install
cp ../.env.example .env.local
npm run dev
```

### Access

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs
