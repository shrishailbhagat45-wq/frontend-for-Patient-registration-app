import { useState } from "react";
import { FiMoon, FiSun } from "react-icons/fi";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains("dark"),
  );

  const toggleTheme = () => {
    const nextIsDark = !isDark;
    localStorage.setItem("theme", nextIsDark ? "dark" : "light");
    document.documentElement.classList.toggle("dark", nextIsDark);
    setIsDark(nextIsDark);
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="rounded-full p-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      {isDark ? <FiSun aria-hidden="true" /> : <FiMoon aria-hidden="true" />}
    </button>
  );
}
