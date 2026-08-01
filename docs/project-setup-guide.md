# Project Setup Guide

## Repository Layout

```text
client/
server/
ai-service/
docs/
```

## Configuration Strategy

- Keep database, JWT, and service URLs in environment variables.
- Keep the client API base URL relative so Docker and local dev both work.
- Train and store the model in `ai-service/model.keras`.
- Persist uploaded images and PDF reports on the server filesystem.

## Recommended Workflow

1. Start MongoDB.
2. Run the AI service and ensure `model.keras` exists.
3. Start the Express API.
4. Start the React client.
5. Register a user and upload a leaf image.

## Deployment Notes

- The client container serves the SPA and proxies `/api` and `/uploads` to the backend.
- The server container connects to MongoDB and the AI service over the Docker network.
- The AI service uses the saved Keras model for inference.
