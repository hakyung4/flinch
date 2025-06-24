import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import Link from "next/link";
import { useAuth } from "../components/AuthProvider";

export default function Leaderboard() {
  const { profile } = useAuth();
  const [top, setTop] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  return (
    <main className="max-w-xl mx-auto mt-10 px-4">
      <h1 className="text-2xl font-bold text-flinch mb-4">Top Flinched Authors (24h)</h1>
      <div className="bg-[#18181b] rounded-xl p-6 shadow space-y-4">
        {error && <div className="text-red-400 mb-3">{error}</div>}
        {loading ? (
          <div>Loading…</div>
        ) : (
          <>
            <ol className="list-decimal pl-6">
              {top.length === 0 && <li>No flinches in the last 24 hours.</li>}
              {top.map((row, idx) => (
                <li key={row.user_id} className="mb-2">
                  <span className="font-bold text-flinch">
                    @{row.handle || "unknown"}
                  </span>
                  {profile?.id === row.user_id && <span className="ml-2 text-xs text-white/70">(You)</span>}
                  <span className="ml-4 text-gray-400">
                    Flinches received: {row.flinches_received}
                  </span>
                </li>
              ))}
            </ol>
          </>
        )}
      </div>
    </main>
  );
}