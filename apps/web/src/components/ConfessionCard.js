import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import Link from "next/link";

export default function ConfessionCard({ post, userId, flinched, onFlinch }) {
  return (
    <li className="relative bg-gradient-to-br from-[#fff8f3] via-[#ffe9d6] to-[#fff8f3] rounded-2xl shadow-lg p-6 flex flex-col gap-2 border border-orange-200">
      <div className="flex items-center justify-between mb-1">
        <span className="font-bold text-gray-900 text-base tracking-tight">
          {post.profiles?.handle ? (
            <Link
              href={`/user/${encodeURIComponent(post.profiles.handle)}`}
              className="hover:underline text-orange-500"
            >
              @{post.profiles.handle}
            </Link>
          ) : (
            "@anonymous"
          )}
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
          postAuthorId={post.user_id}
          onFlinch={onFlinch}
        />
      </div>
      <FlinchStatus flinched={flinched} />
    </li>
  );
}

function FlinchButton({ postId, initialCount, userId, flinched, postAuthorId, onFlinch }) {
  // Make sure both ids are strings for comparison
  const isOwnPost =
    userId != null &&
    postAuthorId != null &&
    String(userId) === String(postAuthorId);

  const [count, setCount] = useState(initialCount || 0);
  const [loading, setLoading] = useState(false);
  const [alreadyFlinched, setAlreadyFlinched] = useState(flinched);

  useEffect(() => {
    setAlreadyFlinched(flinched);
  }, [flinched]);

  async function handleFlinch() {
    if (loading || alreadyFlinched) return;
    setLoading(true);
    const { error } = await supabase
      .from("flinches")
      .insert({ user_id: userId, post_id: postId });
    setLoading(false);
    if (!error) {
      setCount((c) => c + 1);
      setAlreadyFlinched(true);
      onFlinch && onFlinch(postId);
    }
  }
  if (isOwnPost) {
    return (
      <button
        className="flex items-center px-5 py-2 rounded-lg bg-gray-200 text-gray-400 font-semibold text-base cursor-not-allowed shadow-md"
        disabled
        aria-disabled="true"
        title="You can&apos;t flinch your own post"
      >
        <span className="pr-1 text-lg">💥</span>
        <span>Flinch</span>
        <span className="ml-2 rounded px-2 py-0.5 font-bold bg-white/80 text-orange-400">
          {count}
        </span>
      </button>
    );
  }

  return (
    <button
      className={`flex items-center px-5 py-2 rounded-lg text-white font-semibold text-base transition
        ${alreadyFlinched ? "bg-orange-200 text-orange-500 cursor-not-allowed" : "bg-orange-300 hover:bg-orange-400 cursor-pointer"}
        shadow-md focus:outline-none focus:ring-2 focus:ring-flinch focus:ring-offset-2`}
      onClick={handleFlinch}
      disabled={alreadyFlinched || loading}
      aria-pressed={alreadyFlinched}
      aria-label={`Flinch${alreadyFlinched ? "ed" : ""} this confession`}
    >
      <span className="pr-1 text-lg">💥</span>
      <span>Flinch</span>
      <span className={`ml-2 rounded px-2 py-0.5 font-bold ${
        alreadyFlinched ? "bg-orange-50 text-orange-600" : "bg-white/80 text-orange-400"
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