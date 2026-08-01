import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import SectionHeading from "../components/SectionHeading";
import Spinner from "../components/Spinner";
import { useAuth } from "../hooks/useAuth";

export default function Profile() {
  const { user, updateProfile, refreshProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [avatar, setAvatar] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        password: "",
      });
    }
  }, [user]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("email", formData.email);
      if (formData.password) payload.append("password", formData.password);
      if (avatar) payload.append("avatar", avatar);
      await updateProfile(payload);
      await refreshProfile();
      toast.success("Profile saved");
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return <Spinner fullscreen />;
  }

  return (
    <section className="px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[.8fr_1.2fr]">
        <div className="glass-card p-8">
          <img
            src={
              user.avatar ||
              "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=600&q=80"
            }
            alt={user.name}
            className="aspect-square w-full rounded-3xl object-cover"
          />
          <div className="mt-5">
            <p className="text-sm text-white/55">Signed in as</p>
            <h3 className="font-display text-2xl font-bold text-white">
              {user.name}
            </h3>
            <p className="mt-1 text-sm text-white/65">{user.email}</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="glass-card space-y-5 p-8">
          <SectionHeading
            eyebrow="Profile"
            title="Update your account details"
          />
          <Field label="Full Name">
            <input
              value={formData.name}
              onChange={(event) =>
                setFormData({ ...formData, name: event.target.value })
              }
              className="input"
            />
          </Field>
          <Field label="Email">
            <input
              type="email"
              value={formData.email}
              onChange={(event) =>
                setFormData({ ...formData, email: event.target.value })
              }
              className="input"
            />
          </Field>
          <Field label="New Password">
            <input
              type="password"
              value={formData.password}
              onChange={(event) =>
                setFormData({ ...formData, password: event.target.value })
              }
              className="input"
              placeholder="Leave blank to keep current password"
            />
          </Field>
          <Field label="Avatar">
            <input
              type="file"
              accept="image/*"
              onChange={(event) => setAvatar(event.target.files?.[0] || null)}
              className="input file:mr-4 file:rounded-xl file:border-0 file:bg-white/10 file:px-4 file:py-2 file:text-white"
            />
          </Field>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-2xl bg-mango-300 px-5 py-3 font-bold text-slate-950 disabled:opacity-60"
          >
            {submitting ? <Spinner /> : "Save Profile"}
          </button>
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
