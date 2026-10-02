import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { ArrowLeft, ArrowUpRight, Camera, Play, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EventWinners, NothingDecided } from "@/components/event-winners";
import { Bracket } from "@/components/bracket";
import { RaceBoard } from "@/components/race-board";
import { VideoCard } from "@/components/video-card";
import { getTournamentPage } from "@/lib/tournament-data";
import { freshness } from "@/lib/freshness";
import { RefreshButton } from "@/components/championship/RefreshButton";
import { LIVE_REFRESH_MS, useAutoRefresh } from "@/hooks/use-auto-refresh";

export const Route = createFileRoute("/tournaments/$slug")({
  loader: async ({ params }) => {
    const data = await getTournamentPage({ data: { slug: params.slug, atLeast: freshness() } });
    // Not on the Tournaments tab, or still marked hidden there.
    if (!data) throw notFound();
    return data;
  },
  head: ({ loaderData }) => { const name = loaderData?.tournament.name ?? "Tournament"; return { meta: [
    { title: `${name} | Bright Battle Royale 2026` }, { name: "description", content: `Follow ${name} fixtures, the live bracket, results and podium at Bright Battle Royale 2026.` },
    { property: "og:title", content: `${name} | Bright Battle Royale 2026` }, { property: "og:description", content: `${name} fixtures, bracket, results and podium.` },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }; }, component: TournamentPage,
});

const TABS = ["Details", "Matches", "Gallery", "Videos", "Winners"] as const;
type Tab = (typeof TABS)[number];

function TournamentPage() {
  const { tournament: t, sport, winners, teams, rules, fetchedAt } = Route.useLoaderData();
  useAutoRefresh(LIVE_REFRESH_MS);
  const [tab, setTab] = useState<Tab>("Details");
  const isRace = Boolean(t.race?.length) || sport?.kind === "race";
  return <main>
    <section className="sport-intro"><div className="page-width sport-intro-grid"><div className="sport-intro-copy"><Link to="/" hash="games" className="back-link"><ArrowLeft size={17}/> ALL TOURNAMENTS</Link><div className="eyebrow light">THE GAMES / 2026</div><h1>{t.name}<span>.</span></h1></div></div></section>

    <div className="sport-tabs-bar"><div className="page-width view-tabs" role="tablist" aria-label="Tournament sections">{TABS.map(item => <Button key={item} variant="ghost" role="tab" aria-selected={tab === item} className={tab === item ? "view-tab active" : "view-tab"} onClick={() => setTab(item)}>{item}</Button>)}<RefreshButton fetchedAt={fetchedAt} className="ml-auto pl-4"/></div></div>

    <section className="page-width sport-content">
      {tab === "Details" && <div className="sport-details">
        <div>
          <h2 className="panel-heading">About the tournament</h2>
          <p className="sport-about">{t.about || `${t.name} is one of sixteen medal events at Bright Battle Royale 2026. All four houses compete, and the podium is worth 50 points to the house table.`}</p>
          <dl className="sport-info">
            <div><dt>Format</dt><dd>{t.format || (isRace ? "Heats to a final" : "Knockout")}</dd></div>
            <div><dt>Field</dt><dd>{t.teams || "All four houses"}</dd></div>
            <div><dt>Sport</dt><dd>{sport?.name ?? t.sport}</dd></div>
            <div><dt>Points</dt><dd>Gold 25 · Silver 15 · Bronze 10</dd></div>
          </dl>
        </div>
        <aside className="sport-glance">
          <p className="panel-label">At a glance</p>
          <dl>
            <div><dt>Date</dt><dd>{t.dates || sport?.date || "To be announced"}</dd></div>
            <div><dt>Time</dt><dd>{t.time || "To be announced"}</dd></div>
            <div><dt>Venue</dt><dd>{t.venue || sport?.venue || "To be confirmed"}</dd></div>
          </dl>
        </aside>
      </div>}
      {tab === "Details" && rules.length > 0 && <section className="mt-14 border-t border-border pt-10">
        <h2 className="panel-heading">Rules</h2>
        <p className="mt-3 text-sm text-muted-foreground">A short summary of the official tournament rules.</p>
        <dl className="mt-8 grid gap-x-12 gap-y-6 sm:grid-cols-2">{rules.map(rule => <div key={rule.section} className="border-t border-border pt-4"><dt className="eyebrow text-muted-foreground">{rule.section}</dt><dd className="mt-2 text-sm leading-relaxed">{rule.text}</dd></div>)}</dl>
      </section>}

      {tab === "Matches" && (t.race?.length ? <RaceBoard rounds={t.race}/>
        : t.rounds.length ? <Bracket rounds={t.rounds} kind={t.participants} courtLabel={t.courtLabel ?? "Board"} title={t.name}/>
        : <EmptyState icon={<Trophy size={25}/>} title="The draw is on its way" body="The bracket appears here once the draw is made."/>)}

      {tab === "Gallery" && (t.gallery.length ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{t.gallery.map((g, i) => <figure key={g.src} className={i === 0 ? "overflow-hidden sm:col-span-2 sm:row-span-2" : "overflow-hidden"}><img src={g.src} alt="" loading="lazy" width={1280} height={960} className={i === 0 ? "h-72 w-full object-cover sm:h-[33rem]" : "h-56 w-full object-cover"}/></figure>)}</div>
        : <EmptyState icon={<Camera size={25}/>} title="Photos are on their way" body="Check back after game day."/>)}
      {tab === "Videos" && (t.videos.length ? <div className="grid grid-cols-2 items-start gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">{t.videos.map(v => <VideoCard key={v.id} video={v}/>)}</div>
        : <EmptyState icon={<Play size={25}/>} title="Videos are on their way" body="Check back after game day."/>)}

      {tab === "Winners" && <section>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="rule-spot font-display text-2xl font-extrabold sm:text-3xl">Winners</h2>
          <Link to="/points" className="text-xs text-muted-foreground transition-colors hover:text-spot">See the full standings</Link>
        </div>
        <div className="mt-10">{winners ? <EventWinners sport={winners} teams={teams}/> : <NothingDecided sport={t.name}/>}</div>
      </section>}
    </section>

    <section className="sport-more page-width"><Link to="/" hash="games" className="text-arrow">ALL TOURNAMENTS <ArrowUpRight size={20}/></Link><Link to="/schedule" className="text-arrow">FULL SCHEDULE <ArrowUpRight size={20}/></Link></section>
  </main>;
}

function EmptyState({ icon, title, body }: { icon: ReactNode; title: string; body: string }) { return <div className="empty-state">{icon}<h3>{title}</h3><p>{body}</p></div>; }
