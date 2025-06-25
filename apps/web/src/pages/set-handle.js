import { useState } from "react";
import { useAuth } from "../components/AuthProvider";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/router";

export default function SetHandle() {
  const { user, profile, setProfile } = useAuth();
  const [handle, setHandle] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  if (!user) {
    if (typeof window !== "undefined") router.push("/login");
    return null;
  }
  if (profile?.handle) {
    if (typeof window !== "undefined") router.push("/");
    return null;
  }

  async function saveHandle(e) {
    e.preventDefault();
    setError("");
    if (!handle.trim().match(/^[a-zA-Z0-9_\-]{3,20}$/)) {
      setError("Handle must be 3-20 characters, letters/numbers/underscore/dash.");
      return;
    }
    setLoading(true);
    const { error, data } = await supabase
      .from("profiles")
      .update({ handle: handle.trim() })
      .eq("id", user.id)
      .select()
      .single();
    setLoading(false);
    if (error) {
      if (error.code === "23505" || error.message.match(/duplicate key/)) {
        setError("Username already taken.");
      } else {
        setError(error.message);
      }
    } else {
      setProfile(data);
      router.push("/");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-flinch/10 to-orange-200">
      <div className="w-full max-w-md bg-white/100 rounded-2xl shadow-2xl p-8 border border-orange-100">
        <div className="flex flex-col items-center mb-8">
          <span className="text-flinch text-5xl mb-2">😶‍🌫️</span>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-1 tracking-tight">Choose your anonymous username</h1>
          <p className="text-gray-500 text-center font-medium">Pick a handle for your confessions</p>
        </div>
        <form onSubmit={saveHandle} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-1" htmlFor="handle">Handle</label>
            <input
              id="handle"
              type="text"
              placeholder="anonymous handle"
              value={handle}
              autoFocus
              onChange={e => setHandle(e.target.value)}
              required
              minLength={3}
              maxLength={20}
              pattern="^[a-zA-Z0-9_\-]{3,20}$"
              className={`w-full border-2 ${handle ? "border-flinch" : "border-gray-400"} focus:border-flinch rounded-lg px-4 py-2.5 bg-white focus:outline-none transition font-medium text-gray-900`}
              disabled={loading}
            />
            <span className="text-xs text-gray-400 block mt-1">
              3-20 characters. Letters, numbers, _ or - only.
            </span>
          </div>
          <button
            type="submit"
            className="w-full bg-flinch text-black bg-orange-400 font-bold py-3 rounded-lg mt-2 shadow-lg hover:bg-orange-500 active:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-flinch/60 transition"
            disabled={loading}
            style={{ opacity: loading ? 0.6 : 1, cursor: loading ? "not-allowed" : "pointer" }}
          >
            {loading ? "Saving..." : "Set Username"}
          </button>
        </form>
        {error && <p className="text-red-600 mt-4 text-center font-semibold">{error}</p>}
      </div>
    </main>
  );
}