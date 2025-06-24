import { useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../lib/supabase";
import { isEmailValid } from "@flinch/utils";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    if (!isEmailValid(email)) return setError("Invalid email.");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) setError(error.message);
    else router.push("/");
  }

  return (
    <main className="max-w-md mx-auto mt-24 bg-white p-8 rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6">Login</h1>
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          autoFocus
          onChange={e => setEmail(e.target.value)}
          required
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
        <button
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded transition"
        >
          Login
        </button>
      </form>
      {error && <p className="text-red-600 mt-2">{error}</p>}
      <p className="mt-4 text-center">
        Don&apos;t have an account?{" "}
        <a className="text-orange-600 hover:underline" href="/signup">
          Sign up
        </a>
      </p>
    </main>
  );
}