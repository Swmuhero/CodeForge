"use client";

import { UserPlus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useAuth } from "@/components/AuthProvider";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      await register(name, email, password);
      router.push("/problems");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="rounded-md border border-borderline bg-panel p-6 shadow-soft">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">Create account</h1>
          <p className="mt-1 text-sm text-muted">Track solved problems, attempts, and verdicts.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium">Name</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              minLength={2}
              className="focus-ring mt-1 w-full rounded-md border border-borderline bg-surface px-3 py-2"
            />
          </label>

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
            <UserPlus className="h-4 w-4" />
            {loading ? "Creating..." : "Create account"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-muted">
          Already registered?{" "}
          <Link href="/login" className="font-semibold text-teal-700 hover:underline dark:text-teal-300">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
