import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { houseRoster } from "@/data/event";
import battleRoyaleLogo from "@/assets/battle-royale-logo.webp";
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
    {/* The hero banner: crest on the left, the promise beside it, the four houses down the right edge. */}
    <section className="hero-banner">
      <div className="page-width hero-inner">
        <div className="hero-top"><span className="hero-presents">Bright Money presents</span><span className="hero-motto">Play / Compete / <b>Win</b></span></div>
        <div className="hero-main">
          <h1 className="sr-only">Bright Battle Royale 2026</h1>
          <img src={battleRoyaleLogo} alt="" width={640} height={579} className="hero-logo"/>
          <p className="hero-tagline">Four houses.<br/>Eleven sports.<br/><em>One champion.</em></p>
          <ul className="hero-houses" aria-label="The four houses">{houseRoster.map((house) => <li key={house.id}><img src={house.logo} alt={house.name} title={house.name} width={96} height={96} loading="lazy"/></li>)}</ul>
        </div>
        <div className="hero-dates"><span>06 — 17 October 2026</span><span>Bright Money · India</span></div>
      </div>
    </section>

    <section className="section games-section page-width" id="games"><SectionHeading title="Tournaments" intro="Live brackets, scores and podiums, updated the moment each result comes in."/>{tournaments.length ? <TournamentList tournaments={tournaments}/> : <p className="section-heading-intro">The first draws go up here as soon as they are published.</p>}</section>

  </main>;
}