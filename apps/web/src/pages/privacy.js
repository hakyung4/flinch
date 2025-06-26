import Link from "next/link";

export default function PrivacyPolicy() {
  return (
      <main className="max-w-2xl mx-auto px-4 py-12 text-gray-900">
        <h1 className="text-3xl font-extrabold mb-6 text-flinch">Privacy Policy</h1>
        <div className="space-y-6 text-base leading-relaxed bg-white/70 p-6 rounded-xl shadow border border-orange-200">
          <p>
            Your privacy is important to us. This Privacy Policy explains how Flinch (“we”, “us”, “our”) collects, uses, and protects your information.
          </p>

          <h2 className="font-bold text-lg text-flinch mt-6">1. Information We Collect</h2>
          <ul className="list-disc ml-6">
            <li><b>Account Information:</b> We collect your email address, username, and password when you register.</li>
            <li><b>Confessions & Content:</b> We store the confessions and posts you create, as well as public profile information.</li>
            <li><b>Usage Data:</b> We collect information about how you use Flinch, such as pages visited and interactions.</li>
          </ul>

          <h2 className="font-bold text-lg text-flinch mt-6">2. How We Use Your Information</h2>
          <ul className="list-disc ml-6">
            <li>To provide, maintain, and improve our services.</li>
            <li>To protect the safety and integrity of Flinch and our users.</li>
            <li>To communicate with you about your account or updates to our service.</li>
          </ul>

          <h2 className="font-bold text-lg text-flinch mt-6">3. Sharing of Information</h2>
          <ul className="list-disc ml-6">
            <li>We do not sell your personal information.</li>
            <li>We may share information as required by law or to protect Flinch and its users.</li>
            <li>Some anonymized data may be used for analytics and service improvement.</li>
          </ul>

          <h2 className="font-bold text-lg text-flinch mt-6">4. Data Security</h2>
          <p>
            We use industry-standard security measures to protect your data. However, no online service can be 100% secure.
          </p>

          <h2 className="font-bold text-lg text-flinch mt-6">5. Your Choices</h2>
          <ul className="list-disc ml-6">
            <li>You may access or update your account information at any time.</li>
            <li>You may delete your account by contacting us at <Link className="underline text-flinch" href="mailto:support@flinch.app">support@flinch.app</Link></li>
          </ul>

          <h2 className="font-bold text-lg text-flinch mt-6">6. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of significant changes by posting an update on Flinch.
          </p>

          <h2 className="font-bold text-lg text-flinch mt-6">7. Contact</h2>
          <p>
            If you have any questions or concerns about your privacy, please contact us at <Link className="underline text-gray-700 hover:text-gray-500" href="mailto:support@flinch.app">support@flinch.app</Link>
          </p>
        </div>
      </main>
  );
}