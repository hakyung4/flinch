import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full mt-16 pb-8 flex flex-col items-center text-sm">
      <div className="flex gap-4 mb-2">
        <Link href="/terms" className="hover:underline text-flinch font-semibold">Terms of Service</Link>
        <span className="text-gray-400">|</span>
        <Link href="/privacy" className="hover:underline text-flinch font-semibold">Privacy Policy</Link>
      </div>
      <div className="text-xs text-gray-300">&copy; {new Date().getFullYear()} Flinch. All rights reserved.</div>
    </footer>
  );
}