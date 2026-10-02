/**
 * Heats to a final, for the races. Two views of the same draw:
 *
 * - List (the default): every race as a full card with every runner written out.
 * - Bracket: one compact row per race, lanes as house-coloured dots, rounds
 *   side by side. Nine heats fit on a screen; tap a race for the names.
 */
import { useState } from "react";
import { ChevronRight, LayoutList, Network } from "lucide-react";

import { getGroup, type Race, type RaceEntry, type RaceRound } from "@/data/tournaments";
import { cn } from "@/lib/utils";

const MEDAL = ["#C9A227", "#9AA3AE", "#B06A3B"];
const MEDAL_NAME = ["Gold", "Silver", "Bronze"];

const ordinal = (n: number) => {
  const tail = n % 100 >= 11 && n % 100 <= 13 ? "th" : (["th", "st", "nd", "rd"][n % 10] ?? "th");
  return `${n}${tail}`;
};

const isDone = (race: Race) => race.status === "completed";

/** Top N go through, or take a medal in the final. */
const qualifies = (race: Race, entry: RaceEntry) =>
  isDone(race) && entry.place !== undefined && entry.place <= race.advance;

const byPlace = (entries: RaceEntry[]) =>
  [...entries].sort((a, b) => (a.place ?? 99) - (b.place ?? 99) || a.lane - b.lane);

function roundStatus(round: RaceRound): Race["status"] {
  if (round.races.every(isDone)) return "completed";
  if (round.races.some((r) => r.status === "live" || isDone(r))) return "live";
  return "upcoming";
}

function StatusPill({ status, idle = "Upcoming" }: { status: Race["status"]; idle?: string }) {
  const base =
    "inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-[0.14em]";
  if (status === "live") {
    return (
      <span className={cn(base, "bg-live text-white")}>
        <span className="live-dot size-1.5 rounded-full bg-white" />
        Live
      </span>
    );
  }
  if (status === "completed") {
    return <span className={cn(base, "bg-turf/15 text-turf")}>Completed</span>;
  }
  if (status === "cancelled" || status === "noshow") {
    return <span className={cn(base, "bg-secondary text-muted-foreground")}>Cancelled</span>;
  }
  return <span className={cn(base, "bg-sky/10 text-sky")}>{idle}</span>;
}

/** A lane as a numbered dot in the runner's house colour. */
function LaneDot({
  race,
  entry,
  size = "sm",
}: {
  race: Race;
  entry: RaceEntry;
  size?: "sm" | "md" | undefined;
}) {
  const group = getGroup(entry.group);
  const done = isDone(race);
  const through = qualifies(race, entry);
  const label = entry.runner
    ? `Lane ${entry.lane}: ${entry.runner}${group ? ` (${group.code})` : ""}`
    : `Lane ${entry.lane}: ${entry.source ?? "to be decided"}`;

  return (
    <span
      title={label}
      aria-label={label}
      className={cn(
        "grid shrink-0 place-items-center rounded-full font-display font-extrabold tabular-nums",
        size === "sm" ? "size-[22px] text-[0.65rem]" : "size-7 text-xs",
        entry.runner
          ? "text-white"
          : "border-[1.5px] border-dashed border-muted-foreground/40 text-muted-foreground",
        done && !through && "opacity-35",
        through && "ring-2 ring-turf ring-offset-2 ring-offset-card",
      )}
      style={
        entry.runner ? { backgroundColor: group?.color ?? "var(--muted-foreground)" } : undefined
      }
    >
      {entry.lane}
    </span>
  );
}

/** Lanes stay on one line whatever the width: eight dots always fit. */
function LaneDots({ race, size }: { race: Race; size?: "sm" | "md" | undefined }) {
  return (
    <div className={cn("flex flex-nowrap items-center", size === "md" ? "gap-2" : "gap-1.5")}>
      {race.entries.map((entry) => (
        <LaneDot key={entry.lane} race={race} entry={entry} size={size} />
      ))}
    </div>
  );
}

