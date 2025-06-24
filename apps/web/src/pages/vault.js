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
    // Get all vanished posts this user flinched (from vault table)
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
      <main className="max-w-xl mx-auto mt-8 px-2">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-flinch">Your Vault</h1>
        {loading ? (
          <div className="text-center text-gray-400 mt-8">Loading...</div>
        ) : vaultPosts.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">No vanished posts in your vault yet.</div>
        ) : (
          <ul className="space-y-6 mt-8">
            {vaultPosts.map((entry) => (
              <li key={entry.id} className="bg-[#18181b] rounded-xl shadow p-5 flex flex-col gap-2 border border-[#222]">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-flinch">
                    @{entry.posts?.profiles?.handle || "anonymous"}
                  </span>
                  <span className="text-xs text-gray-500">
                    {entry.posts?.vanished_at
                      ? "Vanished: " + new Date(entry.posts.vanished_at).toLocaleString()
                      : ""}
                  </span>
                </div>
                <p className="text-lg text-gray-100 break-words whitespace-pre-line">{entry.posts?.content}</p>
                <div className="text-xs text-gray-500 mt-2">
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