import { useAuth } from "../components/AuthProvider";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/router";
import { needsHandle } from "@flinch/utils";

export default function ProfilePage() {
  const { user, profile, loading:authLoading, profileLoading } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const [showSigninMsg, setShowSigninMsg] = useState(false);
  const [showHandleMsg, setShowHandleMsg] = useState(false);

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

  useEffect(() => {
    if (!authLoading && !user) {
      setShowSigninMsg(true);
      setTimeout(() => {
        router.replace("/login");
      }, 1500); // Show message for 1.5s before redirecting
    }
  }, [user, authLoading, router]);

  useEffect(() => {
  if (!authLoading && !profileLoading) {
    if (!user) {
      setShowSigninMsg(true);
      setTimeout(() => router.replace("/login"), 1500);
    } else if (needsHandle(profile)) {
      setShowHandleMsg(true);
      setTimeout(() => router.replace("/set-handle"), 1500);
    }
    }
  }, [user, profile, authLoading, profileLoading, router]);

  if (authLoading || profileLoading) {
    return (
      <main className="max-w-2xl mx-auto mt-10 px-2">
        <div className="text-center text-gray-400 mt-8">Loading...</div>
      </main>
    );
  }

    if (showHandleMsg) {
    return (
      <main className="max-w-2xl mx-auto mt-10 px-2">
        <div className="text-center text-orange-600 mt-8 font-semibold text-lg">
          Please set a username to continue. Redirecting…
        </div>
      </main>
    );
  }

  // If not signed in, show sign-in required message
  if (showSigninMsg) {
    return (
      <main className="max-w-2xl mx-auto mt-10 px-2">
        <div className="text-center text-orange-600 mt-8 font-semibold text-lg">
          You need to be signed in to view this page. Redirecting to login…
        </div>
      </main>
    );
  }

  return (
      <main className="max-w-xl mx-auto mt-12 px-4">
        <h1 className="text-3xl font-extrabold text-gray-600 mb-7 text-center tracking-tight drop-shadow">Profile</h1>
        <div className="relative bg-gradient-to-br from-[#fff8f3] via-[#ffe9d6] to-[#fff8f3] rounded-2xl p-8 shadow-xl space-y-7 border-l-8 border-flinch">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center text-3xl font-bold text-gray-600 border-2 border-flinch">
              {profile?.handle ? profile.handle[0].toUpperCase() : "?"}
            </div>
            <div>
              <span className="font-bold text-gray-700 text-lg flex items-center gap-2">
                @{profile?.handle}
                <span className="bg-orange-200 text-xs font-semibold px-2 py-0.5 rounded-full">You</span>
              </span>
              <div className="text-xs text-gray-700 font-mono">Joined {user?.created_at && new Date(user.created_at).toLocaleDateString()}</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <ProfileStat label="Posts written" value={stats?.totalPosts ?? "…"} icon="✍️" />
            <ProfileStat label="Posts vanished" value={stats?.vanishedPosts ?? "…"} icon="🌫️" />
            <ProfileStat label="Flinches received" value={stats?.flinchesReceived ?? "…"} icon="💥" color="text-orange-500" />
            <ProfileStat label="Flinches given" value={stats?.flinchesGiven ?? "…"} icon="👏" color="text-orange-500" />
          </div>
          {error && <div className="text-red-500 mt-2 font-semibold">{error}</div>}
        </div>
      </main>
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