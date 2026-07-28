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
    return res.json();
  } catch {
    return {
      resume: { exists: false, url: null },
      intro_video: { exists: false, url: null },
    };
  }
}

export async function fetchCertifications(): Promise<Certification[]> {
  try {
    const res = await fetch(`${API_URL}/api/website/certifications/`, {
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return []; // certifications section simply hides itself
  }
}
