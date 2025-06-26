import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../components/AuthProvider";
import PostConfessionForm from "../components/PostConfessionForm";
import Pagination from "../components/Pagination";
import ConfessionCard from "@/components/ConfessionCard";
import { useRouter } from "next/router";
import { needsHandle } from "@flinch/utils";

const DEFAULT_PAGE_SIZE = 10;

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [flinchedSet, setFlinchedSet] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const { user, profile, loading: authLoading, profileLoading } = useAuth();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [totalPosts, setTotalPosts] = useState(0);
  const router = useRouter();
  const [showSigninMsg, setShowSigninMsg] = useState(false);
  const [showHandleMsg, setShowHandleMsg] = useState(false);

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

    // 1. Fetch posts
    const { data: postsData, error } = await supabase
      .from("posts")
      .select("id, content, created_at, flinch_count, vanished, user_id, profiles(handle)")
      .eq("is_public", true)
      .eq("vanished", false)
      .order("created_at", { ascending: false })
      .range(from, to);

    if (!postsData || error) {
      setPosts([]);
      setFlinchedSet(new Set());
      setLoading(false);
      return;
    }
    setPosts(postsData);

    // 2. Fetch flinched post ids for these posts
    if (user?.id && postsData.length > 0) {
      const postIds = postsData.map((post) => post.id);
      const { data: flinches } = await supabase
        .from("flinches")
        .select("post_id")
        .eq("user_id", user.id)
        .in("post_id", postIds);

      const flinchedIds = new Set((flinches || []).map((row) => row.post_id));
      setFlinchedSet(flinchedIds);
    } else {
      setFlinchedSet(new Set());
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchTotalPosts();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    fetchPosts(page, pageSize);
    // eslint-disable-next-line
  }, [page, pageSize, user?.id]);

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
                <ConfessionCard
                  key={post.id}
                  post={post}
                  userId={user?.id}
                  flinched={flinchedSet.has(post.id)}
                  onFlinch={(id) => {
                    setFlinchedSet(prev => new Set(prev).add(id));
                  }}
                />
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
  );
}