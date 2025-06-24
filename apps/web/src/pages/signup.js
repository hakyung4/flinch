import { useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../lib/supabase";
import { isEmailValid } from "@flinch/utils";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSignup(e) {
    e.preventDefault();
    setError("");
    if (!isEmailValid(email)) return setError("Invalid email.");

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) setError(error.message);
    else router.push("/login");
  }

  return (
    <main className="max-w-md mx-auto mt-24 bg-white p-8 rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6">Sign Up</h1>
      <form onSubmit={handleSignup} className="space-y-4">
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
          minLength={6}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
        <button
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded transition"
        >
          Sign Up
        </button>
      </form>
      {error && <p className="text-red-600 mt-2">{error}</p>}
      <p className="mt-4 text-center">
        Already have an account?{" "}
        <a className="text-orange-600 hover:underline" href="/login">
          Login
        </a>
      </p>
    </main>
  );
}