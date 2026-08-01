import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import SectionHeading from "../components/SectionHeading";
import { useAuth } from "../hooks/useAuth";
import Spinner from "../components/Spinner";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await register(formData);
      navigate("/dashboard", { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
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
            title="Create your account"
            description="Register to store prediction history, download reports, and update your profile."
          />
        </div>
        <form onSubmit={handleSubmit} className="glass-card space-y-5 p-8">
          <Field label="Full Name">
            <input
              type="text"
              required
              value={formData.name}
              onChange={(event) =>
                setFormData({ ...formData, name: event.target.value })
              }
              className="input"
              placeholder="Aakash Tiwari"
            />
          </Field>
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
              minLength={8}
              value={formData.password}
              onChange={(event) =>
                setFormData({ ...formData, password: event.target.value })
              }
              className="input"
              placeholder="At least 8 characters"
            />
          </Field>
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-2xl bg-leaf-400 px-5 py-3 font-bold text-slate-950 transition hover:bg-leaf-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? <Spinner /> : "Register"}
          </button>
          <p className="text-center text-sm text-white/60">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-mango-300">
              Login here
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
