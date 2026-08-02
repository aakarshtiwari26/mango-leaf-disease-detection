import axios from "axios";

export const aiServiceClient = axios.create({
  baseURL: process.env.AI_SERVICE_URL || "http://localhost:8000",
  timeout: 120000,
});

// Measured cold start on the free-tier ai-service host is ~30-35s. Poll at
// a fixed interval with enough attempts to comfortably clear that with
// margin, rather than a short exponential backoff that can run out right
// as the service is about to come up.
const MAX_RETRIES = 8;
const RETRY_DELAY_MS = 8000;

// The AI service runs on a free-tier host that spins down when idle and can
// take up to a minute to cold-start on the next request, surfacing as a
// 502/503/504 or a bare connection error. Retry those instead of failing
// the prediction outright.
aiServiceClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;
    const status = error.response?.status;
    const isRetriable = !error.response || [502, 503, 504].includes(status);

    if (config && isRetriable) {
      config._retryCount = (config._retryCount || 0) + 1;
      if (config._retryCount <= MAX_RETRIES) {
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
        return aiServiceClient(config);
      }
    }

    return Promise.reject(error);
  },
);
