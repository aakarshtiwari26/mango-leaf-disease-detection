import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import SectionHeading from "../components/SectionHeading";
import api, { downloadPredictionReport } from "../services/api";
import Spinner from "../components/Spinner";

export default function PredictionHistory() {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const loadHistory = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/history", {
        params: { search, filter: filter === "all" ? "" : filter },
      });
      setPredictions(data.predictions);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const visiblePredictions = useMemo(() => predictions, [predictions]);

  const handleDelete = async (id) => {
    await api.delete(`/history/${id}`);
    toast.success("Prediction deleted");
    loadHistory();
  };

  const handleSearchSubmit = async (event) => {
    event.preventDefault();
    loadHistory();
  };

  return (
    <section className="px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <SectionHeading
          eyebrow="Prediction history"
          title="Search, filter, and delete past predictions"
        />
        <form
          onSubmit={handleSearchSubmit}
          className="flex flex-col gap-3 rounded-3xl border border-white/10 bg-white/5 p-4 lg:flex-row"
        >
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="input flex-1"
            placeholder="Search disease name"
          />
          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            className="input lg:w-56"
          >
            <option value="all">All</option>
            <option value="healthy">Healthy</option>
            <option value="diseased">Diseased</option>
          </select>
          <button
            type="submit"
            className="rounded-2xl bg-mango-300 px-5 py-3 font-bold text-slate-950"
          >
            Filter
          </button>
        </form>

        {loading ? (
          <Spinner fullscreen />
        ) : (
          <div className="grid gap-4">
            {visiblePredictions.map((prediction) => (
              <div
                key={prediction._id}
                className="glass-card grid gap-4 p-5 lg:grid-cols-[160px_1fr_auto] lg:items-center"
              >
                <img
                  src={prediction.imageUrl}
                  alt={prediction.diseaseName}
                  className="h-36 w-full rounded-2xl object-cover lg:h-28 lg:w-40"
                />
                <div>
                  <h3 className="font-display text-xl font-bold text-white">
                    {prediction.diseaseName}
                  </h3>
                  <p className="mt-1 text-sm text-white/60">
                    Prediction time: {prediction.predictionTimeMs} ms
                  </p>
                  <p className="mt-2 text-sm text-white/60">
                    {new Date(prediction.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => downloadPredictionReport(prediction._id)}
                    className="rounded-2xl bg-leaf-400 px-4 py-2 text-sm font-bold text-slate-950"
                  >
                    PDF
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(prediction._id)}
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
