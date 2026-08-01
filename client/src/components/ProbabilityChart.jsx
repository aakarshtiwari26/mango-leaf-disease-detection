export default function ProbabilityChart({ probabilities = [] }) {
  return (
    <div className="space-y-3">
      {probabilities.map((item) => (
        <div key={item.disease} className="space-y-1">
          <div className="flex items-center justify-between text-sm text-white/70">
            <span>{item.disease}</span>
            <span>{(item.confidence * 100).toFixed(1)}%</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-mango-300 to-leaf-400"
              style={{ width: `${Math.max(item.confidence * 100, 4)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
