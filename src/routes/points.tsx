import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { houseRoster, scoring, type HouseId, type Medal } from "@/data/event";
import { buildSportPoints, buildStandings, EVENT_POOL, MEDALS, type EventPoints, type SportPoints, type Standing } from "@/lib/points";
import { getPointsTable } from "@/lib/tournament-data";
import { freshness } from "@/lib/freshness";
import { RefreshButton } from "@/components/championship/RefreshButton";
import { LIVE_REFRESH_MS, useAutoRefresh } from "@/hooks/use-auto-refresh";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/points")({
  loader: () => getPointsTable({ data: { atLeast: freshness() } }),
  head: () => ({ meta: [
    { title: "Points Table | Bright Battle Royale 2026" }, { name: "description", content: "The overall standings for Bright Battle Royale 2026: every point scored by all four houses, across all eleven sports." },
    { property: "og:title", content: "Points Table | Bright Battle Royale 2026" }, { property: "og:description", content: "Live overall standings across every tournament of Bright Battle Royale 2026." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }), component: PointsPage,
});

const MEDAL_ICON: Record<Medal, string> = { gold: "🥇", silver: "🥈", bronze: "🥉" };
const MEDAL_LABEL: Record<Medal, string> = { gold: "Gold", silver: "Silver", bronze: "Bronze" };

function PointsPage() {
  const { points, eventSlugs, fetchedAt } = Route.useLoaderData();
  useAutoRefresh(LIVE_REFRESH_MS);
  const table = buildSportPoints(points);
  const standings = buildStandings(table);
  const leaderPoints = standings[0]?.total ?? 0;
  const awarded = table.reduce((sum, s) => sum + s.awarded, 0);
  const events = table.flatMap((s) => s.events);
  const decided = events.filter((e) => e.status === "complete").length;
  const started = awarded > 0;
  const leader = standings[0];

  return <main>
    {/* Header */}
    <section className="border-b border-border">
      <div className="page-width grid gap-6 py-8 sm:py-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] lg:items-end lg:gap-12">
        <div>
          <p className="eyebrow flex items-center gap-3">Overall standings</p>
          <h1 className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">Points table</h1>
          <p className="mt-3 max-w-md text-muted-foreground">Every event is worth {EVENT_POOL} points. Updated the moment each result comes in.</p>
          <RefreshButton fetchedAt={fetchedAt} className="mt-4"/>
        </div>
        <div className="rounded-2xl bg-mint-light p-5 sm:p-6">
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
            <Stat value={awarded} of={scoring.totalPossible} label="points awarded"/>
            <Stat value={decided} of={events.length} label="events decided"/>
            {leader && <div className="col-span-2 flex items-center gap-3 sm:col-span-1">
              <img src={leader.house.logo} alt="" className="size-10 shrink-0 rounded-lg object-cover" width={40} height={40}/>
              <div className="min-w-0">
                <p className="truncate font-display text-base font-extrabold leading-tight">{started ? leader.house.name : "—"}</p>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">{started ? "in the lead" : "no leader yet"}</p>
              </div>
            </div>}
          </div>
          <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-background" role="progressbar" aria-valuenow={awarded} aria-valuemin={0} aria-valuemax={scoring.totalPossible} aria-label="Points awarded so far">
            <div className="h-1.5 rounded-full bg-spot transition-[width] duration-700" style={{ width: `${(awarded / scoring.totalPossible) * 100}%` }}/>
          </div>
        </div>
      </div>
    </section>

    <div className="page-width py-10 sm:py-12">
      {/* Leaderboard */}
      <section>
        <h2 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">The standings</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {standings.map((entry) => <HouseCard key={entry.house.id} entry={entry} leaderPoints={leaderPoints} started={started}/>)}
        </div>
        <StandingsTable standings={standings} leaderPoints={leaderPoints} started={started}/>
      </section>

      {/* Sport by sport */}
      <section className="mt-16 sm:mt-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">Sport by sport</h2>
          <p className="text-xs text-muted-foreground">Select a sport for its events</p>
        </div>
        <BreakdownTable table={table} awarded={awarded} eventSlugs={eventSlugs}/>
      </section>

      <HowPointsWork/>
    </div>
  </main>;
}

