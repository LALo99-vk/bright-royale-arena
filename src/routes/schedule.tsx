import { createFileRoute } from "@tanstack/react-router";
import { schedule } from "@/data/event";

export const Route = createFileRoute("/schedule")({
  head: () => ({ meta: [
    { title: "Event Schedule | Bright Battle Royale 2026" }, { name: "description", content: "When and where every tournament of Bright Battle Royale 2026 is played, 6–17 October 2026." },
    { property: "og:title", content: "Event Schedule | Bright Battle Royale 2026" }, { property: "og:description", content: "Dates, times and venues for every tournament." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }), component: SchedulePage,
});

function SchedulePage() {
  return <main>
    <section className="border-b border-border">
      <div className="page-width py-8 sm:py-10">
        <p className="eyebrow flex items-center gap-3">06 — 17 October 2026</p>
        <h1 className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">Event schedule</h1>
        <p className="mt-3 max-w-md text-muted-foreground">When and where every tournament is played. Open a tournament for its match-by-match fixtures.</p>
      </div>
    </section>
    <section className="section page-width">
      <div className="event-schedule">{schedule.filter(day => day.sportSlug).map(day => <div className="event-schedule-row" key={day.date}><div className="event-schedule-date"><strong>{day.date}</strong><span>{day.weekday}</span></div><strong className="event-schedule-sports">{day.events.join(" · ")}</strong><span>{day.time ?? "Time to be announced"}</span><span>{day.venue}</span></div>)}</div>
      <div className="section-end"><span>DETAILED SCHEDULES FOR EACH SPORT ARE ON THE SPORT PAGES</span></div>
    </section>
  </main>;
}
