import { createContext, useEffect, useMemo, useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      const token = localStorage.getItem("mango_leaf_token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await api.get("/profile");
        setUser(data.user);
      } catch (error) {
        // Only clear the token on a genuine auth rejection. A transient
        // network error or cold-start 502/503 from the free-tier host
        // isn't proof the token is invalid, and clearing it here forces
        // the user to log in again for no reason.
        if (error.response?.status === 401) {
          localStorage.removeItem("mango_leaf_token");
        }
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
  }, []);

  const auth = useMemo(
    () => ({
      user,
      loading,
      async login(values) {
        const { data } = await api.post("/auth/login", values);
        localStorage.setItem("mango_leaf_token", data.token);
        setUser(data.user);
        toast.success("Welcome back!");
      },
      async register(values) {
        const { data } = await api.post("/auth/register", values);
        localStorage.setItem("mango_leaf_token", data.token);
        setUser(data.user);
        toast.success("Account created successfully");
      },
      async updateProfile(formData) {
        const { data } = await api.put("/profile", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setUser((current) => ({ ...current, ...data.user }));
        toast.success("Profile updated");
      },
      async refreshProfile() {
        const { data } = await api.get("/profile");
        setUser(data.user);
      },
      logout() {
        localStorage.removeItem("mango_leaf_token");
        setUser(null);
        toast.success("Logged out");
      },
    }),
    [user, loading],
  );

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}
