import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { houseRoster, sports } from "@/data/event";
import { SectionHeading, TournamentList } from "@/components/championship/Sections";
import { getPublishedTournaments } from "@/lib/tournament-data";
import { LIVE_REFRESH_MS, useAutoRefresh } from "@/hooks/use-auto-refresh";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Bright Battle Royale 2026 | The Championship" },
    { name: "description", content: "Four houses. Eleven sports. One champion. Follow the Bright Battle Royale 2026 championship, standings, fixtures and results." },
    { property: "og:title", content: "Bright Battle Royale 2026 | The Championship" },
    { property: "og:description", content: "Four houses. Eleven sports. One champion. Follow the championship." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  loader: () => getPublishedTournaments(),
  component: Home,
});

function Home() {
  const { tournaments } = Route.useLoaderData();
  useAutoRefresh(LIVE_REFRESH_MS);
  return <main>
    <section className="intro page-width">
      <div className="intro-top"><span>BRIGHT MONEY PRESENTS</span></div>
      <div className="intro-grid"><div className="intro-title"><h1><span>BRIGHT</span><span>BATTLE</span><span>ROYALE<span className="title-dot">.</span></span></h1></div><div className="intro-year"><span>THE CHAMPIONSHIP</span><strong>2026</strong></div></div>
      <div className="intro-bottom"><p>FOUR HOUSES.<br/>ELEVEN SPORTS.<br/><em>ONE CHAMPION.</em></p><div><span>06 — 17 OCTOBER 2026</span><span>BRIGHT MONEY · INDIA</span></div></div>
    </section>

    {/* The four houses on the green band, laid out like InMobi's teams strip: label on the left, each logo with its name. */}
    <section className="bg-mint-light" aria-label="The four houses"><div className="page-width flex flex-col gap-4 py-6 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-10 sm:gap-y-4"><span className="eyebrow">Four houses</span>{/* Two-by-two on a phone; sm:contents dissolves the grid so desktop is one row. */}<div className="grid grid-cols-2 gap-x-4 gap-y-4 sm:contents">{houseRoster.map((house) => <span key={house.id} className="flex items-center gap-3"><img src={house.logo} alt="" width={128} height={128} loading="lazy" className="size-12 shrink-0 rounded-xl object-cover sm:size-16" style={{ boxShadow: `0 0 0 1px color-mix(in oklab, ${house.color} 60%, transparent), 0 10px 28px -14px ${house.color}` }}/><span className="font-display text-sm font-bold leading-tight tracking-tight sm:text-base">{house.name}</span></span>)}</div></div></section>

    <section className="section games-section page-width" id="games"><SectionHeading kicker="01 / PICK YOUR ARENA" title="Tournaments" intro="Follow every match live from here. Pick a tournament to see its fixtures, live scores, bracket and podium, updated the moment each result comes in."/>{tournaments.length ? <TournamentList tournaments={tournaments}/> : <p className="section-heading-intro">The first draws go up here as soon as they are published.</p>}<div className="section-end"><span>{sports.length} SPORTS / 16 MEDAL EVENTS</span></div></section>

  </main>;
}