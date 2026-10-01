import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ArrowUpRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading, Podium } from "@/components/championship/Sections";
import { brackets, fixtures, houseById, results, sports } from "@/data/mockData";
import carromImage from "@/assets/carrom-match.jpg";
import footballImage from "@/assets/championship-court.jpg";

export const Route = createFileRoute("/sports/$slug")({
  loader: ({ params }) => { const sport = sports.find(item => item.slug === params.slug); if (!sport) throw notFound(); return { sport }; },
  head: ({ loaderData }) => { const name = loaderData?.sport.name ?? "Sport"; return { meta: [
    { title: `${name} Tournament | Bright Battle Royale 2026` }, { name: "description", content: `Follow ${name} fixtures, tournament brackets, results and podiums at Bright Battle Royale 2026.` },
    { property: "og:title", content: `${name} Tournament | Bright Battle Royale 2026` }, { property: "og:description", content: `${name} fixtures, brackets, results and podiums.` },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }; }, component: SportPage,
});

function SportPage() {
  const { sport } = Route.useLoaderData();
  const [event, setEvent] = useState(sport.events[0] ?? "Final");
  const [view, setView] = useState<"fixtures" | "bracket" | "results" | "podium">("fixtures");
  const activeFixtures = (fixtures[sport.slug] ?? []).filter(fixture => fixture.event === event);
  const activeResults = results.filter(result => result.sportSlug === sport.slug && (sport.events.length === 1 || result.event.toLowerCase().includes(event.toLowerCase())));
  const image = ["carrom", "table-tennis", "chess", "foosball", "darts"].includes(sport.slug) ? carromImage : footballImage;
  return <main>
    <section className="sport-intro"><div className="page-width sport-intro-grid"><div className="sport-intro-copy"><Link to="/sports" className="back-link"><ArrowLeft size={17}/> ALL SPORTS</Link><div className="eyebrow light"><span className="eyebrow-line"/> THE GAMES / 2026</div><h1>{sport.name}<span>.</span></h1><div className="sport-intro-facts"><div><span>DATE</span><strong>{sport.date}</strong></div><div><span>VENUE</span><strong>{sport.venue}</strong></div><div><span>MEDAL EVENTS</span><strong>{sport.events.length.toString().padStart(2, "0")}</strong></div></div></div><div className="sport-intro-image"><img src={image} alt={`${sport.name} tournament atmosphere`} width={1408} height={912}/></div></div></section>
    <section className="section page-width sport-content"><SectionHeading kicker="01 / TOURNAMENT CENTRE" title="THE COMPETITION" aside={`${sport.date} / ${sport.venue}`}/>
      {sport.events.length > 1 && <div className="event-tabs" role="tablist" aria-label="Medal event">{sport.events.map(item => <Button key={item} variant="ghost" role="tab" aria-selected={event === item} className={event === item ? "event-tab active" : "event-tab"} onClick={() => { setEvent(item); setView("fixtures"); }}>{item}</Button>)}</div>}
      <div className="view-tabs" role="tablist" aria-label="Tournament information">{(["fixtures", "bracket", "results", "podium"] as const).map(item => <Button key={item} variant="ghost" role="tab" aria-selected={view === item} className={view === item ? "view-tab active" : "view-tab"} onClick={() => setView(item)}>{item}</Button>)}</div>
      {view === "fixtures" && <div className="fixtures-panel"><div className="panel-label"><span>MATCHES / {event.toUpperCase()}</span><span>{activeFixtures.length} FIXTURES</span></div>{activeFixtures.map(fixture => <article className="fixture-row" key={fixture.id}><div className="fixture-detail"><span>{fixture.round}</span><strong>{fixture.date}</strong></div><div className="fixture-teams"><span>{houseById(fixture.home)}</span><em>VS</em><span>{houseById(fixture.away)}</span></div><span className="fixture-status">{fixture.status === "upcoming" ? "UPCOMING" : `${fixture.homeScore} — ${fixture.awayScore}`}</span></article>)}</div>}
      {view === "bracket" && <div className="bracket-scroll" aria-label="Tournament bracket"><div className="bracket-grid">{(brackets[sport.slug] ?? []).map(round => <div className="bracket-round" key={round.round}><div className="panel-label">{round.round.toUpperCase()}</div>{round.matches.map(match => <div className="bracket-match" key={match}><span>{match}</span><ArrowUpRight size={19}/></div>)}</div>)}<div className="bracket-round"><div className="panel-label">PODIUM</div><div className="bracket-match"><span>To be decided</span><span className="medal-dot gold"/></div></div></div></div>}
      {view === "results" && <div className="tournament-results">{activeResults.length ? activeResults.map(result => <article key={result.event}><div className="panel-label">{result.date} / FINAL RESULT</div><h3>{result.event}</h3><Podium result={result}/></article>) : <EmptyState title="NO RESULTS YET" body="Results will appear here after the final whistle."/>}</div>}
      {view === "podium" && <div className="tournament-results">{activeResults.length ? activeResults.map(result => <article key={result.event}><div className="panel-label">{result.event.toUpperCase()} / PODIUM</div><Podium result={result}/></article>) : <EmptyState title="THE PODIUM AWAITS" body="Gold, silver and bronze will be decided on game day."/>}</div>}
    </section>
    <section className="sport-more page-width"><Link to="/sports" className="text-arrow">EXPLORE ALL SPORTS <ArrowUpRight size={20}/></Link><Link to="/schedule" className="text-arrow">FULL SCHEDULE <ArrowUpRight size={20}/></Link></section>
  </main>;
}

function EmptyState({ title, body }: { title: string; body: string }) { return <div className="empty-state"><MapPin size={25}/><h3>{title}</h3><p>{body}</p></div>; }