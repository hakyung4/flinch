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
      const { data: posts, error: postsErr } = await supabase
        .from("posts")
        .select("id, vanished, flinch_count")
        .eq("user_id", user.id);

      if (postsErr) {
        setError("Failed to fetch posts.");
        setLoading(false);
        return;
      }
      const totalPosts = posts.length;
      const vanishedPosts = posts.filter((p) => p.vanished).length;
      const flinchesReceived = posts.reduce((sum, p) => sum + (p.flinch_count || 0), 0);

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
      <main className="max-w-xl mx-auto mt-12 px-4">
        <h1 className="text-3xl font-extrabold text-white mb-7 text-center tracking-tight drop-shadow">Profile</h1>
        <div className="relative bg-gradient-to-br from-[#fff8f3] via-[#ffe9d6] to-[#fff8f3] rounded-2xl p-8 shadow-xl space-y-7 border-l-8 border-flinch">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center text-3xl font-bold text-gray-600 border-2 border-flinch">
              {profile?.handle ? profile.handle[0].toUpperCase() : "?"}
            </div>
            <div>
              <span className="font-bold text-gray-700 text-lg flex items-center gap-2">
                @{profile?.handle}
                <span className="bg-flinch/10 text-flinch text-xs font-semibold px-2 py-0.5 rounded-full">You</span>
              </span>
              <div className="text-xs text-gray-700 font-mono">Joined {user?.created_at && new Date(user.created_at).toLocaleDateString()}</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <ProfileStat label="Posts written" value={stats?.totalPosts ?? "…"} icon="✍️" />
            <ProfileStat label="Posts vanished" value={stats?.vanishedPosts ?? "…"} icon="🌫️" color="text-flinch" />
            <ProfileStat label="Flinches received" value={stats?.flinchesReceived ?? "…"} icon="💥" color="text-orange-500" />
            <ProfileStat label="Flinches given" value={stats?.flinchesGiven ?? "…"} icon="👏" color="text-orange-500" />
          </div>
          {error && <div className="text-red-500 mt-2 font-semibold">{error}</div>}
        </div>
      </main>
    </RequireAuth>
  );
}

function ProfileStat({ label, value, icon, color }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-white/70 shadow-inner min-w-0">
      <span className={`text-xl ${color || "text-gray-800"}`}>{icon}</span>
      <div className="flex flex-col min-w-0">
        <span className="font-bold text-lg text-gray-900 truncate">{value}</span>
        <span className="text-xs text-gray-600">{label}</span>
      </div>
    </div>
  );
}