import { createFileRoute } from "@tanstack/react-router";
import { ScheduleList, SectionHeading } from "@/components/championship/Sections";

export const Route = createFileRoute("/schedule")({
  head: () => ({ meta: [
    { title: "Schedule | Bright Battle Royale 2026" }, { name: "description", content: "Every date, game and venue in the Bright Battle Royale 2026 championship schedule, from auction day to the finale." },
    { property: "og:title", content: "Schedule | Bright Battle Royale 2026" }, { property: "og:description", content: "Explore the full championship timeline from 06 to 17 October." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }), component: SchedulePage,
});

function SchedulePage() { return <main><section className="interior-intro page-width"><div className="eyebrow"><span className="eyebrow-line"/> THE CHAMPIONSHIP / 2026</div><h1>THE<br/><em>SCHEDULE.</em></h1><div className="interior-subline"><p>From the first strike to the final whistle.</p><span>06 — 17 OCTOBER 2026</span></div></section><section className="section page-width"><SectionHeading kicker="01 / THE TIMELINE" title="EVERY GAME. EVERY DAY."/><ScheduleList/></section></main>; }