import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { ArrowLeft, ArrowUpRight, Camera, Play, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Podium } from "@/components/championship/Sections";
import { results, sports } from "@/data/mockData";
import { demoBrackets } from "@/data/demo-brackets";
import { Bracket } from "@/components/bracket";

export const Route = createFileRoute("/sports/$slug")({
  loader: ({ params }) => { const sport = sports.find(item => item.slug === params.slug); if (!sport) throw notFound(); return { sport }; },
  head: ({ loaderData }) => { const name = loaderData?.sport.name ?? "Sport"; return { meta: [
    { title: `${name} Tournament | Bright Battle Royale 2026` }, { name: "description", content: `Follow ${name} fixtures, tournament brackets, results and podiums at Bright Battle Royale 2026.` },
    { property: "og:title", content: `${name} Tournament | Bright Battle Royale 2026` }, { property: "og:description", content: `${name} fixtures, brackets, results and podiums.` },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }; }, component: SportPage,
});

const TABS = ["Details", "Matches", "Gallery", "Videos", "Winners"] as const;
type Tab = (typeof TABS)[number];

function SportPage() {
  const { sport } = Route.useLoaderData();
  const [tab, setTab] = useState<Tab>("Details");
  const [event, setEvent] = useState(sport.events[0] ?? "Final");
  const draw = demoBrackets[sport.slug]?.[event] ?? (sport.events.length === 1 ? Object.values(demoBrackets[sport.slug] ?? {})[0] : undefined);
  const sportResults = results.filter(result => result.sportSlug === sport.slug);
  const medalEvents = sport.events.filter(e => e !== "Final" && e !== "Heats");
  return <main>
    <section className="sport-intro"><div className="page-width sport-intro-grid"><div className="sport-intro-copy"><Link to="/" hash="games" className="back-link"><ArrowLeft size={17}/> ALL TOURNAMENTS</Link><div className="eyebrow light">THE GAMES / 2026</div><h1>{sport.name}<span>.</span></h1></div></div></section>

    <div className="sport-tabs-bar"><div className="page-width view-tabs" role="tablist" aria-label="Tournament sections">{TABS.map(item => <Button key={item} variant="ghost" role="tab" aria-selected={tab === item} className={tab === item ? "view-tab active" : "view-tab"} onClick={() => setTab(item)}>{item}</Button>)}</div></div>

    <section className="page-width sport-content">
      {tab === "Details" && <div className="sport-details">
        <div>
          <h2 className="panel-heading">About the tournament</h2>
          <p className="sport-about">{sport.name} is one of eleven sports at Bright Battle Royale 2026. All four houses compete{medalEvents.length > 1 ? ` across ${medalEvents.length} medal events (${medalEvents.join(", ")})` : " for one set of medals"}, and every event is worth 50 points to the house table.</p>
          <dl className="sport-info">
            <div><dt>Format</dt><dd>{sport.kind === "race" ? "Heats to a final" : "Knockout"}</dd></div>
            <div><dt>Field</dt><dd>All four houses</dd></div>
            <div><dt>Medal events</dt><dd>{medalEvents.length || 1}</dd></div>
            <div><dt>Points</dt><dd>Gold 25 · Silver 15 · Bronze 10</dd></div>
          </dl>
        </div>
        <aside className="sport-glance">
          <p className="panel-label">At a glance</p>
          <dl>
            <div><dt>Date</dt><dd>{sport.date}</dd></div>
            <div><dt>Time</dt><dd>To be announced</dd></div>
            <div><dt>Venue</dt><dd>{sport.venue}</dd></div>
          </dl>
        </aside>
      </div>}

      {tab === "Matches" && <>
        {sport.events.length > 1 && <div className="event-tabs" role="tablist" aria-label="Medal event">{sport.events.map(item => <Button key={item} variant="ghost" role="tab" aria-selected={event === item} className={event === item ? "event-tab active" : "event-tab"} onClick={() => setEvent(item)}>{item}</Button>)}</div>}
        {draw ? <Bracket rounds={draw.rounds} kind={draw.kind} courtLabel="Table" title={`${sport.name} — ${event}`}/> : <EmptyState icon={<Trophy size={25}/>} title="The draw is on its way" body="The bracket appears here once the draw is made."/>}
      </>}

      {tab === "Gallery" && <EmptyState icon={<Camera size={25}/>} title="Photos are on their way" body="Check back after game day."/>}
      {tab === "Videos" && <EmptyState icon={<Play size={25}/>} title="Videos are on their way" body="Check back after game day."/>}

      {tab === "Winners" && <div className="tournament-results">{sportResults.length ? sportResults.map(result => <article key={result.event}><div className="panel-label">{result.date} / FINAL RESULT</div><h3>{result.event}</h3><Podium result={result}/></article>) : <EmptyState icon={<Trophy size={25}/>} title="The podium awaits" body="Gold, silver and bronze will be decided on game day."/>}</div>}
    </section>

    <section className="sport-more page-width"><Link to="/" hash="games" className="text-arrow">ALL TOURNAMENTS <ArrowUpRight size={20}/></Link><Link to="/schedule" className="text-arrow">FULL SCHEDULE <ArrowUpRight size={20}/></Link></section>
  </main>;
}

function EmptyState({ icon, title, body }: { icon: ReactNode; title: string; body: string }) { return <div className="empty-state">{icon}<h3>{title}</h3><p>{body}</p></div>; }