"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { isSupabaseConfigured, getSupabaseClient } from "@/lib/supabase/client";
import { Coffee, Lock, Mail, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";

export default function OwnerLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      const supabase = getSupabaseClient();
      if (!supabase) {
        setErrorMsg("Supabase is not configured. Owner sign-in is unavailable until it is connected.");
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setErrorMsg("Sign-in failed. Check the account details and Supabase Auth configuration.");
        return;
      }

      setIsSuccess(true);
      setTimeout(() => {
        router.push("/dashboard?biz=freco-cafe");
      }, 700);
    } catch {
      setErrorMsg("Authentication could not be completed. Check the Supabase connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-charcoal-950 text-cream-100 flex flex-col justify-center items-center p-4 relative overflow-hidden bg-subtle-grid">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-crimson-600/10 blur-[120px] rounded-full" />

      <div className="relative w-full max-w-md space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-crimson-600/40 bg-crimson-950/60 text-crimson-400 shadow-lg shadow-crimson-950/40 mb-2">
            <Coffee className="h-6 w-6" />
          </div>
          <div className="flex items-center justify-center gap-2">
            <h1 className="font-display text-2xl font-bold tracking-tight text-cream-50">
              CONNECTO Owner Portal
            </h1>
            <span className="rounded bg-crimson-950 px-2 py-0.5 text-[10px] font-mono text-crimson-400 border border-crimson-800/40">
              ログイン
            </span>
          </div>
          <p className="text-xs text-cream-300/70">
            Sign in to manage <strong>FreCo Cafe</strong> (Kandivali East, Mumbai)
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-2xl border border-charcoal-800 bg-charcoal-900/95 p-6 sm:p-8 shadow-2xl backdrop-blur-md space-y-5">
          
          {!isSupabaseConfigured() && (
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-200/90">
              Supabase is not configured. Owner sign-in is disabled until project URL and public anon key are set.
            </div>
          )}

          {errorMsg && (
            <div className="rounded-xl border border-crimson-500/40 bg-crimson-950/40 p-3 text-xs text-crimson-300 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {isSuccess && (
            <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3 text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Login successful! Opening Owner Dashboard...</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase text-cream-300 flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-crimson-400" />
                <span>Owner Email</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Owner email address"
                className="w-full rounded-xl border border-charcoal-700 bg-charcoal-850 px-3.5 py-2.5 text-xs text-cream-100 focus:border-crimson-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase text-cream-300 flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-crimson-400" />
                <span>Password</span>
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-charcoal-700 bg-charcoal-850 px-3.5 py-2.5 text-xs text-cream-100 focus:border-crimson-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || isSuccess || !isSupabaseConfigured()}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-crimson-600 px-4 py-3 text-xs font-semibold text-white shadow-lg shadow-crimson-950 hover:bg-crimson-500 transition-all disabled:opacity-50"
            >
              <span>{isLoading ? "Signing in..." : "Sign In to Dashboard"}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

        </div>

        {/* Navigation link back to public profile */}
        <div className="text-center">
          <a
            href="/b/freco-cafe"
            className="text-xs text-cream-400/70 hover:text-crimson-400 transition-colors"
          >
            ← Back to FreCo Cafe Public Profile
          </a>
        </div>

      </div>
    </div>
  );
}
