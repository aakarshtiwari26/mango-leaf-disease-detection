import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import SectionHeading from "../components/SectionHeading";
import { useAuth } from "../hooks/useAuth";
import Spinner from "../components/Spinner";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await login(formData);
      navigate(location.state?.from?.pathname || "/dashboard", {
        replace: true,
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[.95fr_1.05fr]">
        <div className="glass-card p-8">
          <SectionHeading
            eyebrow="Authentication"
            title="Login to your dashboard"
            description="Access prediction history, profile settings, and report downloads."
          />
        </div>
        <form onSubmit={handleSubmit} className="glass-card space-y-5 p-8">
          <Field label="Email">
            <input
              type="email"
              required
              value={formData.email}
              onChange={(event) =>
                setFormData({ ...formData, email: event.target.value })
              }
              className="input"
              placeholder="you@example.com"
            />
          </Field>
          <Field label="Password">
            <input
              type="password"
              required
              value={formData.password}
              onChange={(event) =>
                setFormData({ ...formData, password: event.target.value })
              }
              className="input"
              placeholder="••••••••"
            />
          </Field>
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-2xl bg-mango-300 px-5 py-3 font-bold text-slate-950 transition hover:bg-mango-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? <Spinner /> : "Login"}
          </button>
          <p className="text-center text-sm text-white/60">
            No account yet?{" "}
            <Link to="/register" className="font-semibold text-mango-300">
              Register here
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
}

function Field({ label, children }) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-white/70">{label}</span>
      {children}
    </label>
  );
}
