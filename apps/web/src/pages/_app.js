import "@/styles/globals.css";
import { AuthProvider } from "../components/AuthProvider";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <div
        className="min-h-screen flex flex-col"
        style={{
          background:
            "radial-gradient(ellipse 90% 70% at 50% 20%, #fff7ed 0%, #ffe9d6 40%, #b89b7b 95%, #69543a 100%)",
        }}
      >
        <Navbar />
        <main className="flex-1">
          <Component {...pageProps} />
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}