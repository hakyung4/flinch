import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../components/AuthProvider";
import { useRouter } from "next/router";
import { needsHandle } from "@flinch/utils";

const medalColors = [
  "bg-gradient-to-r from-yellow-400 to-yellow-200 text-yellow-900",
  "bg-gradient-to-r from-gray-300 to-gray-100 text-gray-700",
  "bg-gradient-to-r from-orange-400 to-yellow-100 text-orange-800",
];

export default function Leaderboard() {
  const { user, profile, loading:authLoading, profileLoading } = useAuth();
  const [top, setTop] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const [showSigninMsg, setShowSigninMsg] = useState(false);
  const [showHandleMsg, setShowHandleMsg] = useState(false);
  
  useEffect(() => {
    let ignore = false;
    async function fetchLeaderboard() {
      setLoading(true);
      setError(null);
      // Fetch top authors by flinches received in the last 24h using the correct RPC
      const { data, error } = await supabase.rpc("top_flinched_authors_daily");
      if (error) {
        setError("Error loading leaderboard.");
        setLoading(false);
        return;
      }
      if (!ignore) setTop(data || []);
      setLoading(false);
    }
    fetchLeaderboard();
    return () => { ignore = true; };
  }, []);

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
      <h1 className="text-3xl font-extrabold text-gray-600 mb-7 text-center tracking-tight flex items-center justify-center gap-2 drop-shadow">
        🏆 Top Flinched Authors (Every 24h)
      </h1>
      <div className="bg-gradient-to-br from-white via-[#ffe9d6] to-[#fff8f3] rounded-2xl p-7 shadow-xl space-y-4 border-t-8 border-flinch">
        {error && <div className="text-red-500 mb-3 font-semibold">{error}</div>}
        {loading ? (
          <div className="text-center text-gray-500">Loading…</div>
        ) : (
          <ol className="space-y-3">
            {top.length === 0 && <li>No flinches in the last 24 hours.</li>}
            {top.map((row, idx) => (
              <li
                key={row.user_id}
                className={`
                  flex items-center justify-between p-4 rounded-lg shadow
                  ${idx < 3 ? medalColors[idx] : "bg-white"}
                `}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-extrabold">{idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : `#${idx + 1}`}</span>
                  <span className="font-bold text-lg">
                    @{row.handle || "unknown"}
                  </span>
                  {profile?.id === row.user_id && (
                    <span className="ml-2 text-xs font-medium text-orange-600 bg-orange-100 rounded px-2 py-0.5">
                      (You)
                    </span>
                  )}
                </div>
                <span className="text-lg font-semibold text-orange-600">
                  💥 {row.flinches_received}
                </span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </main>
  );
}