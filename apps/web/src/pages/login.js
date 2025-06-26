import { useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../lib/supabase";
import { isEmailValid } from "@flinch/utils";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    if (!isEmailValid(email)) return setError("Invalid email.");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);
    if (error) setError(error.message);
    else router.push("/");
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-flinch/10 to-orange-200">
      <div className="w-full max-w-md bg-white/100 rounded-2xl shadow-2xl p-8 border border-orange-100">
        <div className="flex flex-col items-center mb-8">
          <span className="text-flinch text-5xl mb-2">😶‍🌫️</span>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-1 tracking-tight">Welcome Back</h1>
          <p className="text-gray-500 text-center font-medium">Login to your Flinch account</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-5">
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
              placeholder="Your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className={`w-full border-2 ${password ? "border-flinch" : "border-gray-400"} focus:border-flinch rounded-lg px-4 py-2.5 bg-white focus:outline-none transition font-medium text-gray-900`}
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-flinch text-black bg-orange-400 font-bold py-3 rounded-lg mt-2 shadow-lg hover:bg-orange-500 active:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-flinch/60 transition"
            disabled={loading}
            style={{ opacity: loading ? 0.6 : 1, cursor: loading ? "not-allowed" : "pointer" }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        {error && <p className="text-red-600 mt-4 text-center font-semibold">{error}</p>}
        <p className="mt-8 text-center text-gray-700">
          Don&apos;t have an account?{" "}
          <Link className="text-flinch font-semibold hover:underline" href="/signup">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}