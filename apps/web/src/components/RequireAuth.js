import { useAuth } from "./AuthProvider";
import { useRouter } from "next/router";
import { needsHandle } from "@flinch/utils";
import { useEffect } from "react";

export default function RequireAuth({ children }) {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return; // Wait until loading is done

    if (!user) {
      router.replace("/login");
    } else if (needsHandle(profile)) {
      router.replace("/set-handle");
    }
  }, [user, profile, loading, router]);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <span className="text-flinch text-lg animate-pulse">Loading…</span>
    </div>
  );

  // Only render children when user is logged in AND has handle
  if (!user || needsHandle(profile)) return null;

  return children;
}