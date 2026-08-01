# Mango Leaf Disease Detection Using InceptionV3

Full-stack MERN + AI app for mango leaf disease detection with a React frontend, Express API, FastAPI inference service, PDF reports, and JWT auth.

## What is included

- Client: React, Vite, Axios, React Router
- Server: Express, Mongoose, JWT, Multer, PDF generation
- AI service: FastAPI, TensorFlow, InceptionV3 prediction pipeline

## Folder Structure

- `client/` React app
- `server/` Express API
- `ai-service/` FastAPI inference service
- `scripts/` root launch helpers

## Environment Files

The repo now uses real `.env` files:

- `client/.env`
- `server/.env`
- `ai-service/.env`

Edit `server/.env` only if you need to point at a different MongoDB or AI service host.

## Setup

1. Install Node dependencies from the repository root:

```bash
npm install
```

2. Install Python dependencies for the AI service:

```bash
cd ai-service
pip install -r requirements.txt
```

3. Make sure `ai-service/model.keras` exists.

If it does not, train it from `ai-service`:

```bash
uvicorn app:app --reload
```

and use the training workflow in `ai-service/app/train.py`.

## Run

Start everything from the root:

```bash
npm run dev
```

Start services individually:

```bash
npm run client
npm run server
npm run ai
```

Expected local ports:

- Client: `5173`
- Server: `5000`
- AI service: `8000`

If one of those ports is already taken, the service that owns it will move to the next free local port.

## Service Commands

Client:

```bash
cd client
npm install
npm run dev
```

Server:

```bash
cd server
npm install
npm run dev
```

AI service:

```bash
cd ai-service
pip install -r requirements.txt
uvicorn app:app --reload
```

## Notes

- The server uses the local MongoDB URI from `server/.env` by default and falls back to an in-memory database for local development if MongoDB is not available.
- The client proxies API requests to the server during development.
- The AI service loads `model.keras` from the AI service folder.

## Docker

To run with Docker Compose:

````bash
docker compose up --build
```# Mango Leaf Disease Detection Using InceptionV3

A production-ready full-stack MERN + AI application for mango leaf disease detection.

## Stack

- Frontend: React, Vite, Tailwind CSS, React Router, Axios
- Backend: Node.js, Express.js, MongoDB, Mongoose, JWT, Multer, Express Validator, Helmet, CORS, Morgan, dotenv
- AI Service: Python, FastAPI, TensorFlow, Keras, InceptionV3, OpenCV, Pillow, NumPy
- Deployment: Docker, Docker Compose, environment-based configuration

## Project Structure

- `client` - React frontend
- `server` - Express API and MongoDB integration
- `ai-service` - FastAPI inference and training service

## Features

- Modern glassmorphism UI with dark/light theme support
- Register, login, JWT auth, protected routes, profile updates
- Leaf upload with preview, drag and drop, validation, and prediction
- History with search, filter, delete, and PDF report download
- Disease details pages and dashboard statistics
- AI inference using InceptionV3 transfer learning

## Quick Start

1. Copy the sample environment files into real `.env` files in each service folder.
2. Start MongoDB, then run the server, AI service, and client.
3. Add the dataset under `ai-service/dataset/` using the expected class folders.

## Docker

Build and start everything with Docker Compose:

```bash
docker compose up --build
````

## Local Development

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
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

## Training

Place images in the folder structure below and run `python -m app.train` from `ai-service`.

```text
dataset/
  Healthy/
  Anthracnose/
  Bacterial_Canker/
  Die_Back/
  Gall_Midge/
  Powdery_Mildew/
  Sooty_Mold/
  Cutting_Weevil/
```

## Ports

- Client: `3000` in Docker, `5173` in local Vite dev
- Server: `5000`
- AI service: `8000`
- MongoDB: `27017`

## Security

- Password hashing with bcrypt
- JWT authentication
- Helmet, CORS, rate limiting, and input sanitization
- Server-side validation and file type checks
