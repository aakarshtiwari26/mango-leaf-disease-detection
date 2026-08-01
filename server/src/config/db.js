import mongoose from "mongoose";
const sleep = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

export async function connectDB() {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("MONGODB_URI is required");
  }

  const maxAttempts = Number(process.env.MONGODB_CONNECT_RETRIES || 10);
  const retryDelayMs = Number(process.env.MONGODB_CONNECT_DELAY_MS || 1000);

  let lastError;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      await mongoose.connect(mongoUri);
      return;
    } catch (error) {
      lastError = error;

      if (attempt < maxAttempts) {
        await sleep(retryDelayMs);
      }
    }
  }

  throw lastError;
}

export async function disconnectDB() {
  await mongoose.disconnect();
}