function RunnerLine({ race, entry }: { race: Race; entry: RaceEntry }) {
  const group = getGroup(entry.group);
  const done = isDone(race) && entry.place !== undefined;
  const through = qualifies(race, entry);
  const medal = race.final && through && entry.place ? entry.place - 1 : -1;

  return (
    <li
      className={cn(
        "grid grid-cols-[2.5rem_22px_minmax(0,1fr)_auto] items-center gap-2.5 py-1.5 text-sm",
        done && !through && "text-muted-foreground",
      )}
    >
      <span className="font-display text-xs font-extrabold tabular-nums text-muted-foreground">
        {done ? ordinal(entry.place as number) : `L${entry.lane}`}
      </span>
      <LaneDot race={race} entry={entry} />
      <span className={cn("truncate", !entry.runner && "italic text-muted-foreground")}>
        {entry.runner ?? entry.source ?? "To be decided"}
        {entry.runner && group && (
          <span className="ml-1.5 text-[0.7rem] text-muted-foreground">{group.code}</span>
        )}
      </span>
      {medal >= 0 ? (
        <span
          className="grid size-5 place-items-center rounded-full font-display text-[0.6rem] font-black text-white"
          style={{ backgroundColor: MEDAL[medal] }}
          aria-label={MEDAL_NAME[medal]}
        >
          {entry.place}
        </span>
      ) : through ? (
        <span className="rounded bg-turf/15 px-1.5 py-0.5 font-display text-[0.6rem] font-extrabold text-turf">
          Q
        </span>
      ) : (
        <span />
      )}
    </li>
  );
}

function RunnerList({ race }: { race: Race }) {
  const list = isDone(race) ? byPlace(race.entries) : race.entries;
  return (
    <ol className="divide-y divide-dashed divide-border">
      {list.map((entry) => (
        <RunnerLine key={entry.lane} race={race} entry={entry} />
      ))}
    </ol>
  );
}

const railColor = (race: Race) =>
  race.status === "live" ? "var(--live)" : isDone(race) ? "var(--turf)" : "var(--sky)";

function when(race: Race) {
  return [race.day, race.time].filter(Boolean).join(" · ") || "Time TBC";
}

/* ------------------------------------------------------------------ *
 * Bracket view
 * ------------------------------------------------------------------ */

function CompactRace({ race, featured }: { race: Race; featured: boolean }) {
  const [open, setOpen] = useState(false);
  const qualifiers =
    isDone(race) && !race.final ? byPlace(race.entries).filter((e) => qualifies(race, e)) : [];

  return (
    <div
      className={cn(
        "rounded-md border border-border border-l-[3px] bg-card",
        race.status === "live" && "ring-1 ring-live",
      )}
      style={{ borderLeftColor: railColor(race) }}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={cn(
          "grid w-full grid-cols-[minmax(0,1fr)_auto_1rem] items-center gap-x-3 gap-y-2 text-left focus-visible:outline-2 focus-visible:outline-accent",
          featured ? "p-4" : "px-3 py-2.5",
        )}
      >
        <span className="truncate font-display text-sm font-extrabold">
          {race.name}
          <span className="ml-2 font-sans text-xs font-medium tabular-nums text-muted-foreground">
            {race.entries.length} runners · {when(race)}
          </span>
        </span>
        <StatusPill status={race.status} />
        <ChevronRight
          className={cn(
            "row-span-2 size-4 text-muted-foreground transition-transform",
            open && "rotate-90",
          )}
        />
        {/* A row of its own: eight dots fit the narrowest column without scrolling. */}
        <span className="col-span-2 min-w-0">
          <LaneDots race={race} size={featured ? "md" : "sm"} />
        </span>
        {qualifiers.length > 0 && (
          <span className="col-span-2 truncate text-xs text-muted-foreground">
            <b className="font-bold text-turf">Q</b>{" "}
            {qualifiers.map((e) => `${e.runner}${e.group ? ` ${e.group}` : ""}`).join(" · ")}
          </span>
        )}
        {featured && !isDone(race) && (
          <span className="col-span-2 text-xs font-semibold text-sky">
            {race.final ? "Top 3 take the medals" : `Top ${race.advance} → next round`}
          </span>
        )}
      </button>
      {open && (
        <div className="border-t border-dashed border-border px-3 pb-2 pt-1">
          <RunnerList race={race} />
        </div>
      )}
    </div>
  );
}