function Stat({ value, of, label }: { value: number; of: number; label: string }) {
  return <div>
    <p className="font-display text-2xl font-extrabold tabular-nums sm:text-3xl">{value}<span className="text-base font-bold text-muted-foreground"> / {of}</span></p>
    <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
  </div>;
}

/* ------------------------------------------------------------------ *
 * Leaderboard
 * ------------------------------------------------------------------ */

function MedalLine({ entry, className }: { entry: Standing; className?: string }) {
  return <span className={cn("flex items-center gap-3 tabular-nums", className)}>
    {MEDALS.map((medal) => <span key={medal} className="flex items-center gap-1"><span aria-hidden>{MEDAL_ICON[medal]}</span><span className="sr-only">{MEDAL_LABEL[medal]}</span>{entry[medal]}</span>)}
  </span>;
}

function HouseCard({ entry, leaderPoints, started }: { entry: Standing; leaderPoints: number; started: boolean }) {
  const isLeader = started && entry.rank === 1;
  const behind = leaderPoints - entry.total;
  return (
    // A row on a phone, the full card from sm up.
    <article className={cn("relative flex items-center gap-4 rounded-xl border border-border bg-card px-4 py-3.5 transition-colors", "sm:flex-col sm:items-stretch sm:gap-0 sm:p-6", isLeader && "border-spot/60 bg-mint-light/60")}>
      <span className="absolute inset-x-0 top-0 h-1 rounded-t-xl" style={{ backgroundColor: entry.house.color }} aria-hidden/>
      <span className="w-6 shrink-0 font-display text-sm font-bold tabular-nums text-muted-foreground/70 sm:hidden">{started ? `#${entry.rank}` : "—"}</span>
      <img src={entry.house.logo} alt="" className="size-11 shrink-0 rounded-lg object-cover sm:order-2 sm:mt-4 sm:size-16 sm:self-start" width={64} height={64}/>
      <div className="hidden items-start justify-between gap-3 sm:order-1 sm:flex">
        <span className="font-display text-sm font-bold tabular-nums text-muted-foreground/70">{started ? `#${entry.rank}` : "—"}</span>
        {isLeader && <span className="eyebrow text-[0.62rem] text-spot">Leading</span>}
      </div>
      <div className="min-w-0 flex-1 sm:order-3 sm:flex-none">
        <h3 className="font-display text-base font-extrabold leading-tight sm:mt-4 sm:text-lg">{entry.house.name}</h3>
        <p className="hidden text-sm text-muted-foreground sm:block">{entry.house.code}</p>
        <MedalLine entry={entry} className="mt-1 text-xs sm:hidden"/>
      </div>
      <div className="shrink-0 text-right sm:order-4 sm:text-left">
        <p className="font-display text-2xl font-extrabold tabular-nums sm:mt-6 sm:text-4xl">{entry.total}</p>
        <p className="text-[0.6rem] uppercase tracking-wider text-muted-foreground sm:text-xs">points{started && entry.rank !== 1 && <span className="hidden sm:inline"> · {behind} behind</span>}</p>
      </div>
      <MedalLine entry={entry} className="hidden sm:order-5 sm:mt-4 sm:flex sm:border-t sm:border-border sm:pt-4 sm:text-sm"/>
    </article>
  );
}

