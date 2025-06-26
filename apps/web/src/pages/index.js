import Link from "next/link";
import { useEffect, useState, useRef } from "react";

// Fade-in animation for landing sections
function FadeSection({ children, delay = 0 }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);
  return (
    <div
      style={{
        opacity: show ? 1 : 0,
        transform: show ? "none" : "translateY(24px)",
        transition: "opacity 1s cubic-bezier(.42,0,.58,1), transform 1s cubic-bezier(.42,0,.58,1)",
      }}
    >
      {children}
    </div>
  );
}

const FAQ = [
  {
    q: "Is Flinch really anonymous?",
    a: "Yes. Your email is used only for login and account management. Posted content never displays your identity."
  },
  {
    q: "Can I delete my posts or account?",
    a: <>
    You can't delete your posts! So, be mindful of what you share. If you need to remove your post for legal reasons, please contact <Link href="mailto:support@flinch.app" className="underline text-gray-700 hover:text-gray-500">us</Link>.<br />
    For account deletion, just email us at <Link href="mailto:support@flinch.app" className="underline text-gray-700 hover:text-gray-500">support@flinch.app</Link> and we’ll handle it for you.
    </>
  },
  {
    q: "What kind of content is allowed?",
    a: <>
      We encourage honest expression, but do not allow hate, threats, illegal content, or personal attacks. See our{" "}
      <Link href="/terms" className="underline text-gray-700 hover:text-gray-500">Terms of Service</Link>{" "}for details.
    </>
  },
  {
    q: "How do you keep the community safe?",
    a: "Our moderation team reviews and removes inappropriate contents. We strive to keep Flinch a safe, welcoming place for all."
  },
  {
    q: "I want to see more features! What’s next?",
    a: <>
    We’re always working to add new features—let us know what you’d like to see!
    You can reach us at <Link href="mailto:support@flinch.app" className="underline text-gray-700 hover:text-gray-500">support@flinch.app</Link>
    </>
  },
  {
    q: "How is Flinch different from other social platforms like Reddit, X, Facebook, or Instagram?",
    a: <>
      Unlike traditional social platforms, Flinch is built around anonymity, minimalism, and genuine self-expression.
      <ul className="list-disc ml-6 mt-2 space-y-1 text-left">
        <li><b>Anonymity by default:</b> No public profiles, no follower counts, and no pressure to perform.</li>
        <li><b>No popularity contest:</b> There are no likes, shares, or upvotes—just honest sharing.</li>
        <li><b>Minimal distractions:</b> No algorithmic feeds, targeted ads, or endless notifications.</li>
        <li><b>Unique vanish/flinch mechanics:</b> Posts can vanish, and flinches encourage honesty, not virality.</li>
        <li><b>Supportive environment:</b> Community guidelines and moderation focus on safety and respect, not outrage or clickbait.</li>
      </ul>
      <span className="block mt-2">
        While platforms like Reddit, X (Twitter), Facebook, and Instagram are about building a public persona or network, Flinch centers on authentic, anonymous sharing and human connection.
      </span>
    </>
  }
];

