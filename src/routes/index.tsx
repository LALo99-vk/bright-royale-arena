import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { houseRoster } from "@/data/event";
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

    {/* The four houses on the green band: label on the left, then the four crests. */}
    <section className="bg-mint-light" aria-label="The four houses"><div className="page-width flex flex-col items-center gap-4 py-5 sm:flex-row sm:justify-center sm:gap-12 sm:py-8"><span className="eyebrow text-center">Four houses</span><div className="grid w-full max-w-xs grid-cols-4 gap-3 sm:flex sm:w-auto sm:max-w-none sm:gap-8 lg:gap-10">{houseRoster.map((house, i) => <img key={house.id} src={house.logo} alt={house.name} title={house.name} width={192} height={192} loading="lazy" className="house-crest aspect-square w-full rounded-xl object-cover sm:size-20 sm:rounded-2xl lg:size-24" style={{ animationDelay: `${i * 90}ms`, boxShadow: `0 0 0 1px color-mix(in oklab, ${house.color} 60%, transparent), 0 10px 28px -14px ${house.color}` }}/>)}</div></div></section>

    <section className="section games-section page-width" id="games"><SectionHeading title="Tournaments" intro="Live brackets, scores and podiums, updated the moment each result comes in."/>{tournaments.length ? <TournamentList tournaments={tournaments}/> : <p className="section-heading-intro">The first draws go up here as soon as they are published.</p>}</section>

  </main>;
}