function StandingsTable({ standings, leaderPoints, started }: { standings: Standing[]; leaderPoints: number; started: boolean }) {
  return <div className="mt-10 overflow-x-auto">
    <table className="w-full min-w-[34rem] border-collapse text-sm">
      <thead>
        <tr className="border-y border-border text-left">
          <th className="w-12 py-3 pr-3 font-medium text-muted-foreground">#</th>
          <th className="py-3 pr-4 font-medium text-muted-foreground">House</th>
          {MEDALS.map((medal) => <th key={medal} className="w-14 py-3 text-right font-medium text-muted-foreground"><span aria-hidden>{MEDAL_ICON[medal]}</span><span className="sr-only">{MEDAL_LABEL[medal]}</span></th>)}
          <th className="hidden px-6 py-3 font-medium text-muted-foreground md:table-cell">Against the leader</th>
          <th className="py-3 pl-4 text-right font-medium text-muted-foreground">Points</th>
        </tr>
      </thead>
      <tbody>
        {standings.map((entry) => {
          const share = leaderPoints > 0 ? (entry.total / leaderPoints) * 100 : 0;
          return <tr key={entry.house.id} className="border-b border-border">
            <td className="py-4 pr-3 font-display font-bold tabular-nums text-muted-foreground/70">{started ? entry.rank : "—"}</td>
            <td className="py-4 pr-4">
              <span className="flex items-center gap-3">
                <span className="h-8 w-1 shrink-0 rounded-full" style={{ backgroundColor: entry.house.color }} aria-hidden/>
                <span className="min-w-0">
                  <span className="block truncate font-display text-base font-bold">{entry.house.name}</span>
                  {started && entry.tied && <span className="block text-xs text-muted-foreground">Level on points — split on medals</span>}
                </span>
              </span>
            </td>
            {MEDALS.map((medal) => <td key={medal} className="py-4 text-right tabular-nums text-muted-foreground">{entry[medal]}</td>)}
            <td className="hidden px-6 py-4 md:table-cell"><span className="block h-2 w-full rounded-full bg-secondary"><span className="block h-2 rounded-full transition-[width] duration-500" style={{ width: `${share}%`, backgroundColor: entry.house.color }}/></span></td>
            <td className="py-4 pl-4 text-right font-display text-lg font-extrabold tabular-nums">{entry.total}</td>
          </tr>;
        })}
      </tbody>
    </table>
  </div>;
}

/* ------------------------------------------------------------------ *
 * Sport-by-sport breakdown
 * ------------------------------------------------------------------ */

function leadersOf(sport: SportPoints): Set<HouseId> {
  const best = Math.max(...Object.values(sport.points), 0);
  if (best <= 0) return new Set();
  return new Set((Object.keys(sport.points) as HouseId[]).filter((id) => sport.points[id] === best));
}

function BreakdownTable({ table, awarded, eventSlugs }: { table: SportPoints[]; awarded: number; eventSlugs: Record<string, string> }) {
  const [open, setOpen] = useState<string[]>([]);
  const toggle = (slug: string) => setOpen((current) => current.includes(slug) ? current.filter((s) => s !== slug) : [...current, slug]);
  const totalFor = (id: HouseId) => table.reduce((sum, s) => sum + s.points[id], 0);

  return <div className="mt-8 overflow-x-auto">
    <table className="w-full min-w-[44rem] border-collapse text-sm">
      <thead>
        <tr className="border-y border-border">
          <th className="py-3 pr-4 text-left font-medium text-muted-foreground">Sport</th>
          {houseRoster.map((house) => <th key={house.id} className="py-3 pl-4 text-right font-medium">
            <span className="flex items-center justify-end gap-2"><span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: house.color }} aria-hidden/><span className="hidden lg:inline">{house.name}</span><span className="lg:hidden">{house.code}</span></span>
          </th>)}
          <th className="w-32 py-3 pl-6 text-right font-medium text-muted-foreground">Awarded</th>
        </tr>
      </thead>
      {table.map((sport) => {
        const leaders = leadersOf(sport);
        const expanded = open.includes(sport.name);
        return <tbody key={sport.name}>
          <tr className={cn("border-b border-border", !expanded && "hover:bg-mint-light/50")}>
            <td className="py-4 pr-4">
              <button type="button" onClick={() => toggle(sport.name)} aria-expanded={expanded} className="flex items-center gap-2 text-left transition-colors hover:text-spot">
                <ChevronRight className={cn("size-4 shrink-0 text-muted-foreground transition-transform", expanded && "rotate-90")} aria-hidden/>
                <span><span className="block font-display text-base font-bold">{sport.name}</span><span className="block text-xs text-muted-foreground">{sport.events.length === 1 ? "1 event" : `${sport.events.length} events`}</span></span>
              </button>
            </td>
            {houseRoster.map((house) => {
              const value = sport.points[house.id];
              return <td key={house.id} className={cn("py-4 pl-4 text-right tabular-nums", value === 0 && "text-muted-foreground/50", leaders.has(house.id) && "font-display font-extrabold text-foreground")}>{value}</td>;
            })}
            <td className="py-4 pl-6 text-right"><AwardedCell sport={sport}/></td>
          </tr>
          {expanded && sport.events.map((event) => <EventRow key={event.name} event={event} slug={eventSlugs[event.name]}/>)}
        </tbody>;
      })}
      <tfoot>
        <tr className="border-b-2 border-foreground/80">
          <td className="py-4 pr-4 font-display text-base font-extrabold">Total</td>
          {houseRoster.map((house) => <td key={house.id} className="py-4 pl-4 text-right font-display text-lg font-extrabold tabular-nums">{totalFor(house.id)}</td>)}
          <td className="py-4 pl-6 text-right font-display text-lg font-extrabold tabular-nums">{awarded} / {scoring.totalPossible}</td>
        </tr>
      </tfoot>
    </table>
  </div>;
}

