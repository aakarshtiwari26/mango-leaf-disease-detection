import axios from "axios";

export const aiServiceClient = axios.create({
  baseURL: process.env.AI_SERVICE_URL || "http://localhost:8000",
  timeout: 120000,
});

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 5000;

// The AI service runs on a free-tier host that spins down when idle and can
// take up to a minute to cold-start on the next request, surfacing as a
// 502/503/504 or a bare connection error. Retry those with backoff instead
// of failing the prediction outright.
aiServiceClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;
    const status = error.response?.status;
    const isRetriable = !error.response || [502, 503, 504].includes(status);

    if (config && isRetriable) {
      config._retryCount = (config._retryCount || 0) + 1;
      if (config._retryCount <= MAX_RETRIES) {
        await new Promise((resolve) =>
          setTimeout(resolve, RETRY_DELAY_MS * config._retryCount),
        );
        return aiServiceClient(config);
      }
    }

    return Promise.reject(error);
  },
);
