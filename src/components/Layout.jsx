import React from "react";
import { Sun, Moon, Home, GitCompare, HelpCircle } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

const NAV = [
  { id: "home", label: "Home", icon: Home },
  { id: "comparative", label: "Comparative analysis", icon: GitCompare },
  { id: "faqs", label: "FAQs", icon: HelpCircle },
];

export default function Layout({ currentPage, onNavigate, children }) {
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <div className={isDarkMode ? "dark" : ""}>
      <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-gray-900 dark:text-gray-100 flex">
        <aside className="w-56 shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800">
            <h2 className="text-lg font-semibold text-emerald-700 dark:text-emerald-400 tracking-tight">Phenoflow</h2>
          </div>
          <nav className="p-2 flex-1">
            {NAV.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => onNavigate(id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left font-medium transition ${
                  currentPage === id
                    ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {label}
              </button>
            ))}
          </nav>
          <div className="p-2 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={toggleDarkMode}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition font-medium"
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              {isDarkMode ? "Light mode" : "Dark mode"}
            </button>
          </div>
        </aside>
        <main className="flex-1 min-w-0 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
