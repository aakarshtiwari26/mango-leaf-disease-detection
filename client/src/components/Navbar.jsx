import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import ThemeToggle from "./ThemeToggle";

const navLinkClass = ({ isActive }) =>
  `rounded-full px-4 py-2 text-sm font-medium transition ${
    isActive
      ? "bg-white/15 text-white"
      : "text-white/70 hover:bg-white/10 hover:text-white"
  }`;

const mobileNavLinkClass = ({ isActive }) =>
  `block rounded-2xl px-4 py-3 text-base font-medium transition ${
    isActive
      ? "bg-white/15 text-white"
      : "text-white/70 hover:bg-white/10 hover:text-white"
  }`;

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/upload", label: "Upload" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/history", label: "History" },
  { to: "/profile", label: "Profile" },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/70 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3" onClick={closeMenu}>
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-mango-300 to-leaf-400 text-lg font-black text-slate-950 shadow-glow">
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
          {links.map((link) => (
            <NavLink key={link.to} className={navLinkClass} to={link.to}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden lg:block">
            <ThemeToggle />
          </div>
          {user ? (
            <button
              type="button"
              onClick={logout}
              className="hidden rounded-full bg-mango-300 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-mango-200 lg:inline-flex"
            >
              Logout
            </button>
          ) : (
            <div className="hidden items-center gap-2 lg:flex">
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

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white lg:hidden"
          >
            {menuOpen ? (
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M6 18L18 6" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {menuOpen ? (
        <div className="border-t border-white/10 px-4 pb-6 pt-3 sm:px-6 lg:hidden">
          <nav className="flex flex-col gap-1">
            {links.map((link) => (
              <NavLink
                key={link.to}
                className={mobileNavLinkClass}
                to={link.to}
                onClick={closeMenu}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-4 flex items-center justify-between gap-3">
            <ThemeToggle />
            {user ? (
              <button
                type="button"
                onClick={() => {
                  logout();
                  closeMenu();
                }}
                className="rounded-full bg-mango-300 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-mango-200"
              >
                Logout
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="rounded-full px-4 py-2 text-sm font-semibold text-white/80 hover:bg-white/10 hover:text-white"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={closeMenu}
                  className="rounded-full bg-leaf-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-leaf-300"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
}
