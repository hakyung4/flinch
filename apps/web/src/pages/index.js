import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import RequireAuth from "../components/RequireAuth";
import { useAuth } from "../components/AuthProvider";
import PostConfessionForm from "../components/PostConfessionForm";
import Pagination from "../components/Pagination";

const DEFAULT_PAGE_SIZE = 10;

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [totalPosts, setTotalPosts] = useState(0);

  async function fetchTotalPosts() {
    const { count } = await supabase
      .from("posts")
      .select("*", { count: "exact", head: true })
      .eq("is_public", true)
      .eq("vanished", false);
    setTotalPosts(count || 0);
  }

  async function fetchPosts(pageNum = page, pageSizeNum = pageSize) {
    setLoading(true);
    const from = (pageNum - 1) * pageSizeNum;
    const to = from + pageSizeNum - 1;

    const { data, error } = await supabase
      .from("posts")
      .select("id, content, created_at, flinch_count, vanished, profiles(handle)")
      .eq("is_public", true)
      .eq("vanished", false)
      .order("created_at", { ascending: false })
      .range(from, to);

    setLoading(false);
    if (error) {
      setPosts([]);
    } else {
      setPosts(data || []);
    }
  }

  useEffect(() => {
    fetchTotalPosts();
  }, []);

  useEffect(() => {
    fetchPosts(page, pageSize);
    // eslint-disable-next-line
  }, [page, pageSize]);

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
    <RequireAuth>
      <main className="max-w-2xl mx-auto mt-10 px-2">
        <h1 className="text-3xl font-extrabold mb-8 text-gray-600 text-center drop-shadow tracking-tight">
          Confessions Feed
        </h1>
        <div className="mb-8">
          <PostConfessionForm onPost={() => { fetchTotalPosts(); fetchPosts(1, pageSize); setPage(1); }} />
        </div>
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
          <div className="text-center text-gray-400 mt-8">No confessions yet.</div>
        ) : (
          <>
            <ul className="space-y-7 mt-6">
              {posts.map((post) => (
                <ConfessionCard key={post.id} post={post} userId={user.id} />
              ))}
            </ul>
            {totalPages > 1 && (
              <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                loading={loading} // pass loading prop!
              />
            )}
          </>
        )}
      </main>
    </RequireAuth>
  );
}

function ConfessionCard({ post, userId }) {
  const [flinched, setFlinched] = useState(false);

  useEffect(() => {
    let ignore = false;
    async function checkFlinched() {
      const { data } = await supabase
        .from("flinches")
        .select("id")
        .eq("user_id", userId)
        .eq("post_id", post.id)
        .maybeSingle();
      if (!ignore) setFlinched(!!data);
    }
    checkFlinched();
    return () => { ignore = true; };
  }, [post.id, userId]);

  return (
    <li className="relative bg-gradient-to-br from-[#fff8f3] via-[#ffe9d6] to-[#fff8f3] rounded-2xl shadow-lg p-6 flex flex-col gap-2 border border-orange-200">
      <div className="flex items-center justify-between mb-1">
        <span className="font-bold text-gray-900 text-base tracking-tight">
          @{post.profiles?.handle || "anonymous"}
        </span>
        <span className="text-xs text-gray-500 font-mono">
          {new Date(post.created_at).toLocaleString()}
        </span>
      </div>
      <p className="text-lg text-gray-900 break-words whitespace-pre-line leading-relaxed">{post.content}</p>
      <div className="flex items-center gap-4 mt-2">
        <FlinchButton
          postId={post.id}
          initialCount={post.flinch_count}
          userId={userId}
          flinched={flinched}
          setFlinched={setFlinched}
        />
      </div>
      <FlinchStatus flinched={flinched} />
    </li>
  );
}

function FlinchButton({ postId, initialCount, userId, flinched, setFlinched }) {
  const [count, setCount] = useState(initialCount || 0);
  const [loading, setLoading] = useState(false);

  async function handleFlinch() {
    if (loading || flinched) return;
    setLoading(true);
    const { error } = await supabase
      .from("flinches")
      .insert({ user_id: userId, post_id: postId });
    setLoading(false);
    if (!error) {
      setCount((c) => c + 1);
      setFlinched(true);
    }
  }

  return (
    <button
      className={`flex items-center px-5 py-2 rounded-lg text-white font-semibold text-base transition
        ${flinched ? "bg-orange-200 text-orange-500 cursor-not-allowed" : "bg-orange-300 hover:bg-orange-400 cursor-pointer"}
        shadow-md focus:outline-none focus:ring-2 focus:ring-flinch focus:ring-offset-2`}
      onClick={handleFlinch}
      disabled={flinched || loading}
      aria-pressed={flinched}
      aria-label={`Flinch${flinched ? "ed" : ""} this confession`}
    >
      <span className="pr-1 text-lg">💥</span>
      <span>Flinch</span>
      <span className={`ml-2 rounded px-2 py-0.5 font-bold ${
        flinched ? "bg-orange-50 text-orange-600" : "bg-white/80 text-orange-400"
      }`}>
        {count}
      </span>
    </button>
  );
}

function FlinchStatus({ flinched }) {
  if (!flinched) return null;
  return (
    <span className="absolute bottom-3 right-4 text-xs font-semibold bg-orange-50 text-orange-500 px-2 py-0.5 rounded shadow select-none z-10 pointer-events-none">
      You flinched
    </span>
  );
}