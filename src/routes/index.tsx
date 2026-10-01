import type React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { houseRoster, sports } from "@/data/mockData";
import { SectionHeading, SportsList } from "@/components/championship/Sections";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Bright Battle Royale 2026 | The Championship" },
    { name: "description", content: "Four houses. Eleven sports. One champion. Follow the Bright Battle Royale 2026 championship, standings, fixtures and results." },
    { property: "og:title", content: "Bright Battle Royale 2026 | The Championship" },
    { property: "og:description", content: "Four houses. Eleven sports. One champion. Follow the championship." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Home,
});

function Home() {
  return <main>
    <section className="intro page-width">
      <div className="intro-top"><span>BRIGHT MONEY PRESENTS</span></div>
      <div className="intro-grid"><div className="intro-title"><h1><span>BRIGHT</span><span>BATTLE</span><span>ROYALE<span className="title-dot">.</span></span></h1></div><div className="intro-year"><span>THE CHAMPIONSHIP</span><strong>2026</strong></div></div>
      <div className="intro-bottom"><p>FOUR HOUSES.<br/>ELEVEN SPORTS.<br/><em>ONE CHAMPION.</em></p><div><span>06 — 17 OCTOBER 2026</span><span>BRIGHT MONEY · INDIA</span></div></div>
    </section>

    <section className="house-arena" aria-labelledby="houses-heading"><div className="page-width"><div className="house-arena-heading"><h2 id="houses-heading" className="eyebrow">THE FOUR HOUSES</h2></div><ul className="house-roster">{houseRoster.map((house) => <li key={house.id} style={{ "--glow": house.color } as React.CSSProperties}><img src={house.logo} alt={house.name} width={480} height={480} loading="lazy"/></li>)}</ul></div></section>

    <section className="section games-section page-width" id="games"><SectionHeading kicker="01 / PICK YOUR ARENA" title="Tournaments" intro="Follow every match live from here. Pick a tournament to see its fixtures, live scores, bracket and podium, updated the moment each result comes in."/><SportsList only={["cricket", "table-tennis"]}/><div className="section-end"><span>{sports.length} SPORTS / 16 MEDAL EVENTS</span></div></section>

  </main>;
}