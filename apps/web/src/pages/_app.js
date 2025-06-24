import "@/styles/globals.css";
import { AuthProvider } from "../components/AuthProvider";
import Navbar from "../components/Navbar";

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-black text-gray-100">
        <Navbar />
        <Component {...pageProps} />
      </div>
    </AuthProvider>
  );
}