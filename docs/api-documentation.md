# API Documentation

## Base URLs

- Server API: `/api`
- AI Service: `/`

## Auth

### `POST /api/auth/register`

Request body:

```json
{
  "name": "Aakash",
  "email": "aakash@example.com",
  "password": "password123"
}
```

### `POST /api/auth/login`

### `POST /api/auth/logout`

## Profile

### `GET /api/profile`

### `PUT /api/profile`

Multipart form fields:

- `name`
- `email`
- `password`
- `avatar`

## Predictions

### `POST /api/predictions`

Multipart form fields:

- `image`

Response includes:

- `diseaseName`
- `confidence`
- `treatment`
- `symptoms`
- `causes`
- `prevention`
- `probabilities`
- `reportUrl`

### `GET /api/predictions/:id/report`

## History

### `GET /api/history`

Query params:

- `search`
- `filter`

### `GET /api/history/stats`

### `GET /api/history/:id`

### `DELETE /api/history/:id`

## Diseases

### `GET /api/diseases`

### `GET /api/diseases/:slug`

## AI Service

### `GET /health`

### `POST /predict`

Multipart form fields:

- `file`

Response:

```json
{
  "diseaseName": "Anthracnose",
  "confidence": 0.9642,
  "treatment": "...",
  "symptoms": ["..."],
  "causes": ["..."],
  "prevention": "...",
  "probabilities": []
}
```
