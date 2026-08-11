import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

export default api;

export interface PortfolioData {
  profile: Record<string, Record<string, string>>;
  skills: Array<{
    id: number;
    category: string;
    skill_name: string;
    skill_level: number;
    icon_class: string | null;
    display_order: number;
  }>;
  experience: Array<{
    id: number;
    job_title: string;
    company: string;
    location: string | null;
    start_date: string;
    end_date: string | null;
    is_current: boolean;
    description: string | null;
    responsibilities: string[] | null;
    technologies: string | null;
    display_order: number;
  }>;
  projects: Array<{
    id: number;
    title: string;
    tagline: string | null;
    description: string | null;
    role: string | null;
    duration: string | null;
    technologies: string[] | null;
    features: string[] | null;
    live_url: string | null;
    github_url: string | null;
    icon_class: string | null;
    project_tag: string | null;
    is_featured: boolean;
    display_order: number;
  }>;
  education: Array<{
    id: number;
    degree: string;
    institution: string;
    location: string | null;
    year: string | null;
    grade: string | null;
    description: string | null;
    type: string;
    display_order: number;
  }>;
}

// NOTE: portfolio data is now fetched server-side — see services/portfolio.ts.
// This axios instance is only used for client-side POSTs (contact form).
