import { useTheme } from "../hooks/useTheme";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="glass-card flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/15"
    >
      <span>{theme === "dark" ? "Dark" : "Light"}</span>
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/10">
        {theme === "dark" ? "☾" : "☼"}
      </span>
    </button>
  );
}
