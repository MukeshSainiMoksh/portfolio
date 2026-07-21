import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CursorGlow from "@/components/layout/CursorGlow";

export const metadata: Metadata = {
  title: "Mukesh Kumar Saini — Software Engineer & AI Developer",
  description:
    "Portfolio of Mukesh Kumar Saini — Software Engineer specializing in AI/ML, FastAPI backends, and full-stack development.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body>
        <CursorGlow />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
