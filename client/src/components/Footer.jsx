import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-white/10 bg-slate-950/60">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-3 lg:px-8">
        <div>
          <h3 className="font-display text-xl font-bold text-white">
            Mango AI
          </h3>
          <p className="mt-3 max-w-md text-sm leading-6 text-white/65">
            A full-stack MERN and AI platform for mango leaf disease detection,
            history tracking, and treatment guidance.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-white/50">
            Explore
          </h4>
          <div className="mt-4 flex flex-col gap-2 text-sm text-white/70">
            <Link to="/about">About Disease Detection</Link>
            <Link to="/upload">Upload Leaf</Link>
            <Link to="/history">Prediction History</Link>
          </div>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-white/50">
            Disease List
          </h4>
          <p className="mt-4 text-sm leading-6 text-white/70">
            Healthy, Anthracnose, Bacterial Canker, Cutting Weevil, Die Back,
            Gall Midge, Powdery Mildew, and Sooty Mold.
          </p>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/45">
        © 2026 Mango AI. Built for production deployment.
      </div>
    </footer>
  );
}
