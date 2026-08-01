import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import ThemeToggle from "./ThemeToggle";

const navLinkClass = ({ isActive }) =>
  `rounded-full px-4 py-2 text-sm font-medium transition ${
    isActive
      ? "bg-white/15 text-white"
      : "text-white/70 hover:bg-white/10 hover:text-white"
  }`;

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/70 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-mango-300 to-leaf-400 text-lg font-black text-slate-950 shadow-glow">
            M
          </div>
          <div>
            <p className="font-display text-lg font-bold tracking-tight text-white">
              Mango AI
            </p>
            <p className="text-xs text-white/55">Leaf disease detection</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          <NavLink className={navLinkClass} to="/">
            Home
          </NavLink>
          <NavLink className={navLinkClass} to="/about">
            About
          </NavLink>
          <NavLink className={navLinkClass} to="/upload">
            Upload
          </NavLink>
          <NavLink className={navLinkClass} to="/dashboard">
            Dashboard
          </NavLink>
          <NavLink className={navLinkClass} to="/history">
            History
          </NavLink>
          <NavLink className={navLinkClass} to="/profile">
            Profile
          </NavLink>
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          {user ? (
            <button
              type="button"
              onClick={logout}
              className="rounded-full bg-mango-300 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-mango-200"
            >
              Logout
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="rounded-full px-4 py-2 text-sm font-semibold text-white/80 hover:bg-white/10 hover:text-white"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-full bg-leaf-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-leaf-300"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
