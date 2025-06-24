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
      <main className="max-w-xl mx-auto mt-12 px-2">
        <h1 className="text-3xl font-extrabold mb-8 text-white text-center drop-shadow tracking-tight">My Confessions</h1>
        {loading ? (
          <div className="text-center text-gray-400 mt-8">Loading...</div>
        ) : posts.length === 0 ? (
          <div className="text-center text-gray-400 mt-8">You have not posted any confessions yet.</div>
        ) : (
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
        )}
      </main>
    </RequireAuth>
  );
}