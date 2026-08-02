import axios from "axios";
import toast from "react-hot-toast";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("mango_leaf_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 4000;

// The backend runs on a free-tier host that spins down when idle and takes
// up to ~30-60s to wake on the next request, surfacing as a 502/503/504 or
// a bare network error. Retry those a couple of times with a short delay
// instead of failing the request outright.
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;
    const status = error.response?.status;
    const isRetriable = !error.response || [502, 503, 504].includes(status);

    if (config && isRetriable) {
      config._retryCount = (config._retryCount || 0) + 1;
      if (config._retryCount <= MAX_RETRIES) {
        if (config._retryCount === 1) {
          toast("Server is waking up, retrying...", { icon: "⏳" });
        }
        await new Promise((resolve) =>
          setTimeout(resolve, RETRY_DELAY_MS * config._retryCount),
        );
        return api(config);
      }
    }

    return Promise.reject(error);
  },
);

export async function downloadPredictionReport(predictionId) {
  const response = await api.get(`/predictions/${predictionId}/report`, {
    responseType: "blob",
  });

  const blobUrl = window.URL.createObjectURL(
    new Blob([response.data], { type: "application/pdf" }),
  );
  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = `prediction-${predictionId}.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(blobUrl);
}

export default api;
