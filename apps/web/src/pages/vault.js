import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import RequireAuth from "../components/RequireAuth";
import { useAuth } from "../components/AuthProvider";
import Pagination from "../components/Pagination";

const DEFAULT_PAGE_SIZE = 10;

export default function Vault() {
  const { user } = useAuth();
  const [vaultPosts, setVaultPosts] = useState([]);
  const [totalVaultPosts, setTotalVaultPosts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  async function fetchTotalVaultPosts() {
    if (!user) return;
    const { count } = await supabase
      .from("vault")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);
    setTotalVaultPosts(count || 0);
  }

  async function fetchVaultPosts(pageNum = page, pageSizeNum = pageSize) {
    if (!user) return;
    setLoading(true);
    const from = (pageNum - 1) * pageSizeNum;
    const to = from + pageSizeNum - 1;

    const { data, error } = await supabase
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
      .range(from, to);

    setVaultPosts(error ? [] : data || []);
    setLoading(false);
  }

  useEffect(() => {
    fetchTotalVaultPosts();
    // eslint-disable-next-line
  }, [user]);

  useEffect(() => {
    fetchVaultPosts(page, pageSize);
    // eslint-disable-next-line
  }, [user, page, pageSize]);

  function handlePageChange(newPage) {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handlePageSizeChange(e) {
    setPageSize(Number(e.target.value));
    setPage(1);
  }

  const totalPages = Math.max(1, Math.ceil(totalVaultPosts / pageSize));

  return (
    <RequireAuth>
      <main className="max-w-xl mx-auto mt-12 px-2">
        <h1 className="text-3xl font-extrabold mb-8 text-gray-600 text-center drop-shadow tracking-tight">Your Vault</h1>
        <div className="flex items-center gap-3 mb-4">
          <label htmlFor="page-size" className="font-semibold text-gray-700">Posts per page:</label>
          <select
            id="page-size"
            value={pageSize}
            onChange={handlePageSizeChange}
            className="border rounded px-2 py-1 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-200"
          >
            {[...Array(10)].map((_, i) => (
              <option key={i+1} value={i+1}>{i+1}</option>
            ))}
          </select>
        </div>
        {loading ? (
          <div className="text-center text-gray-400 mt-8">Loading...</div>
        ) : vaultPosts.length === 0 ? (
          <div className="text-center text-gray-400 mt-8">No vanished posts in your vault yet.</div>
        ) : (
          <>
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
            {totalPages > 1 && (
              <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                loading={loading}
              />
            )}
          </>
        )}
      </main>
    </RequireAuth>
  );
}