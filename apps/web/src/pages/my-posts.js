import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import RequireAuth from "../components/RequireAuth";
import { useAuth } from "../components/AuthProvider";

export default function MyPosts() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    supabase
      .from("posts")
      .select("id, content, created_at, vanished, vanished_at, flinch_count, flinch_threshold")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        setPosts(data || []);
        setLoading(false);
      });
  }, [user]);

  return (
    <RequireAuth>
      <main className="max-w-xl mx-auto mt-8 px-2">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-flinch">My Confessions</h1>
        {loading ? (
          <div className="text-center text-gray-400 mt-8">Loading...</div>
        ) : posts.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">You have not posted any confessions yet.</div>
        ) : (
          <ul className="space-y-6 mt-8">
            {posts.map((post) => (
              <li
                key={post.id}
                className={`rounded-xl shadow p-5 flex flex-col gap-2 border ${
                  post.vanished
                    ? "bg-[#2a2239] border-flinch/40 opacity-80"
                    : "bg-[#18181b] border-[#222]"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-xs text-gray-400">
                    {new Date(post.created_at).toLocaleString()}
                  </span>
                  {post.vanished ? (
                    <span className="bg-flinch/25 text-flinch px-2 py-0.5 rounded text-xs font-bold">
                      Vanished
                    </span>
                  ) : (
                    <span className="bg-flinch/20 text-flinch px-2 py-0.5 rounded text-xs font-bold">
                      Public
                    </span>
                  )}
                </div>
                <p className="text-lg text-gray-100 break-words whitespace-pre-line">{post.content}</p>
                <div className="flex items-center gap-4 mt-2 text-xs">
                  <span>
                    Flinches:{" "}
                    <span className="font-bold text-flinch">{post.flinch_count}</span> /{" "}
                    <span className="text-gray-400">{post.flinch_threshold}</span>
                  </span>
                  {post.vanished && post.vanished_at && (
                    <span className="text-gray-500 ml-4">Vanished at {new Date(post.vanished_at).toLocaleString()}</span>
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