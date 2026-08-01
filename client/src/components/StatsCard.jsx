export default function StatsCard({ label, value, hint, tone = "mango" }) {
  const gradient =
    tone === "leaf"
      ? "from-leaf-400 to-leaf-200"
      : "from-mango-300 to-mango-100";

  return (
    <div className="glass-card gradient-border p-6">
      <p className="text-sm font-medium text-white/55">{label}</p>
      <div
        className={`mt-3 bg-gradient-to-r ${gradient} bg-clip-text text-3xl font-black text-transparent`}
      >
        {value}
      </div>
      {hint ? <p className="mt-2 text-sm text-white/60">{hint}</p> : null}
    </div>
  );
}
