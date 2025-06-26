import { useAuth } from "./AuthProvider";
import { useRouter } from "next/router";
import { needsHandle } from "@flinch/utils";
import { useEffect, useRef } from "react";

export default function RequireAuth({ children }) {
  const { user, profile, loading, profileLoading } = useAuth();
  const router = useRouter();
  const hasRedirected = useRef(false);

  // Run redirects ONLY after loading is done. Hooks must be called at the top level.
  useEffect(() => {
    if (loading || profileLoading || profile === undefined) return;

    if (!user) {
      if (!hasRedirected.current) {
        hasRedirected.current = true;
        router.replace("/login");
      }
    } else if (needsHandle(profile)) {
      if (!hasRedirected.current) {
        hasRedirected.current = true;
        router.replace("/set-handle");
      }
    }
  }, [user, profile, loading, profileLoading, router]);

  // While loading, always show the spinner and nothing else
  if (loading || profileLoading || profile === undefined) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="text-lg animate-pulse">Loading…</span>
      </div>
    );
  }

  // While redirecting, show nothing
  if (!user || needsHandle(profile)) return null;

  // Otherwise, render the protected content
  return children;
}