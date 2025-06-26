import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "./AuthProvider";

export default function PostConfessionForm({ onPost }) {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!content.trim()) {
      setError("Confession cannot be empty.");
      return;
    }
    setLoading(true);
    const { error } = await supabase
      .from("posts")
      .insert({
        user_id: user.id,
        content: content.trim(),
      });
    setLoading(false);
    if (error) return setError(error.message);
    setContent("");
    onPost && onPost();
  }

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <div className="rounded-2xl bg-white/80 border border-orange-200 shadow-lg p-3 transition-all">
        <textarea
          className="w-full bg-transparent border-0 focus:ring-0 focus:outline-none text-gray-900 placeholder-gray-400 text-lg resize-none"
          rows={3}
          placeholder="Write your anonymous confession…be careful, it will be public and non-removable!"
          value={content}
          onChange={e => setContent(e.target.value)}
          disabled={loading}
          maxLength={500}
        />
      </div>
      {error && <div className="text-red-500 mt-1 font-semibold">{error}</div>}
      <div className="flex justify-end mt-2">
        <button
          type="submit"
          className="bg-orange-100 hover:bg-orange-200 cursor-pointer text-gray-700 font-bold px-6 py-2.5 rounded-xl transition shadow-lg focus:outline-none focus:ring-2 focus:ring-flinch/50"
          disabled={loading}
        >
          {loading ? "Posting..." : "Post"}
        </button>
      </div>
    </form>
  );
}