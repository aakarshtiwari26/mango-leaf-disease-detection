import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl glass-card p-12 text-center">
        <p className="text-sm uppercase tracking-[0.35em] text-white/45">404</p>
        <h1 className="mt-4 font-display text-4xl font-black text-white">
          Page not found
        </h1>
        <p className="mt-4 text-white/65">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex rounded-2xl bg-mango-300 px-5 py-3 font-bold text-slate-950"
        >
          Return Home
        </Link>
      </div>
    </section>
  );
}
