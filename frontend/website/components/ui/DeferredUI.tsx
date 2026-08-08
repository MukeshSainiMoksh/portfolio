"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import type { TerminalData } from "./Terminal";

/* These three are overlays — none of them is visible on arrival, and together
   they are a large slice of the client bundle. Loading them after the page has
   gone idle keeps them off the critical path. */
const Terminal       = dynamic(() => import("./Terminal"),       { ssr: false });
const CommandPalette = dynamic(() => import("./CommandPalette"), { ssr: false });
const ChatWidget     = dynamic(() => import("./ChatWidget"),     { ssr: false });

type Social = { github?: string; linkedin?: string; email?: string };
type ProjectLink = { title: string; live_url: string | null; github_url: string | null };

export default function DeferredUI({
  terminalData,
  projects,
  social,
}: {
  terminalData: TerminalData;
  projects: ProjectLink[];
  social: Social;
}) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // requestIdleCallback is unavailable in Safari < 17
    const ric = window.requestIdleCallback;
    if (ric) {
      const id = ric(() => setReady(true), { timeout: 2500 });
      return () => window.cancelIdleCallback?.(id);
    }
    const id = window.setTimeout(() => setReady(true), 1500);
    return () => window.clearTimeout(id);
  }, []);

  if (!ready) return null;

  return (
    <>
      <Terminal data={terminalData} />
      <CommandPalette projects={projects} social={social} />
      <ChatWidget />
    </>
  );
}
