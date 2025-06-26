import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "./AuthProvider";

export default function PostConfessionForm({ onPost }) {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  async function actuallyPost() {
    setLoading(true);
    setError("");
    const { error } = await supabase
      .from("posts")
      .insert({
        user_id: user.id,
        content: content.trim(),
      });
    setLoading(false);
    if (error) return setError(error.message);
    setContent("");
    setShowConfirm(false);
    onPost && onPost();
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!content.trim()) {
      setError("Confession cannot be empty.");
      return;
    }
    setShowConfirm(true);
  }

  function handleCancel() {
    setShowConfirm(false);
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
          disabled={loading || showConfirm}
          maxLength={500}
        />
      </div>
      {error && <div className="text-red-500 mt-1 font-semibold">{error}</div>}
      <div className="flex justify-end mt-2">
        <button
          type="submit"
          className="bg-orange-300 hover:bg-orange-400 cursor-pointer text-gray-700 hover:text-white font-bold px-6 py-2.5 rounded-xl transition shadow-lg focus:outline-none focus:ring-2 focus:ring-flinch/50"
          disabled={loading || showConfirm}
        >
          {loading ? "Posting..." : "Post"}
        </button>
      </div>
      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-xs w-full">
            <p className="mb-4 text-center text-gray-800">
              Are you sure you want to post this confession?<br />
              <span className="text-red-500 font-semibold">
                Once posted, it cannot be removed.
              </span>
            </p>
            <div className="flex gap-3 justify-center">
              <button
                className="bg-orange-400 hover:bg-orange-500 text-white px-4 py-2 rounded font-bold cursor-pointer"
                disabled={loading}
                onClick={actuallyPost}
                type="button"
              >
                {loading ? "Posting..." : "Yes, Post"}
              </button>
              <button
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded font-bold cursor-pointer"
                disabled={loading}
                onClick={handleCancel}
                type="button"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}