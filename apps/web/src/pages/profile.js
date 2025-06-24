import { useAuth } from "../components/AuthProvider";
import RequireAuth from "../components/RequireAuth";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function ProfilePage() {
  const { user, profile } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;

    let ignore = false;
    async function fetchStats() {
      setLoading(true);
      setError(null);
      // Fetch posts written by user
      const { data: posts, error: postsErr } = await supabase
        .from("posts")
        .select("id, vanished, flinch_count")
        .eq("user_id", user.id);

      if (postsErr) {
        setError("Failed to fetch posts.");
        setLoading(false);
        return;
      }
      // Count posts and vanished posts
      const totalPosts = posts.length;
      const vanishedPosts = posts.filter((p) => p.vanished).length;
      const flinchesReceived = posts.reduce((sum, p) => sum + (p.flinch_count || 0), 0);

      // Flinches given
      const { count: flinchesGiven, error: flinchesGivenErr } = await supabase
        .from("flinches")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

      if (flinchesGivenErr) {
        setError("Failed to fetch flinches given.");
        setLoading(false);
        return;
      }

      setStats({
        totalPosts,
        vanishedPosts,
        flinchesReceived,
        flinchesGiven: flinchesGiven || 0,
      });
      setLoading(false);
    }

    fetchStats();
    return () => { ignore = true; };
  }, [user]);

  return (
    <RequireAuth>
      <main className="max-w-xl mx-auto mt-10 px-4">
        <h1 className="text-2xl font-bold text-flinch mb-4">Profile</h1>
        <div className="bg-[#18181b] rounded-xl p-6 shadow space-y-4">
          <div>
            <span className="text-gray-400 font-mono">Handle:</span>{" "}
            <span className="font-bold text-flinch">@{profile?.handle}</span>
          </div>
          <div>
            <span className="text-gray-400 font-mono">Joined:</span>{" "}
            <span>{user?.created_at && new Date(user.created_at).toLocaleDateString()}</span>
          </div>
          <div>
            <span className="text-gray-400 font-mono">Posts written:</span>{" "}
            <span className="font-bold">{stats?.totalPosts ?? "…"}</span>
          </div>
          <div>
            <span className="text-gray-400 font-mono">Posts vanished:</span>{" "}
            <span className="font-bold text-flinch">{stats?.vanishedPosts ?? "…"}</span>
          </div>
          <div>
            <span className="text-gray-400 font-mono">Flinches received:</span>{" "}
            <span className="font-bold">{stats?.flinchesReceived ?? "…"}</span>
          </div>
          <div>
            <span className="text-gray-400 font-mono">Flinches given:</span>{" "}
            <span className="font-bold">{stats?.flinchesGiven ?? "…"}</span>
          </div>
          {error && <div className="text-red-400 mt-2">{error}</div>}
        </div>
      </main>
    </RequireAuth>
  );
}