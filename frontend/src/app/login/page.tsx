"use client";

import { LogIn } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useAuth } from "@/components/AuthProvider";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(email, password);
      router.push("/problems");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="rounded-md border border-borderline bg-panel p-6 shadow-soft">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">Log in</h1>
          <p className="mt-1 text-sm text-muted">Continue solving with your saved submissions.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium">Email</span>
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              required
              className="focus-ring mt-1 w-full rounded-md border border-borderline bg-surface px-3 py-2"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium">Password</span>
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              minLength={8}
              required
              className="focus-ring mt-1 w-full rounded-md border border-borderline bg-surface px-3 py-2"
            />
          </label>

          {error ? <p className="rounded-md bg-rose-500/10 px-3 py-2 text-sm text-rose-700 dark:text-rose-200">{error}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="focus-ring flex w-full items-center justify-center gap-2 rounded-md bg-teal-600 px-4 py-2 font-semibold text-white hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <LogIn className="h-4 w-4" />
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-muted">
          Need an account?{" "}
          <Link href="/register" className="font-semibold text-teal-700 hover:underline dark:text-teal-300">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
