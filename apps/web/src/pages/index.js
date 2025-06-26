import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-200 px-4">
      <header className="mb-12 text-center">
        <h1 className="text-5xl font-extrabold text-gray-700 mb-4 drop-shadow">Flinch</h1>
        <p className="max-w-xl text-lg text-gray-700 mx-auto">
          Confess, vanish, and flinch without fear. Flinch is your anonymous space to share secrets and stories, powered by community.
        </p>
      </header>
      <section className="max-w-2xl w-full bg-white/90 rounded-2xl shadow-lg p-8 mb-10">
        <h2 className="text-2xl font-bold mb-3 text-gray-800">What is Flinch?</h2>
        <p className="mb-4 text-gray-700">
          Flinch is a safe and anonymous confession platform. Write your stories, react to others with a flinch, and watch as posts vanish when they’ve had enough impact.
        </p>
        <ul className="list-disc list-inside mb-5 text-gray-700">
          <li>Totally anonymous confessions</li>
          <li>Posts vanish after too many flinches</li>
          <li>Fun stats and streaks</li>
        </ul>
        <div className="flex gap-4 mt-6 justify-center">
          <Link href="/feed" className="px-6 py-3 bg-flinch text-white font-bold rounded-lg shadow hover:bg-orange-500 transition">
            See the Feed
          </Link>
          <Link href="/signup" className="px-6 py-3 bg-orange-100 text-flinch font-bold rounded-lg shadow hover:bg-orange-200 transition">
            Sign Up
          </Link>
        </div>
      </section>
    </main>
  );
}