function AwardedCell({ sport }: { sport: SportPoints }) {
  if (sport.status === "pending") return <span className="text-xs uppercase tracking-wider text-muted-foreground/60">Not played</span>;
  return <span className="inline-flex flex-col items-end gap-1.5">
    <span className="tabular-nums text-muted-foreground">{sport.awarded} / {sport.pool}</span>
    <span className="block h-1 w-20 rounded-full bg-secondary"><span className="block h-1 rounded-full bg-spot transition-[width] duration-500" style={{ width: `${(sport.awarded / sport.pool) * 100}%` }}/></span>
  </span>;
}

function EventRow({ event, slug }: { event: EventPoints; slug: string | undefined }) {
  return <tr className="border-b border-border/60 bg-mint-light/40">
    <td className="py-3 pl-10 pr-4">{slug ? <Link to="/tournaments/$slug" params={{ slug }} className="text-sm transition-colors hover:text-spot">{event.label}</Link> : <span className="text-sm">{event.label}</span>}</td>
    <td colSpan={houseRoster.length} className="py-3 pl-4">
      {event.status === "pending" ? <span className="text-xs uppercase tracking-wider text-muted-foreground/60">Not played</span> :
        <span className="flex flex-wrap items-center gap-x-6 gap-y-2">
          {MEDALS.map((medal) => {
            const house = houseRoster.find((h) => h.id === event.podium[medal]);
            return <span key={medal} className="flex items-center gap-2 text-sm">
              <span aria-hidden>{MEDAL_ICON[medal]}</span><span className="sr-only">{MEDAL_LABEL[medal]}</span>
              {house ? <><span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: house.color }} aria-hidden/><span className="font-medium">{house.name}</span><span className="tabular-nums text-muted-foreground">+{scoring[medal]}</span></> : <span className="text-muted-foreground/60">To be decided</span>}
            </span>;
          })}
        </span>}
    </td>
    <td className="py-3 pl-6 text-right tabular-nums text-muted-foreground">{event.awarded} / {EVENT_POOL}</td>
  </tr>;
}

/* ------------------------------------------------------------------ *
 * The scoring system, in three lines
 * ------------------------------------------------------------------ */

function HowPointsWork() {
  return <section className="mt-16 border-t border-border pt-10 sm:mt-20">
    <h2 className="font-display text-lg font-extrabold tracking-tight">How points work</h2>
    <div className="mt-5 grid gap-x-10 gap-y-4 text-sm text-muted-foreground sm:grid-cols-3">
      <p><span className="font-semibold text-foreground">Every event is worth {EVENT_POOL} points</span>, {scoring.totalPossible} in total across 21 medal events. Badminton and carrom have four events, table tennis three, relay and the 100m two each (men's and women's), and every other sport one.</p>
      <p><span className="font-semibold text-foreground">Gold {scoring.gold}, silver {scoring.silver}, bronze {scoring.bronze}</span> in every event, whatever the sport or squad size. Chess counts as much as cricket.</p>
      <p><span className="font-semibold text-foreground">Points go to the house</span>, never the individual. Level on points is settled by gold medals, then silver, then bronze.</p>
    </div>
  </section>;
}
