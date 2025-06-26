import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Link from "next/link";

export default function TermsOfService() {
  return (
      <main className="max-w-2xl mx-auto px-4 py-12 text-gray-900">
        <h1 className="text-3xl font-extrabold mb-6 text-flinch">Terms of Service</h1>
        <div className="space-y-6 text-base leading-relaxed bg-white/70 p-6 rounded-xl shadow border border-orange-200">
          <p>
            Welcome to Flinch! These Terms of Service (“Terms”) govern your use of the Flinch platform and services. By using Flinch, you agree to these Terms.
          </p>

          <h2 className="font-bold text-lg text-flinch mt-6">1. Eligibility & Registration</h2>
          <ul className="list-disc ml-6">
            <li>You must be at least 13 years old to use Flinch.</li>
            <li>You are responsible for maintaining the confidentiality of your account information.</li>
          </ul>

          <h2 className="font-bold text-lg text-flinch mt-6">2. User Content</h2>
          <ul className="list-disc ml-6">
            <li>You are solely responsible for the content you post, including confessions, comments, and profile information.</li>
            <li>You agree not to post content that is illegal, abusive, harassing, hateful, or otherwise violates any law or the rights of others.</li>
            <li>Flinch reserves the right to remove content that violates these Terms or is otherwise inappropriate.</li>
          </ul>

          <h2 className="font-bold text-lg text-flinch mt-6">3. Privacy</h2>
          <p>
            Your privacy is important to us. Please review our <Link href="/privacy" className="text-flinch underline">Privacy Policy</Link> to understand how we collect, use, and safeguard your information.
          </p>

          <h2 className="font-bold text-lg text-flinch mt-6">4. Acceptable Use</h2>
          <ul className="list-disc ml-6">
            <li>Do not use Flinch to harass, threaten, impersonate, or intimidate others.</li>
            <li>Do not use automated means (bots, scripts) to access or use Flinch.</li>
            <li>Do not attempt to hack, disrupt, or interfere with Flinch or its users.</li>
          </ul>

          <h2 className="font-bold text-lg text-flinch mt-6">5. Modification & Termination</h2>
          <ul className="list-disc ml-6">
            <li>We may modify these Terms at any time. Continued use of Flinch after changes constitutes acceptance of the new Terms.</li>
            <li>We reserve the right to suspend or terminate accounts for violation of these Terms.</li>
          </ul>

          <h2 className="font-bold text-lg text-flinch mt-6">6. Disclaimer & Limitation of Liability</h2>
          <p>
            Flinch is provided “as is.” We are not responsible for any damages resulting from your use of Flinch. User content does not reflect the views of Flinch or its operators.
          </p>

          <h2 className="font-bold text-lg text-flinch mt-6">7. Contact</h2>
          <p>
            For any questions about these Terms, contact us at <Link className="underline text-gray-700 hover:text-gray-500" href="mailto:support@flinch.app">support@flinch.app</Link>
          </p>
        </div>
      </main>
  );
}