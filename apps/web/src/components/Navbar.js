import { useState } from "react";
import { useAuth } from "./AuthProvider";
import Link from "next/link";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/router";

export default function Navbar() {
  const { user, profile } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-[#111] border-b border-gray-800 px-4 py-2 flex items-center justify-between w-full">
      <Link href="/" className="flex items-center gap-2 font-bold text-flinch text-2xl tracking-tight">
        <span className="hidden sm:inline">Flinch</span>
        <span className="sm:hidden text-xl">😶‍🌫️</span>
      </Link>
      <div className="hidden md:flex gap-6 items-center">
        <NavLinks user={user} profile={profile} />
      </div>
      <button
        className="md:hidden text-flinch focus:outline-none"
        onClick={() => setOpen((v) => !v)}
        aria-label="Open menu"
      >
        <svg width="28" height="28" fill="none" stroke="currentColor">
          <rect x="6" y="8" width="16" height="2" rx="1" fill="currentColor"/>
          <rect x="6" y="14" width="16" height="2" rx="1" fill="currentColor"/>
          <rect x="6" y="20" width="16" height="2" rx="1" fill="currentColor"/>
        </svg>
      </button>
      {/* Mobile menu */}
      {open && (
        <div className="fixed inset-0 bg-black/80 z-50 flex flex-col items-end p-8 md:hidden">
          <button
            className="mb-8 text-flinch"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            <svg width="32" height="32" fill="none" stroke="currentColor">
              <line x1="8" y1="8" x2="24" y2="24" stroke="currentColor" strokeWidth="2"/>
              <line x1="24" y1="8" x2="8" y2="24" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </button>
          <div className="flex flex-col gap-8 text-lg w-full">
            <NavLinks user={user} profile={profile} onClick={() => setOpen(false)} isMobile />
          </div>
        </div>
      )}
    </nav>
  );
}

function NavLinks({ user, profile, onClick, isMobile }) {
  const router = useRouter();

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/login");
    if (onClick) onClick();
  }

  return (
    <>
      <Link href="/" onClick={onClick} className="hover:text-flinch font-medium">Feed</Link>
      <Link href="/vault" onClick={onClick} className="hover:text-flinch font-medium">Vault</Link>
      <Link href="/my-posts" onClick={onClick} className="hover:text-flinch font-medium">My Posts</Link>
      <Link href="/profile" onClick={onClick} className="hover:text-flinch font-medium">Profile</Link>
      <Link href="/leaderboard" onClick={onClick} className="hover:text-flinch font-medium">Leaderboard</Link>
      {user && profile?.handle && (
        <span className="px-3 py-1 rounded bg-flinch/20 text-flinch font-mono">
          @{profile.handle}
        </span>
      )}
      {user && (
        <button
          onClick={handleSignOut}
          className={`ml-2 bg-flinch hover:bg-flinch-dark text-white px-4 py-1 rounded font-bold transition ${
            isMobile ? "w-full mt-2" : ""
          }`}
        >
          Sign out
        </button>
      )}
      {!user && (
        <Link href="/login" onClick={onClick} className="bg-flinch hover:bg-flinch-dark text-white px-4 py-1 rounded font-bold">
          Login
        </Link>
      )}
    </>
  );
}