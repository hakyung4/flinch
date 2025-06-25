export default function About() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-12 text-gray-900">
      <h1 className="text-4xl font-extrabold mb-4 text-flinch text-gray-600">About Flinch</h1>
      <section className="mb-8 bg-white/80 p-6 rounded-xl shadow border border-orange-200">
        <h2 className="text-2xl font-bold mb-2">What is Flinch?</h2>
        <p>
          Flinch is an anonymous confession and sharing platform designed to let you express your thoughts, secrets, and stories in a safe, supportive community. Whether you want to get something off your chest, find support, or simply read relatable stories, Flinch is your space.
        </p>
      </section>
      <section className="mb-8 bg-white/80 p-6 rounded-xl shadow border border-orange-200">
        <h2 className="text-2xl font-bold mb-2">How does it work?</h2>
        <ul className="list-disc ml-6 text-base space-y-2">
          <li>Sign up with your email (your identity stays private).</li>
          <li>Write and post your confession anonymously. No names or identifying info are shown to other users.</li>
          <li>Browse, react, and comment on confessions posted by others in the community.</li>
          <li>Use the Vault to save your favorite posts, and view your own confessions under “My Posts”.</li>
          <li>Leaderboard and profiles foster a positive, supportive atmosphere—never toxic or judgmental.</li>
        </ul>
      </section>
      <section className="mb-8 bg-white/80 p-6 rounded-xl shadow border border-orange-200">
        <h2 className="text-2xl font-bold mb-2">Frequently Asked Questions</h2>
        <div className="mb-4">
          <h3 className="font-semibold">Is Flinch really anonymous?</h3>
          <p>Yes. Your email is used only for login and account management. Posted content never displays your identity.</p>
        </div>
        <div className="mb-4">
          <h3 className="font-semibold">Can I delete my posts or account?</h3>
          <p>Yes! You can delete your own confessions at any time, and you can contact us to remove your account completely.</p>
        </div>
        <div className="mb-4">
          <h3 className="font-semibold">What kind of content is allowed?</h3>
          <p>
            We encourage honest expression, but do not allow hate, threats, illegal content, or personal attacks. See our <a href="/terms" className="underline text-gray-700 hover:text-gray-500">Terms of Service</a> for details.
          </p>
        </div>
        <div className="mb-4">
          <h3 className="font-semibold">How do you keep the community safe?</h3>
          <p>
            Our moderation team reviews reports, and users can flag inappropriate content. We strive to keep Flinch a safe, welcoming place for all.
          </p>
        </div>
      </section>
      <section className="bg-white/80 p-6 rounded-xl shadow border border-orange-200">
        <h2 className="text-2xl font-bold mb-2">Contact & Feedback</h2>
        <p>
          Have a question, suggestion, or concern? Reach out to us at <a href="mailto:support@flinch.app" className="underline text-gray-700 hover:text-gray-500">support@flinch.app</a> — we’d love to hear from you!
        </p>
      </section>
    </main>
  );
}