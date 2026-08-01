# Installation Guide

## Prerequisites

- Node.js 22 or newer
- Python 3.11 or newer
- MongoDB 7 or compatible
- Docker and Docker Compose for container deployment

## Setup Steps

1. Use the committed `.env` files in `client`, `server`, and `ai-service`.
2. Change `server/.env` only if your MongoDB or AI service runs somewhere else.
3. Install dependencies from the repository root with `npm install`.
4. Install Python dependencies with `cd ai-service && pip install -r requirements.txt`.
5. Start the full stack with `npm run dev`.
6. Train the AI model if `model.keras` is not present.
7. Open the frontend and register a user account.

## Local Commands

### Server

```bash
cd server
npm install
npm run dev
```

### Client

```bash
cd client
npm install
npm run dev
```

### AI Service

```bash
cd ai-service
pip install -r requirements.txt
uvicorn app:app --reload --port 8000
```

## Dataset Layout

```text
ai-service/dataset/
  Healthy/
  Anthracnose/
  Bacterial_Canker/
  Cutting_Weevil/
  Die_Back/
  Gall_Midge/
  Powdery_Mildew/
  Sooty_Mold/
```
