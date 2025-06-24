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
      <textarea
        className="w-full border border-[#333] bg-[#18181b] rounded-xl p-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-flinch resize-none shadow"
        rows={3}
        placeholder="Write your anonymous confession…"
        value={content}
        onChange={e => setContent(e.target.value)}
        disabled={loading}
        maxLength={500}
      />
      {error && <div className="text-red-400 mt-1">{error}</div>}
      <div className="flex justify-end mt-2">
        <button
          type="submit"
          className="bg-flinch hover:bg-flinch-dark text-white font-bold px-5 py-2 rounded-xl transition shadow"
          disabled={loading}
        >
          {loading ? "Posting..." : "Post"}
        </button>
      </div>
    </form>
  );
}