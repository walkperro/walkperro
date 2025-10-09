'use client';

import Script from 'next/script';

type Props = {
  /** What discussion thread to use (e.g., "100 Days Challenge") */
  term: string;
  /** Light or dark theme; you can pipe your own toggle into this later */
  theme?: 'light' | 'dark' | 'preferred_color_scheme';
};

export default function GiscusReviews({ term, theme = 'light' }: Props) {
  return (
    <section id="reviews" className="mt-16 rounded-2xl border border-zinc-200 p-6">
      <h2 className="text-2xl font-semibold">Leave a quick review</h2>
      <p className="mt-1 text-sm text-zinc-600">
        Share your experience—what worked, any wins, and what you’d like next. It helps the whole WalkPerro crew.
      </p>

      {/* Giscus container */}
      <div id="giscus_thread" className="mt-6" />

      {/* Embed script — fill these placeholders from https://giscus.app */}
      <Script
        src="https://giscus.app/client.js"
        data-repo="YOUR_GITHUB_USERNAME/YOUR_PUBLIC_REPO"
        data-repo-id="YOUR_REPO_ID"
        data-category="Reviews"               // create a "Reviews" category in your repo discussions
        data-category-id="YOUR_CATEGORY_ID"
        data-mapping="specific"
        data-term={term}
        data-reactions-enabled="1"
        data-emit-metadata="0"
        data-input-position="top"
        data-theme={theme}
        data-lang="en"
        crossOrigin="anonymous"
        async
      />
    </section>
  );
}
