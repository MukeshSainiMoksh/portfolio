import Hero from "@/components/sections/Hero";
import VideoIntro from "@/components/sections/VideoIntro";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Experience from "@/components/sections/Experience";
import Projects from "@/components/sections/Projects";
import Certifications from "@/components/sections/Certifications";
import Education from "@/components/sections/Education";
import Contact from "@/components/sections/Contact";
import Terminal from "@/components/ui/Terminal";
import CommandPalette from "@/components/ui/CommandPalette";
import ChatWidget from "@/components/ui/ChatWidget";
import { fetchPortfolioData, fetchCertifications, fetchSiteAssets } from "@/services/portfolio";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Next.js requires a literal here — keep in sync with REVALIDATE_SECONDS in services/portfolio.ts
export const revalidate = 300;

export default async function HomePage() {
  const [data, certs, assets] = await Promise.all([
    fetchPortfolioData(),
    fetchCertifications(),
    fetchSiteAssets(),
  ]);

  // admin-uploaded assets win over bundled fallbacks
  const resumeUrl = assets.resume.url ? `${API_URL}${assets.resume.url}` : undefined;
  const introVideoUrl = assets.intro_video.url ? `${API_URL}${assets.intro_video.url}` : undefined;

  const hero = data.profile?.hero ?? {};
  const about = data.profile?.about ?? {};

  const projectLinks = (data.projects ?? []).map((p) => ({
    title: p.title,
    live_url: p.live_url,
    github_url: p.github_url,
  }));
  const social = {
    github: about.github_url || undefined,
    linkedin: about.linkedin_url || undefined,
    email: "codermsaini@gmail.com",
  };

  // Person schema — helps Google show rich results for the portfolio
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Mukesh Kumar Saini",
    jobTitle: "Software Engineer & AI Developer",
    email: "mailto:codermsaini@gmail.com",
    address: { "@type": "PostalAddress", addressLocality: "Mohali", addressRegion: "Punjab", addressCountry: "IN" },
    knowsAbout: data.skills?.map((s) => s.skill_name) ?? [],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero profile={hero} about={about} resumeUrl={resumeUrl} />
      <VideoIntro videoSrc={introVideoUrl} />
      <About about={about} />
      <Skills skills={data.skills ?? []} />
      <Experience items={data.experience ?? []} />
      <Projects projects={data.projects ?? []} />
      <Certifications certs={certs} />
      <Education items={data.education ?? []} />
      <Contact />
      <Terminal
        data={{
          skills: (data.skills ?? []).map((s) => s.skill_name),
          projects: projectLinks,
          social,
        }}
      />
      <CommandPalette projects={projectLinks} social={social} />
      <ChatWidget />
    </>
  );
}
