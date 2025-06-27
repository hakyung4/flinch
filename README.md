# Flinch — Anonymous Confession Platform

Flinch is a lightweight, modern, and safe platform for sharing anonymous confessions. Built with Next.js and Supabase, Flinch prioritizes privacy, genuine self-expression, and community safety. Unlike mainstream social apps, Flinch is not about popularity, followers, or viral content—it's about being honest, feeling heard, and connecting through real human stories.

---

## 🚀 Features

- **Post Anonymously:** Share your thoughts and feelings without revealing your identity.
- **No Deletion:** Confessions are permanent (except for legal removal requests)—so post with care!
- **Unique Vanishing Mechanic:** Posts can “vanish” based on community flinches, encouraging honest and respectful sharing.
- **No Public Profiles or Followers:** Focus on content, not popularity.
- **Search & Pagination:** Easily explore confessions by content and navigate with smooth pagination.
- **Safety & Moderation:** Community guidelines and active moderation keep the platform healthy and supportive.
- **Responsive & Minimal Design:** Fast, distraction-free interface for web and mobile.

---

## 🛠️ Tech Stack

- [Next.js](https://nextjs.org/) — Frontend Framework
- [Supabase](https://supabase.com/) — Backend (database, authentication, API)
- [React](https://reactjs.org/) — UI Components
- [Tailwind CSS](https://tailwindcss.com/) — Styling

---

## 📦 Getting Started

1. **Clone the repository:**
   ```sh
   git clone https://github.com/yourusername/flinch.git
   cd flinch
   ```

2. **Install dependencies:**
   ```sh
   npm install
   # or
   yarn
   ```

3. **Set up environment variables:**
   - Copy `.env.example` to `.env.local`
   - Fill in your [Supabase](https://supabase.com/) project credentials:
     ```
     NEXT_PUBLIC_SUPABASE_URL=...
     NEXT_PUBLIC_SUPABASE_ANON_KEY=...
     ```

4. **Run the development server:**
   ```sh
   npm run dev
   # or
   yarn dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000) in your browser.**

---

## 🌐 Deployment

- **Frontend:** [Vercel](https://vercel.com/) (recommended), Netlify, or any Next.js-compatible host.
- **Backend:** Supabase (free tier is sufficient for most projects).
- **Instructions:** Push your repo to GitHub and connect it to Vercel. Set your environment variables in the Vercel dashboard.

---

## ❓ FAQ

**How is Flinch different from other social platforms?**  
Flinch is anonymous by default, has no follower counts, and avoids algorithmic feeds or viral mechanics. The focus is on real, unfiltered human stories, not popularity or performance.

**Can I delete my posts?**  
No. Posts are permanent. For legal removal requests, please contact support.

**Is Flinch really anonymous?**  
Yes! Your email is only used for login and never shown publicly.

**How do you keep the community safe?**  
Through active moderation and strong community guidelines. See [Terms of Service](/terms) for details.

---

## 🤝 Contributing

Pull requests and issues are welcome! Please open an issue to discuss your idea or bug before submitting a PR.

---

## 📫 Contact

Questions, feedback, or support requests?  
Email us at [support@flinch.app](mailto:support@flinch.app)
