"use client";
import { useState } from 'react';

export default function HomePage() {
  const [url, setUrl] = useState("");
  const [anchor, setAnchor] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ backlinkUrl: string; slug: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const res = await fetch("/api/create", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ url, anchorText: anchor || undefined })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed");
      setResult({ backlinkUrl: data.backlinkUrl, slug: data.slug });
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid">
      <h1>Backlink Automation Agent</h1>
      <p className="small">Create an instant backlink from this domain to your site and notify search engines via IndexNow.</p>
      <form onSubmit={onSubmit} className="card grid">
        <div>
          <label htmlFor="url">Your website URL</label>
          <input id="url" type="url" required placeholder="https://example.com" value={url} onChange={e => setUrl(e.target.value.trim())} />
          <div className="small">Must start with https://</div>
        </div>
        <div>
          <label htmlFor="anchor">Preferred anchor text (optional)</label>
          <input id="anchor" placeholder="e.g. Example Company" value={anchor} onChange={e => setAnchor(e.target.value)} />
        </div>
        <div>
          <button type="submit" disabled={loading}>{loading ? 'Creating?' : 'Create Backlink'}</button>
        </div>
      </form>

      {error && <div className="card" style={{ borderColor: '#ef4444' }}><strong>Error:</strong> {error}</div>}

      {result && (
        <div className="card grid">
          <div>
            <strong>Backlink URL:</strong>
            <div><a href={result.backlinkUrl} target="_blank" rel="noopener noreferrer">{result.backlinkUrl}</a></div>
          </div>
          <div className="small">We notified IndexNow for faster crawling. Share this URL or add it to your sitemap to help discovery.</div>
        </div>
      )}

      <div className="notice">
        <strong>Note:</strong> This creates a public page on this site that links to your URL with relevant context and multiple anchors. Avoid spam?one per site is recommended.
      </div>
    </div>
  );
}
