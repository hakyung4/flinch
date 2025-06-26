import { useState } from "react";
import { useAuth } from "./AuthProvider";
import Link from "next/link";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/router";

export default function Navbar() {
  const { user, profile } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 left-0 w-full bg-gradient-to-r from-[#232526] via-[#414345] to-[#ffd89b] border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-lg z-50 transition-all duration-300">
      <Link
        href="/"
        className="flex items-center gap-2 font-bold text-2xl tracking-tight hover:text-orange-200 transition"
      >
        <span className="hidden sm:inline">Flinch</span>
        <span className="sm:hidden text-xl">😶‍🌫️</span>
      </Link>
      {/* Desktop links */}
      <div className="hidden md:flex gap-6 items-center">
        <NavLinks user={user} profile={profile} />
      </div>
      {/* Mobile menu button */}
      <button
        className="md:hidden text-orange-50 focus:outline-none p-2 rounded hover:bg-orange-200"
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
        <div className="fixed inset-0 bg-black/80 z-50 flex flex-col items-end p-8 md:hidden transition-all">
          <button
            className="mb-8 hover:text-orange-200"
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

  // Improved: darker, high-contrast text for active
  const linkBase =
    "font-semibold px-3 py-2 rounded-md transition text-gray-100 hover:bg-orange-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-400/60";
  const activeBase =
    "bg-orange-100 text-gray-900 shadow font-extrabold";

  // Highlight the active page
  function navLink(href, label) {
    const active = router.pathname === href;
    return (
      <Link
        href={href}
        onClick={onClick}
        className={`${linkBase} ${active ? activeBase : "text-gray-100"}`}
      >
        {label}
      </Link>
    );
  }

  return (
    <>
      {navLink("/feed", "Feed")}
      {navLink("/vault", "Vault")}
      {navLink("/my-posts", "My Posts")}
      {navLink("/profile", "Profile")}
      {navLink("/leaderboard", "Leaderboard")}
      {user && profile?.handle && (
        <Link
          href="/profile"
          onClick={onClick}
          className="px-3 py-1 rounded bg-orange-100 hover:bg-orange-50 text-gray-900 font-mono select-text ml-1 transition"
          passHref
        >
          @{profile.handle}
        </Link>
      )}
      {user && (
        <button
          onClick={handleSignOut}
          className={`ml-2 ${isMobile ? "text-gray-900 bg-orange-200" : "text-gray-600 bg-orange-200"} px-4 py-2 rounded font-bold shadow hover:bg-orange-300 hover:text-black focus:outline-none focus:ring-2 focus:ring-flinch/60 transition cursor-pointer ${
            isMobile ? "w-full mt-2" : ""
          }`}
        >
          Sign out
        </button>
      )}
      {!user && (
        <Link
          href="/login"
          onClick={onClick}
          className={`${isMobile ? "text-gray-900 bg-orange-200" : "text-gray-600 bg-orange-200"} px-4 py-2 rounded font-bold shadow hover:bg-orange-300 hover:text-black focus:outline-none focus:ring-2 focus:ring-flinch/60 transition cursor-pointer ${
            isMobile ? "w-full mt-2" : ""
          }`}
        >
          Login
        </Link>
      )}
    </>
  );
}