/**
 * Server-side data fetching — runs in Server Components only.
 * Uses native fetch so Next.js can cache + revalidate (ISR).
 */

import type { PortfolioData } from "./api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const REVALIDATE_SECONDS = 300; // matches backend's 5-min portfolio cache

export interface Certification {
  id: number;
  name: string;
  issuer: string;
  credential_id: string | null;
  credential_url: string | null;
  issue_date: string | null;
  expiry_date: string | null;
  description: string | null;
  badge_url: string | null;
}

export async function fetchPortfolioData(): Promise<PortfolioData> {
  const res = await fetch(`${API_URL}/api/website/content/portfolio`, {
    next: { revalidate: REVALIDATE_SECONDS },
  });
  if (!res.ok) throw new Error(`Portfolio API returned ${res.status}`);
  return res.json();
}

export interface SiteAssets {
  resume: { exists: boolean; url: string | null };
  intro_video: { exists: boolean; url: string | null };
}

/** Admin-uploaded resume/intro-video status. Nulls when backend has none. */
export async function fetchSiteAssets(): Promise<SiteAssets> {
  try {
    const res = await fetch(`${API_URL}/api/website/assets/`, {
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) throw new Error(String(res.status));
    const assets: SiteAssets = await res.json();
    // Hand back ready-to-use URLs so callers never build them by hand.
    return {
      resume: { ...assets.resume, url: resolveAssetUrl(assets.resume.url) },
      intro_video: { ...assets.intro_video, url: resolveAssetUrl(assets.intro_video.url) },
    };
  } catch {
    return {
      resume: { exists: false, url: null },
      intro_video: { exists: false, url: null },
    };
  }
}

/**
 * Turns whatever the backend reports into a URL the browser can actually use.
 *
 * With STORAGE_BACKEND=local the API returns a bare "/uploads/..." path, which
 * next/image would resolve against the *website's* origin and 404 on — so a
 * freshly uploaded certificate badge silently never appears. With an S3/R2
 * backend it already returns an absolute URL, which must be left alone (the
 * old code prefixed everything, producing "http://apihttps://bucket/...").
 * Paths into the website's own /public are also left alone.
 */
export function resolveAssetUrl(url: string | null): string | null {
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith("/uploads/")) return `${API_URL}${url}`;
  return url;
}

export async function fetchCertifications(): Promise<Certification[]> {
  try {
    const res = await fetch(`${API_URL}/api/website/certifications/`, {
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) return [];
    const certs: Certification[] = await res.json();
    return certs.map((c) => ({ ...c, badge_url: resolveAssetUrl(c.badge_url) }));
  } catch {
    return []; // certifications section simply hides itself
  }
}
