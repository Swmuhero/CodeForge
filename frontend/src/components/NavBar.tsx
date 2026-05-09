"use client";

import { Code2, LogOut, Moon, Sun, UserRound } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "./AuthProvider";
import { useTheme } from "./ThemeProvider";

function navClass(active: boolean) {
  return [
    "rounded-md px-3 py-2 text-sm font-medium transition",
    active
      ? "bg-teal-500/10 text-teal-700 dark:text-teal-300"
      : "text-muted hover:bg-black/5 hover:text-ink dark:hover:bg-white/10"
  ].join(" ");
}

export function NavBar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 border-b border-borderline/80 bg-panel/85 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/problems" className="flex items-center gap-2 text-base font-semibold">
          <span className="grid h-9 w-9 place-items-center rounded-md bg-teal-600 text-white">
            <Code2 className="h-5 w-5" aria-hidden="true" />
          </span>
          <span>CodeForge</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <Link href="/problems" className={navClass(pathname.startsWith("/problems"))}>
            Problems
          </Link>
          {user ? (
            <Link href="/profile" className={navClass(pathname === "/profile")}>
              Profile
            </Link>
          ) : null}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            className="focus-ring grid h-10 w-10 place-items-center rounded-md border border-borderline bg-panel text-muted hover:text-ink"
            aria-label="Toggle theme"
            title="Toggle theme"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {user ? (
            <>
              <Link
                href="/profile"
                className="focus-ring hidden items-center gap-2 rounded-md border border-borderline bg-panel px-3 py-2 text-sm font-medium sm:flex"
              >
                <UserRound className="h-4 w-4" />
                {user.name}
              </Link>
              <button
                type="button"
                onClick={logout}
                className="focus-ring grid h-10 w-10 place-items-center rounded-md border border-borderline bg-panel text-muted hover:text-ink"
                aria-label="Logout"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login" className="focus-ring rounded-md px-3 py-2 text-sm font-medium text-muted hover:text-ink">
                Login
              </Link>
              <Link
                href="/register"
                className="focus-ring rounded-md bg-teal-600 px-3 py-2 text-sm font-semibold text-white hover:bg-teal-700"
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