export default function Home() {
  // Ensure scroll to top on load (fixes reload-at-section bug)
  useScrollToTopOnMount();

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-200 px-2 sm:px-4 flex flex-col items-center relative overflow-x-hidden">
      {/* Floating confetti/emoji animation (client-only to avoid hydration errors) */}
      <ConfettiEmoji />
      {/* HERO */}
      <FadeSection>
        <header className="mt-20 mb-12 text-center">
          <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-600 drop-shadow mb-4 flex flex-col items-center">
            Flinch
            <span className="text-3xl sm:text-4xl font-normal text-orange-400 mt-2 tracking-tight">Confess. Vanish. Flinch.</span>
          </h1>
          <p className="max-w-2xl text-lg sm:text-xl text-gray-700 mx-auto font-medium mb-4">
            Your anonymous space to share secrets, find support, and react with a <span className="inline-block">💥</span>.
            Safe, supportive, and always confidential.
          </p>
          <div className="flex gap-4 mt-8 justify-center">
            <Link href="/feed" className="px-7 py-3 bg-orange-100 text-gray-600 hover:text-white font-bold rounded-lg shadow-lg hover:bg-orange-500 transition text-lg">
              See the Feed
            </Link>
            <Link href="/signup" className="px-7 py-3 bg-orange-100 text-gray-600 hover:text-white font-bold rounded-lg shadow-lg hover:bg-orange-400 transition text-lg border border-orange-200">
              Sign Up
            </Link>
          </div>
        </header>
      </FadeSection>
      {/* ABOUT/FEATURES */}
      <FadeSection delay={200}>
        <section className="max-w-3xl w-full bg-white/90 rounded-2xl shadow-xl p-8 mb-10 border-l-8 border-orange-200">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-gray-800 flex items-center gap-2">
            <span>What is Flinch?</span> <span className="text-3xl">😶‍🌫️</span>
          </h2>
          <p className="mb-5 text-gray-700">
            Flinch is an anonymous confession and sharing platform designed to let you express your thoughts, secrets, and stories in a safe, supportive community. Whether you want to get something off your chest, find support, or simply read relatable stories, Flinch is your space.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <FeatureCard
              icon="🔒"
              title="Truly Anonymous"
              desc="Sign up with email, but your identity is never shown with your confessions."
            />
            <FeatureCard
              icon="💥"
              title="Flinches & Vanishing"
              desc="React with a flinch. Posts vanish after enough flinches—nothing lasts forever."
            />
            <FeatureCard
              icon="🏆"
              title="Community & Support"
              desc="Browse, flinch and support others. Leaderboards and profiles keep it positive."
            />
            <FeatureCard
              icon="🧰"
              title="Your Vault"
              desc="View your vanished confessions, and track your journey."
            />
          </div>
        </section>
      </FadeSection>
      {/* HOW IT WORKS */}
      <FadeSection delay={400}>
        <section className="max-w-3xl w-full mb-10 bg-white/90 p-8 rounded-2xl shadow border-l-8 border-flinch/50">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-gray-800">How does it work?</h2>
          <ol className="list-decimal ml-7 text-base space-y-2 text-gray-800 font-medium">
            <li>Sign up (your identity always stays private).</li>
            <li>Write and post your confession anonymously — no names, no judgment.</li>
            <li>React to confessions with a flinch.</li>
            <li>Want to leave for good? just email us at <Link href="mailto:support@flinch.app" className="underline text-gray-700 hover:text-gray-500">support@flinch.app</Link> to delete your account.</li>
            <li>Climb the leaderboard and earn badges for milestones!</li>
          </ol>
        </section>
      </FadeSection>
      {/* FAQ */}
      <FadeSection delay={600}>
        <section className="max-w-3xl w-full mb-10 bg-white/90 p-8 rounded-2xl shadow border-l-8 border-orange-200">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-800">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {FAQ.map((item, i) => (
              <div key={i} className="bg-orange-50/80 rounded-lg p-4 shadow flex flex-col gap-1">
                <h3 className="font-semibold text-gray-500">{item.q}</h3>
                <div className="text-gray-700">{item.a}</div>
              </div>
            ))}
          </div>
        </section>
      </FadeSection>
      {/* CONTACT */}
      <FadeSection delay={800}>
        <section className="max-w-3xl w-full mb-10 bg-white/90 p-8 rounded-2xl shadow border-l-8 border-flinch/50">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-gray-800">Contact & Feedback</h2>
          <p className="text-gray-700 mb-2">
            Have a question, suggestion, or concern? Reach out to us at{" "}
            <Link href="mailto:support@flinch.app" className="underline hover:text-orange-600">
              support@flinch.app
            </Link>
            {" "}— we’d love to hear from you!
          </p>
        </section>
      </FadeSection>
    </main>
  );
}

// Always scroll to top on mount (fixes reload-to-section bug)
function useScrollToTopOnMount() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    // Use a timeout to ensure scroll fires after Next.js routing/render
    setTimeout(() => window.scrollTo({ top: 0, left: 0, behavior: "auto" }), 0);
  }, []);
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="flex items-start gap-3 bg-orange-50/80 rounded-lg p-4 shadow min-w-0">
      <span className="text-3xl">{icon}</span>
      <div>
        <span className="font-bold text-gray-800 text-lg">{title}</span>
        <div className="text-gray-600 text-sm">{desc}</div>
      </div>
    </div>
  );
}

// Confetti/emoji animation overlay (client-only, avoids hydration error)
function ConfettiEmoji() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const emojis = ["😶‍🌫️", "💥", "🫥", "🌫️", "🦊", "🌟", "🫧", "🦝", "🦉", "🧡"];
  return (
    <div className="pointer-events-none fixed inset-0 z-[-1]">
      {[...Array(18)].map((_, i) => {
        const left = Math.random() * 100;
        const duration = 7 + Math.random() * 8;
        const delay = Math.random() * 8;
        const emoji = emojis[Math.floor(Math.random() * emojis.length)];
        return (
          <span
            key={i}
            className="absolute text-2xl sm:text-3xl opacity-60"
            style={{
              left: `${left}%`,
              top: "-2em",
              animation: `fall ${duration}s linear ${delay}s infinite`,
              userSelect: "none",
              pointerEvents: "none",
            }}
          >
            {emoji}
          </span>
        );
      })}
      <style jsx global>{`
        @keyframes fall {
          0% { transform: translateY(0) rotate(0deg);}
          90% { opacity: 0.6;}
          100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}