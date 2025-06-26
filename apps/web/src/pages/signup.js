import { useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../lib/supabase";
import { isEmailValid } from "@flinch/utils";
import Link from "next/link";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSignup(e) {
    e.preventDefault();
    setError("");
    if (!isEmailValid(email)) return setError("Invalid email.");
    if (password.length < 6) return setError("Password must be at least 6 characters.");
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    setLoading(false);
    if (error) setError(error.message);
    else router.push("/login");
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-flinch/10 to-orange-200">
      <div className="w-full max-w-md bg-white/100 rounded-2xl shadow-2xl p-8 border border-orange-100">
        <div className="flex flex-col items-center mb-8">
          <span className="text-5xl mb-2">😶‍🌫️</span>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-1 tracking-tight">Create Account</h1>
          <p className="text-gray-500 text-center font-medium">Sign up to join Flinch</p>
        </div>
        <form onSubmit={handleSignup} className="space-y-5">
          <div>
            <label className="block text-gray-700 font-semibold mb-1" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Your email"
              value={email}
              autoFocus
              onChange={e => setEmail(e.target.value)}
              required
              className={`w-full border-2 ${email ? "border-flinch" : "border-gray-400"} focus:border-flinch rounded-lg px-4 py-2.5 bg-white focus:outline-none transition font-medium text-gray-900`}
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Min 6 characters (letters and numbers)"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
              className={`w-full border-2 ${password ? "border-flinch" : "border-gray-400"} focus:border-flinch rounded-lg px-4 py-2.5 bg-white focus:outline-none transition font-medium text-gray-900`}
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            className="w-full text-black bg-orange-400 font-bold py-3 rounded-lg mt-2 shadow-lg hover:bg-orange-500 active:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-flinch/60 transition"
            disabled={loading}
            style={{ opacity: loading ? 0.6 : 1, cursor: loading ? "not-allowed" : "pointer" }}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>
        <p className="mt-3 text-xs text-gray-500 text-center">
          By signing up, you agree to our{" "}
          <Link href="/terms" className="underline hover:text-gray-400 font-semibold">Terms of Service</Link>
          {" "}and{" "}
          <Link href="/privacy" className="underline hover:text-gray-400 font-semibold">Privacy Policy</Link>.
        </p>
        {error && <p className="text-red-600 mt-4 text-center font-semibold">{error}</p>}
        <p className="mt-8 text-center text-gray-700">
          Already have an account?{" "}
          <Link className="font-semibold hover:underline" href="/login">
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}