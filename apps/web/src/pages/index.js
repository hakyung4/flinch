import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import RequireAuth from "../components/RequireAuth";
import { useAuth } from "../components/AuthProvider";
import PostConfessionForm from "../components/PostConfessionForm";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  async function fetchPosts() {
    setLoading(true);
    const { data, error } = await supabase
      .from("posts")
      .select("id, content, created_at, flinch_count, vanished, profiles(handle)")
      .eq("is_public", true)
      .eq("vanished", false)  
      .order("created_at", { ascending: false });
    setLoading(false);
    if (error) return setPosts([]);
    setPosts(data || []);
  }

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <RequireAuth>
      <main className="max-w-xl mx-auto mt-8 px-2">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-flinch">Confessions Feed</h1>
        <PostConfessionForm onPost={fetchPosts} />
        {loading ? (
          <div className="text-center text-gray-400 mt-8">Loading...</div>
        ) : posts.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">No confessions yet.</div>
        ) : (
          <ul className="space-y-6 mt-8">
            {posts.map((post) => (
              <li key={post.id} className="bg-[#18181b] rounded-xl shadow p-5 flex flex-col gap-2 border border-[#222]">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-flinch">@{post.profiles?.handle || "anonymous"}</span>
                  <span className="text-xs text-gray-500">
                    {new Date(post.created_at).toLocaleString()}
                  </span>
                </div>
                <p className="text-lg text-gray-100 break-words whitespace-pre-line">{post.content}</p>
                <div className="flex items-center gap-4 mt-2">
                  {user && (
                    <FlinchButton postId={post.id} initialCount={post.flinch_count} userId={user.id} />
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </RequireAuth>
  );
}

function FlinchButton({ postId, initialCount, userId }) {
  const [count, setCount] = useState(initialCount || 0);
  const [flinched, setFlinched] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function checkFlinched() {
      const { data } = await supabase
        .from("flinches")
        .select("id")
        .eq("user_id", userId)
        .eq("post_id", postId)
        .maybeSingle();
      setFlinched(!!data);
    }
    checkFlinched();
  }, [postId, userId]);

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
      className={`flex items-center px-4 py-1.5 rounded text-white font-semibold transition text-base
        ${flinched ? "bg-flinch/40 cursor-not-allowed" : "bg-flinch hover:bg-flinch-dark"}
        shadow focus:outline-none focus:ring-2 focus:ring-flinch focus:ring-offset-2`}
      onClick={handleFlinch}
      disabled={flinched || loading}
    >
      <span className="pr-1">💥</span>
      <span>Flinch</span>
      <span className="ml-2">{count}</span>
    </button>
  );
}