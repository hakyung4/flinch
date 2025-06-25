import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../components/AuthProvider";
import Pagination from "../components/Pagination";
import { useRouter } from "next/router";

const DEFAULT_PAGE_SIZE = 10;

export default function MyPosts() {
  const { user, loading: authLoading } = useAuth();
  const [posts, setPosts] = useState([]);
  const [totalPosts, setTotalPosts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const router = useRouter();
  const [showSigninMsg, setShowSigninMsg] = useState(false);

  async function fetchTotalPosts() {
    if (!user) return;
    const { count } = await supabase
      .from("posts")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);
    setTotalPosts(count || 0);
  }

  async function fetchPosts(pageNum = page, pageSizeNum = pageSize) {
    if (!user) return;
    setLoading(true);
    const from = (pageNum - 1) * pageSizeNum;
    const to = from + pageSizeNum - 1;

    const { data, error } = await supabase
      .from("posts")
      .select("id, content, created_at, vanished, vanished_at, flinch_count, flinch_threshold")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .range(from, to);

    setPosts(error ? [] : data || []);
    setLoading(false);
  }

  useEffect(() => {
    fetchTotalPosts();
    // eslint-disable-next-line
  }, [user]);

  useEffect(() => {
    fetchPosts(page, pageSize);
    // eslint-disable-next-line
  }, [user, page, pageSize]);

  useEffect(() => {
    if (!authLoading && !user) {
      setShowSigninMsg(true);
      setTimeout(() => {
        router.replace("/login");
      }, 1500); // Show message for 1.5s before redirecting
    }
  }, [user, authLoading, router]);

  if (authLoading) {
    return (
      <main className="max-w-2xl mx-auto mt-10 px-2">
        <div className="text-center text-gray-400 mt-8">Loading...</div>
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

  function handlePageChange(newPage) {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handlePageSizeChange(e) {
    setPageSize(Number(e.target.value));
    setPage(1);
  }

  const totalPages = Math.max(1, Math.ceil(totalPosts / pageSize));

  return (
      <main className="max-w-xl mx-auto mt-12 px-2">
        <h1 className="text-3xl font-extrabold mb-8 text-gray-600 text-center drop-shadow tracking-tight">My Confessions</h1>
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
        ) : posts.length === 0 ? (
          <div className="text-center text-gray-400 mt-8">You have not posted any confessions yet.</div>
        ) : (
          <>
            <ul className="space-y-7 mt-6">
              {posts.map((post) => (
                <li
                  key={post.id}
                  className={`rounded-2xl shadow-lg p-6 flex flex-col gap-2 border ${
                    post.vanished
                      ? "bg-gradient-to-br from-[#2a2239] via-orange-100 to-[#fff8f3] border-flinch/50 opacity-90"
                      : "bg-gradient-to-br from-[#fff8f3] via-[#ffe9d6] to-[#fff8f3] border-orange-200"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-xs text-gray-500">
                      {new Date(post.created_at).toLocaleString()}
                    </span>
                    {post.vanished ? (
                      <span className="bg-flinch/25 text-gray-700 px-2 py-0.5 rounded text-xs font-bold">
                        Vanished
                      </span>
                    ) : (
                      <span className="bg-flinch/20 text-gray-700 px-2 py-0.5 rounded text-xs font-bold">
                        Public
                      </span>
                    )}
                  </div>
                  <p className={`text-lg break-words whitespace-pre-line leading-relaxed ${
                    post.vanished ? "text-gray-200" : "text-gray-900"
                  }`}>
                    {post.content}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 mt-2 text-xs">
                    <span className="flex items-center gap-1">
                      <span className="text-gray-600">Flinches:</span>
                      <span className="text-gray-700">{post.flinch_count}</span>
                      <span className="text-gray-700">/</span>
                      <span className="text-gray-800">{post.flinch_threshold}</span>
                    </span>
                    {post.vanished && post.vanished_at && (
                      <span className="text-gray-500 ml-4">
                        Vanished at {new Date(post.vanished_at).toLocaleString()}
                      </span>
                    )}
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
  );
}