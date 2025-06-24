import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import RequireAuth from "../components/RequireAuth";
import { useAuth } from "../components/AuthProvider";

export default function Vault() {
  const { user } = useAuth();
  const [vaultPosts, setVaultPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    supabase
      .from("vault")
      .select(`
        id,
        added_at,
        posts (
          id,
          content,
          created_at,
          vanished_at,
          profiles(handle)
        )
      `)
      .eq("user_id", user.id)
      .order("added_at", { ascending: false })
      .then(({ data, error }) => {
        setVaultPosts(data || []);
        setLoading(false);
      });
  }, [user]);

  return (
    <RequireAuth>
      <main className="max-w-xl mx-auto mt-12 px-2">
        <h1 className="text-3xl font-extrabold mb-8 text-white text-center drop-shadow tracking-tight">Your Vault</h1>
        {loading ? (
          <div className="text-center text-gray-400 mt-8">Loading...</div>
        ) : vaultPosts.length === 0 ? (
          <div className="text-center text-gray-400 mt-8">No vanished posts in your vault yet.</div>
        ) : (
          <ul className="space-y-7 mt-6">
            {vaultPosts.map((entry) => (
              <li
                key={entry.id}
                className="bg-gradient-to-br from-[#2a2239] via-[#ffe9d6] to-[#fff8f3] rounded-2xl shadow-lg p-6 flex flex-col gap-2 border-l-4 border-flinch"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-gray-900 text-base tracking-tight flex items-center gap-2">
                    <span className="bg-flinch/10 px-2 py-0.5 rounded text-gray-700 font-mono text-xs">
                      @{entry.posts?.profiles?.handle || "anonymous"}
                    </span>
                  </span>
                  <span className="text-xs text-gray-600 font-mono">
                    {entry.posts?.vanished_at
                      ? "Vanished: " + new Date(entry.posts.vanished_at).toLocaleString()
                      : ""}
                  </span>
                </div>
                <p className="text-lg text-gray-900 break-words whitespace-pre-line leading-relaxed">{entry.posts?.content}</p>
                <div className="text-xs text-gray-700 mt-2">
                  Original: {entry.posts?.created_at ? new Date(entry.posts.created_at).toLocaleString() : ""}
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </RequireAuth>
  );
}