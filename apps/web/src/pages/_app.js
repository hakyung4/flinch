import "@/styles/globals.css";
import { AuthProvider } from "../components/AuthProvider";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Head from "next/head";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Flinch</title>
        <meta name="description" content="Flinch – Confess anonymously and connect through real stories." />
        <meta property="og:title" content="Flinch" />
        <meta property="og:description" content="Confess anonymously and connect through real stories." />
        <meta property="og:image" content="/flinch-og.png" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="theme-color" content="#FFB347" />
        <link rel="icon" href="/flinch.svg" type="image/svg+xml" />
        {/* Optionally add a PNG fallback: */}
        <link rel="icon" href="/flinch.png" sizes="any" type="image/png" />
      </Head>
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
    </>
  );
}