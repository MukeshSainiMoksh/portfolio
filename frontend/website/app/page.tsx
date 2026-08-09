import Hero from "@/components/sections/Hero";
import VideoIntro from "@/components/sections/VideoIntro";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Experience from "@/components/sections/Experience";
import Projects from "@/components/sections/Projects";
import Certifications from "@/components/sections/Certifications";
import Education from "@/components/sections/Education";
import Contact from "@/components/sections/Contact";
import DeferredUI from "@/components/ui/DeferredUI";
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
  const email = about.email || "codermsaini@gmail.com";
  const social = {
    github: about.github_url || undefined,
    linkedin: about.linkedin_url || undefined,
    email,
  };

  /* Person schema — helps Google show rich results for the portfolio.
     Every value comes from admin data; these used to be hard-coded, so
     editing the profile left the structured data saying something else. */
  const [locality, region] = (about.location ?? "")
    .split(",")
    .map((part) => part.trim());
  const currentRole = (data.experience ?? []).find((e) => e.is_current);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: hero.name || "Mukesh Kumar Saini",
    jobTitle: hero.tagline || "Software Engineer & AI Developer",
    email: `mailto:${email}`,
    ...(currentRole && {
      worksFor: { "@type": "Organization", name: currentRole.company },
    }),
    ...((locality || region) && {
      address: {
        "@type": "PostalAddress",
        ...(locality && { addressLocality: locality }),
        ...(region && { addressRegion: region }),
        addressCountry: "IN",
      },
    }),
    ...(about.linkedin_url || about.github_url
      ? { sameAs: [about.linkedin_url, about.github_url].filter(Boolean) }
      : {}),
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
      <Contact about={about} />
      <DeferredUI
        terminalData={{
          skills: (data.skills ?? []).map((s) => s.skill_name),
          projects: projectLinks,
          social,
        }}
        projects={projectLinks}
        social={social}
      />
    </>
  );
}
