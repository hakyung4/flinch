import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import Pagination from "@/components/Pagination";
import ConfessionCard from "@/components/ConfessionCard";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";

const DEFAULT_PAGE_SIZE = 10;

export default function UserPostsPage() {
  const router = useRouter();
  const { handle } = router.query;
  const { user, loading: authLoading } = useAuth();
  const [profileId, setProfileId] = useState(null);
  const [posts, setPosts] = useState([]);
  const [totalPosts, setTotalPosts] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [loading, setLoading] = useState(true);
  const [flinchedSet, setFlinchedSet] = useState(new Set());
  const [showSigninMsg, setShowSigninMsg] = useState(false);

  // First, fetch profile id for this handle
  useEffect(() => {
    if (!handle) return;
    async function fetchProfileId() {
      const { data, error } = await supabase
        .from("profiles")
        .select("id")
        .eq("handle", handle)
        .maybeSingle();
      setProfileId(data?.id || null);
    }
    fetchProfileId();
  }, [handle]);

  // Then, fetch total count for this profile
  useEffect(() => {
    if (!profileId) return;
    async function fetchTotal() {
      const { count } = await supabase
        .from("posts")
        .select("*", { count: "exact", head: true })
        .eq("is_public", true)
        .eq("vanished", false)
        .eq("user_id", profileId);
      setTotalPosts(count || 0);
    }
    fetchTotal();
  }, [profileId]);

  // Fetch posts and flinched posts in batch
  useEffect(() => {
    if (!profileId) return;
    async function fetchData() {
      setLoading(true);
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      // Fetch posts for this user
      const { data, error } = await supabase
        .from("posts")
        .select("id, content, created_at, flinch_count, vanished, user_id, profiles(handle)")
        .eq("is_public", true)
        .eq("vanished", false)
        .eq("user_id", profileId)
        .order("created_at", { ascending: false })
        .range(from, to);

      setPosts(error ? [] : data || []);

      // Fetch flinched posts for current user (if logged in)
      if (user?.id && data && data.length > 0) {
        const postIds = data.map((post) => post.id);
        const { data: flinches } = await supabase
          .from("flinches")
          .select("post_id")
          .eq("user_id", user.id)
          .in("post_id", postIds);
        setFlinchedSet(new Set((flinches || []).map((row) => row.post_id)));
      } else {
        setFlinchedSet(new Set());
      }
      setLoading(false);
    }
    fetchData();
    // eslint-disable-next-line
  }, [profileId, page, pageSize, user?.id]);
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

  const totalPages = Math.max(1, Math.ceil(totalPosts / pageSize));

  function handlePageChange(newPage) {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function handlePageSizeChange(e) {
    setPageSize(Number(e.target.value));
    setPage(1);
  }

  return (
      <main className="max-w-2xl mx-auto mt-10 px-2">
        <div className="mb-4 flex items-center gap-2">
          <Link
            href="/"
            className="px-4 py-2 rounded bg-orange-200 hover:bg-orange-300 text-orange-900 font-semibold"
          >
            ← Back to Feed
          </Link>
          <span className="text-gray-500 text-sm">
            Viewing public confessions by <span className="font-bold text-orange-700">@{handle}</span>
          </span>
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
          <div className="text-center text-gray-400 mt-8">No public confessions by this user.</div>
        ) : (
          <>
            <ul className="space-y-7 mt-6">
              {posts.map((post) => (
                <ConfessionCard
                  key={post.id}
                  post={post}
                  userId={user?.id}
                  flinched={flinchedSet.has(post.id)}
                />
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