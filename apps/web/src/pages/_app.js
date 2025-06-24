import "@/styles/globals.css";
import { AuthProvider } from "../components/AuthProvider";
import Navbar from "../components/Navbar";

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <div
        className="min-h-screen text-gray-100"
        style={{
          background: "radial-gradient(ellipse 85% 60% at 50% 20%, #ffe9d6 0%, #232526 100%)",
        }}
      >
        <Navbar />
        <Component {...pageProps} />
      </div>
    </AuthProvider>
  );
}