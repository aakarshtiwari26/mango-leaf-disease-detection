import { useEffect, useState } from "react";
import api from "../services/api";
import SectionHeading from "../components/SectionHeading";
import StatsCard from "../components/StatsCard";
import Spinner from "../components/Spinner";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const { data } = await api.get("/history/stats");
        setStats(data.stats);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) {
    return <Spinner fullscreen />;
  }

  return (
    <section className="px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-10">
        <SectionHeading
          eyebrow="Dashboard"
          title="Your mango leaf analytics"
          description="Track predictions, disease trends, and recent diagnosis activity."
        />
        <div className="grid gap-5 md:grid-cols-3">
          <StatsCard
            label="Total Predictions"
            value={stats.totalPredictions}
            hint="All stored scans"
          />
          <StatsCard
            label="Diseased Leaves"
            value={stats.diseasedCount}
            hint="Scans flagged as diseased"
            tone="leaf"
          />
          <StatsCard
            label="Healthy Leaves"
            value={stats.healthyCount}
            hint="Scans flagged healthy"
          />
        </div>
        <div className="glass-card p-6">
          <h3 className="font-display text-2xl font-bold text-white">
            Recent predictions
          </h3>
          <div className="mt-5 grid gap-3">
            {stats.recentPredictions.map((prediction) => (
              <div
                key={prediction._id}
                className="rounded-2xl border border-white/10 bg-white/5 p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-white">
                      {prediction.diseaseName}
                    </p>
                    <p className="text-sm text-white/60">
                      {new Date(prediction.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${prediction.healthy ? "bg-leaf-400/20 text-leaf-200" : "bg-mango-300/20 text-mango-200"}`}
                  >
                    {(prediction.confidence * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
