import { createFileRoute } from "@tanstack/react-router";
import { SectionHeading, SportsList } from "@/components/championship/Sections";

export const Route = createFileRoute("/sports/")({
  head: () => ({ meta: [
    { title: "The Games | Bright Battle Royale 2026" }, { name: "description", content: "Explore all eleven Bright Battle Royale sports, tournament fixtures, brackets, results and podiums." },
    { property: "og:title", content: "The Games | Bright Battle Royale 2026" }, { property: "og:description", content: "Eleven sports. Sixteen medal events. Find your game." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }), component: SportsPage,
});

function SportsPage() { return <main><section className="interior-intro page-width"><div className="eyebrow"><span className="eyebrow-line"/> ELEVEN SPORTS / ONE CHAMPION</div><h1>THE<br/><em>GAMES.</em></h1><div className="interior-subline"><p>Every arena has its own story. Find yours.</p><span>16 MEDAL EVENTS / 04 HOUSES</span></div></section><section className="section page-width"><SectionHeading kicker="01 / CHOOSE YOUR ARENA" title="ALL SPORTS"/><SportsList/></section></main>; }