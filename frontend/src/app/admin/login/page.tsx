"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { adminApi } from "@/lib/api";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [sessionMsg, setSessionMsg] = useState("");

  useEffect(() => {
    const msg = localStorage.getItem("sessionMessage");
    if (msg) {
      setSessionMsg(msg);
      localStorage.removeItem("sessionMessage");
    }
    const token = localStorage.getItem("adminToken");
    if (token) {
      router.replace("/admin");
    }
  }, [router]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setSessionMsg("");
    const form = event.currentTarget;
    const data = new FormData(form);
    const username = String(data.get("username"));
    const password = String(data.get("password"));

    try {
      const response = await adminApi.login({ username, password, rememberMe });
      localStorage.setItem("adminToken", response.token);
      localStorage.setItem("adminRefreshToken", response.refreshToken);
      localStorage.setItem("adminUser", JSON.stringify(response.admin));
      router.replace("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#f8fafc] to-[#eef2ff] p-4">
      <div className="w-full rounded-2xl bg-white px-8 py-10 shadow-[0_10px_30px_rgba(0,0,0,0.08)] sm:max-w-[480px]">
        <div className="mx-auto grid h-20 w-20 place-items-center overflow-hidden rounded-full bg-white shadow-md">
          <img src="/gsr-logo.png" alt="GSR logo" className="h-16 w-16 object-contain" />
        </div>
        <h1 className="mt-6 text-center font-display text-3xl font-semibold text-[#08172f]">Admin Login</h1>

        {sessionMsg && (
          <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-center text-sm font-semibold text-amber-800">
            {sessionMsg}
          </div>
        )}

        <form onSubmit={submit} className="mt-8 grid gap-4">
          <input
            className="focus-ring w-full rounded-xl border border-slate-200 bg-[#f8fafc] px-4 py-3.5 text-sm text-[#08172f] placeholder:text-slate-400 focus:border-[#d6a842] focus:outline-none focus:ring-2 focus:ring-[#d6a842]/20"
            name="username"
            placeholder="Username"
            required
          />
          <input
            className="focus-ring w-full rounded-xl border border-slate-200 bg-[#f8fafc] px-4 py-3.5 text-sm text-[#08172f] placeholder:text-slate-400 focus:border-[#d6a842] focus:outline-none focus:ring-2 focus:ring-[#d6a842]/20"
            name="password"
            placeholder="Password"
            type="password"
            required
          />
          <label className="flex items-center gap-2 text-sm text-slate-500">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-[#d6a842] focus:ring-[#d6a842]/30"
            />
            Remember Me
          </label>
          <button
            disabled={busy}
            className="w-full rounded-xl bg-[#d6a842] px-5 py-3.5 font-semibold text-white transition hover:bg-[#c49a35] disabled:opacity-60"
          >
            {busy ? "Signing in..." : "Sign In"}
          </button>
          {error ? (
            <p className="text-center text-sm font-medium text-red-600">{error}</p>
          ) : null}
        </form>
      </div>
    </div>
  );
}
