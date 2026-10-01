import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { Podium, SectionHeading, Standings } from "@/components/championship/Sections";
import { results, scoring } from "@/data/mockData";

export const Route = createFileRoute("/points")({
  head: () => ({ meta: [
    { title: "Points Table | Bright Battle Royale 2026" }, { name: "description", content: "Follow all four houses, medal counts, points gaps and event results at Bright Battle Royale 2026." },
    { property: "og:title", content: "Points Table | Bright Battle Royale 2026" }, { property: "og:description", content: "The championship standings, medals and event-by-event results." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }), component: PointsPage,
});

function PointsPage() { return <main><section className="interior-intro page-width"><div className="eyebrow"><span className="eyebrow-line"/> THE CHAMPIONSHIP / 2026</div><h1>POINTS<br/><em>TABLE.</em></h1><div className="interior-subline"><p>Every podium changes the picture. Here’s where the houses stand.</p><span>04 HOUSES / 16 MEDAL EVENTS</span></div></section>
  <section className="section page-width"><SectionHeading kicker="01 / THE LEADERBOARD" title="THE CURRENT ORDER"/><Standings/><div className="scoring-note"><strong>HOW POINTS WORK</strong><span>GOLD <b>{scoring.gold}</b></span><span>SILVER <b>{scoring.silver}</b></span><span>BRONZE <b>{scoring.bronze}</b></span><span>{scoring.totalPossible} TOTAL POSSIBLE POINTS</span></div></section>
  <section className="schedule-band"><div className="page-width"><SectionHeading kicker="02 / MEDAL EVENTS" title="EVENT BY EVENT" aside="The podiums behind the points."/><div className="event-results">{results.map(result => <article key={result.event} className="event-result"><div className="event-result-header"><div><span>{result.date} / COMPLETE</span><h3>{result.event}</h3></div><Link to="/sports/$slug" params={{ slug: result.sportSlug }} className="circle-link" aria-label={`View ${result.event}`}><ArrowUpRight size={20}/></Link></div><Podium result={result}/></article>)}</div></div></section>
</main>; }