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
      <main className="max-w-2xl mx-auto mt-10 px-2">
        <h1 className="text-3xl font-extrabold mb-8 text-white text-center drop-shadow tracking-tight">Confessions Feed</h1>
        <div className="mb-8">
          <PostConfessionForm onPost={fetchPosts} />
        </div>
        {loading ? (
          <div className="text-center text-gray-400 mt-8">Loading...</div>
        ) : posts.length === 0 ? (
          <div className="text-center text-gray-400 mt-8">No confessions yet.</div>
        ) : (
          <ul className="space-y-7 mt-6">
            {posts.map((post) => (
              <li
                key={post.id}
                className="bg-gradient-to-br from-[#fff8f3] via-[#ffe9d6] to-[#fff8f3] rounded-2xl shadow-lg p-6 flex flex-col gap-2 border border-orange-200"
              >
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