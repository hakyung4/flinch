export default function Footer() {
  return (
    <footer className="w-full mt-16 pb-8 flex flex-col items-center text-sm">
      <div className="flex gap-4 mb-2">
        <a href="/terms" className="hover:underline text-flinch font-semibold">Terms of Service</a>
        <span className="text-gray-400">|</span>
        <a href="/privacy" className="hover:underline text-flinch font-semibold">Privacy Policy</a>
      </div>
      <div className="text-xs text-gray-300">&copy; {new Date().getFullYear()} Flinch. All rights reserved.</div>
    </footer>
  );
}