function Podium({ race }: { race: Race }) {
  const medals = byPlace(race.entries).filter((e) => qualifies(race, e));
  if (!medals.length) return null;
  return (
    <div className="mt-3 flex flex-col gap-2">
      {medals.map((e) => {
        const group = getGroup(e.group);
        const i = (e.place as number) - 1;
        return (
          <div key={e.lane} className="flex items-center gap-3 rounded-md bg-secondary px-3 py-2">
            <span
              className="grid size-7 shrink-0 place-items-center rounded-full font-display text-xs font-black text-white"
              style={{ backgroundColor: MEDAL[i] }}
            >
              {e.place}
            </span>
            <span className="min-w-0">
              <span className="block truncate font-display text-sm font-bold">{e.runner}</span>
              <span className="block text-xs text-muted-foreground">
                {group?.name ?? "No house"} · {MEDAL_NAME[i]}
              </span>
            </span>
          </div>
        );
      })}
    </div>
  );
}

/** "Top 2 from each heat (18 runners)" between two rounds. */
function Connector({ from }: { from: RaceRound }) {
  const each = from.races[0]?.advance ?? 0;
  const total = from.races.reduce((sum, race) => sum + race.advance, 0);
  const noun =
    from.races.length > 1
      ? `each ${from.name.toLowerCase().replace(/s$/, "")}`
      : from.name.toLowerCase();
  return (
    <div className="relative flex items-center py-3 lg:justify-center lg:py-0">
      <span
        aria-hidden
        className="absolute bottom-6 left-2 top-16 hidden w-3 rounded-r-lg border-[1.5px] border-l-0 border-border lg:block"
      />
      <span className="relative flex items-center gap-2 text-xs leading-snug text-muted-foreground lg:block lg:pl-8">
        Top {each} from {noun}
        <span className="lg:block"> ({total} runners)</span>
        <span className="text-base text-accent lg:mt-1 lg:block" aria-hidden>
          <span className="lg:hidden">↓</span>
          <span className="hidden lg:inline">→</span>
        </span>
      </span>
    </div>
  );
}

