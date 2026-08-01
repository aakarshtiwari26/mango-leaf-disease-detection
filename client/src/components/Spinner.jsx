export default function Spinner({ fullscreen = false }) {
  return (
    <div
      className={`flex items-center justify-center ${fullscreen ? "min-h-[70vh]" : ""}`}
    >
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/15 border-t-mango-300" />
    </div>
  );
}
