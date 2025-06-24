import { useState } from "react";
import { useAuth } from "../components/AuthProvider";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/router";

export default function SetHandle() {
  const { user, profile, setProfile } = useAuth();
  const [handle, setHandle] = useState("");
  const [error, setError] = useState("");
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
    const { error, data } = await supabase
      .from("profiles")
      .update({ handle: handle.trim() })
      .eq("id", user.id)
      .select()
      .single();
    if (error) {
      if (error.code === "23505" || error.message.match(/duplicate key/)) {
        setError("Handle already taken.");
      } else {
        setError(error.message);
      }
    } else {
      setProfile(data);
      router.push("/");
    }
  }

  return (
    <main className="max-w-md mx-auto mt-24 bg-white p-8 rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6">Choose your anonymous username</h1>
      <form onSubmit={saveHandle} className="space-y-4">
        <input
          type="text"
          placeholder="anonymous handle"
          value={handle}
          autoFocus
          onChange={e => setHandle(e.target.value)}
          required
          minLength={3}
          maxLength={20}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
        <button
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded transition"
        >
          Set Username
        </button>
      </form>
      {error && <p className="text-red-600 mt-2">{error}</p>}
    </main>
  );
}