function BracketView({ rounds }: { rounds: RaceRound[] }) {
  const template = rounds
    .map((_, i) => (i === 0 ? "minmax(0,1.15fr)" : "5.5rem minmax(0,1fr)"))
    .join(" ");

  return (
    <div
      className="grid grid-cols-1 rounded-lg border border-border bg-card p-4 sm:p-5 lg:[grid-template-columns:var(--cols)]"
      style={{ "--cols": template } as React.CSSProperties}
    >
      {rounds.map((round, i) => {
        const status = roundStatus(round);
        const last = i === rounds.length - 1;
        const final = round.races.length === 1 && round.races[0]?.final;
        const size = round.races[0]?.entries.length ?? 0;
        return (
          <div key={round.name} className="contents">
            {i > 0 && <Connector from={rounds[i - 1] as RaceRound} />}
            <section className="flex min-w-0 flex-col">
              <header className="mb-3 flex min-h-[3.25rem] items-start justify-between gap-2">
                <div>
                  <h3 className="font-display text-lg font-extrabold">{round.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {round.races.length === 1
                      ? `1 race · ${size} runners`
                      : `${round.races.length} races · ${size} lanes each`}
                  </p>
                </div>
                <StatusPill status={status} idle={last ? "Not started" : "Upcoming"} />
              </header>
              <div
                className={cn("flex flex-1 flex-col gap-2", i > 0 && "lg:justify-around lg:gap-4")}
              >
                {round.races.map((race) => (
                  <CompactRace key={race.number} race={race} featured={i > 0} />
                ))}
              </div>
              {final && isDone(round.races[0] as Race) && <Podium race={round.races[0] as Race} />}
            </section>
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * List view
 * ------------------------------------------------------------------ */

function ListView({ rounds }: { rounds: RaceRound[] }) {
  return (
    <div className="flex flex-col gap-10">
      {rounds.map((round) => (
        <section key={round.name}>
          <h3 className="font-display text-xs font-extrabold uppercase tracking-[0.16em] text-muted-foreground">
            {round.name} · {round.races.length} race{round.races.length === 1 ? "" : "s"}
          </h3>
          <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {round.races.map((race) => (
              <article
                key={race.number}
                className={cn(
                  "overflow-hidden rounded-lg border border-border bg-card",
                  race.status === "live" && "ring-1 ring-live",
                )}
              >
                <header className="flex items-center justify-between gap-2 border-b border-border bg-secondary px-4 py-2.5">
                  <span className="font-display text-sm font-extrabold">
                    {race.name}
                    <span className="ml-2 font-sans text-xs font-medium text-muted-foreground">
                      {when(race)}
                    </span>
                  </span>
                  <StatusPill status={race.status} />
                </header>
                <div className="px-4 py-1.5">
                  <RunnerList race={race} />
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Progress
 * ------------------------------------------------------------------ */

function Progress({ rounds }: { rounds: RaceRound[] }) {
  const field = rounds[0]?.races.reduce((sum, r) => sum + r.entries.length, 0) ?? 0;
  const steps = [
    ...rounds.map((round, i) => ({
      label: round.name,
      detail: `${i === 0 ? field : round.races.reduce((sum, r) => sum + r.entries.length, 0)} runners`,
      status: roundStatus(round),
    })),
    {
      label: "Winners",
      detail: "3 medals",
      status: (rounds.at(-1)?.races.every(isDone) ? "completed" : "upcoming") as Race["status"],
    },
  ];
  const current = steps.findIndex((s) => s.status !== "completed");
  const counts = [
    field,
    ...rounds.slice(1).map((r) => r.races.reduce((s, x) => s + x.entries.length, 0)),
    3,
  ];

  return (
    <div className="mt-4 grid gap-4 rounded-lg border border-border bg-card px-5 py-4 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-center sm:gap-8">
      <div>
        <p className="font-display text-sm font-extrabold">Event progress</p>
        <p className="text-xs tabular-nums text-muted-foreground">{counts.join(" → ")}</p>
      </div>
      <ol
        className="grid"
        style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}
      >
        {steps.map((step, i) => {
          const done = step.status === "completed";
          const now = i === current;
          return (
            <li key={step.label} className="relative flex flex-col items-center gap-1 text-center">
              {i > 0 && (
                <span
                  aria-hidden
                  className={cn(
                    "absolute right-[calc(50%+16px)] left-[calc(-50%+16px)] top-3 h-0.5",
                    steps[i - 1]?.status === "completed" ? "bg-turf" : "bg-border",
                  )}
                />
              )}
              <span
                className={cn(
                  "grid size-6 place-items-center rounded-full border-2 bg-card text-xs",
                  done ? "border-turf bg-turf text-white" : now ? "border-sky" : "border-border",
                )}
              >
                {done ? "✓" : now ? <span className="size-2 rounded-full bg-sky" /> : null}
              </span>
              <span className="font-display text-xs font-bold">{step.label}</span>
              <span className="text-[0.7rem] text-muted-foreground">{step.detail}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Board
 * ------------------------------------------------------------------ */

export function RaceBoard({ rounds }: { rounds: RaceRound[] }) {
  const [view, setView] = useState<"bracket" | "list">("list");

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div
          className="inline-flex rounded-md border border-border bg-card p-1"
          role="group"
          aria-label="View"
        >
          {(
            [
              ["list", "List view", LayoutList],
              ["bracket", "Bracket view", Network],
            ] as const
          ).map(([key, label, Icon]) => (
            <button
              key={key}
              type="button"
              onClick={() => setView(key)}
              aria-pressed={view === key}
              className={cn(
                "inline-flex items-center gap-2 rounded px-3 py-1.5 text-sm font-semibold transition-colors",
                view === key
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="size-4" />
              {label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          {[
            ["var(--turf)", "Completed"],
            ["var(--sky)", "Upcoming"],
            ["var(--live)", "Live"],
          ].map(([color, label]) => (
            <span key={label} className="inline-flex items-center gap-1.5">
              <span className="size-2 rounded-full" style={{ backgroundColor: color }} />
              {label}
            </span>
          ))}
          {view === "bracket" && (
            <span>· Dot number = lane, colour = house. Tap a race for names.</span>
          )}
        </div>
      </div>

      <div className="mt-6">
        {view === "bracket" ? <BracketView rounds={rounds} /> : <ListView rounds={rounds} />}
      </div>
      {view === "bracket" && <Progress rounds={rounds} />}
    </div>
  );
}
