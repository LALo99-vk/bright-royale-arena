/**
 * The points page's view of the standings.
 *
 * The sheet's Results tab is the source of truth (see `lib/sheets/points.ts`);
 * this lays its events over the sport catalogue in `data/event.ts`, so all 21
 * medal events are listed — the ones not played yet as pending — in the order
 * the site shows the sports.
 *
 * A Results row that matches no catalogue event is still counted, under a row
 * of its own, so the house totals here always equal the sheet's.
 */
import { houseRoster, scoring, sports, type HouseId, type Medal, type Sport } from "@/data/event";
import type { EventResult, PointsTable } from "@/data/tournaments";

export const MEDALS: Medal[] = ["gold", "silver", "bronze"];
export const EVENT_POOL = scoring.gold + scoring.silver + scoring.bronze;

export type House = (typeof houseRoster)[number];
export type EventPoints = {
  name: string;
  label: string;
  status: "pending" | "partial" | "complete";
  podium: Partial<Record<Medal, HouseId>>;
  /** Player names per medal, from the Winners tab. Empty for team sports. */
  winners: Partial<Record<Medal, string[]>>;
  awarded: number;
};
export type SportPoints = {
  /** Empty for a Results row the catalogue doesn't know — it has no page. */
  slug: string;
  name: string;
  events: EventPoints[];
  points: Record<HouseId, number>;
  awarded: number;
  pool: number;
  status: "pending" | "partial" | "complete";
};
export type Standing = { house: House; total: number; gold: number; silver: number; bronze: number; rank: number; tied: boolean };

const zero = (): Record<HouseId, number> => ({ a: 0, b: 0, c: 0, d: 0 });

const idByCode = new Map(houseRoster.map((house) => [house.code, house.id]));

const norm = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, "");

/** "Men's Singles" -> "men single": punctuation, case, order and plurals don't matter. */
const FILLER = new Set(["open", "event", "category", "final"]);
export const eventKey = (value: string) =>
  value
    .toLowerCase()
    .replace(/'/g, "")
    .split(/[^a-z0-9]+/)
    .filter((word) => word && !FILLER.has(word))
    .map((word) => word.replace(/s$/, ""))
    .sort()
    .join(" ");

/** "Dart" or "Darts", "100m" or "100m Sprint", "Table Tennis" or "table-tennis". */
export function sameSport(sheetSport: string, sport: { slug: string; name: string }) {
  const a = norm(sheetSport);
  if (!a) return false;
  return [norm(sport.name), norm(sport.slug)].some(
    (b) => a === b || (Math.min(a.length, b.length) >= 4 && (a.startsWith(b) || b.startsWith(a))),
  );
}

/** "Final" and "Heats" are stages, not medal events: those sports have one event. */
export function medalEventsOf(sport: Sport) {
  const named = sport.events.filter((e) => e !== "Final" && e !== "Heats");
  return named.length ? named.map((e) => ({ name: `${sport.name} ${e}`, label: e })) : [{ name: sport.name, label: "Final" }];
}

function toEvent(name: string, label: string, result: EventResult | undefined): EventPoints {
  const podium: EventPoints["podium"] = {};
  const winners: EventPoints["winners"] = {};
  for (const medal of result?.medals ?? []) {
    const id = medal.team ? idByCode.get(medal.team) : undefined;
    if (id) podium[medal.medal] = id;
    if (medal.winners?.length) winners[medal.medal] = medal.winners;
  }
  return { name, label, status: result?.status ?? "pending", podium, winners, awarded: result?.awarded ?? 0 };
}

function rollUp(name: string, slug: string, events: EventPoints[], results: (EventResult | undefined)[]): SportPoints {
  const points = zero();
  for (const result of results) {
    for (const medal of result?.medals ?? []) {
      const id = medal.team ? idByCode.get(medal.team) : undefined;
      if (id) points[id] += medal.points;
    }
  }
  const awarded = events.reduce((sum, e) => sum + e.awarded, 0);
  // An event with no Results row yet is still worth its 50.
  const pool = results.reduce((sum, r) => sum + (r?.pool || EVENT_POOL), 0);
  const status = events.every((e) => e.status === "pending") ? "pending" : events.every((e) => e.status === "complete") ? "complete" : "partial";
  return { slug, name, events, points, awarded, pool, status };
}

/** Every medal event, grouped by sport, scored from the sheet's Results tab. */
export function buildSportPoints(table: PointsTable): SportPoints[] {
  const unclaimed = table.sports.flatMap((sport) => sport.events);
  const take = (match: (result: EventResult) => boolean) => {
    const index = unclaimed.findIndex(match);
    return index === -1 ? undefined : unclaimed.splice(index, 1)[0];
  };

  const rows = sports.map((sport) => {
    const wanted = medalEventsOf(sport);
    const results = wanted.map(({ label }) =>
      take((r) => sameSport(r.sport, sport) && (wanted.length === 1 || eventKey(r.category) === eventKey(label))),
    );
    const events = wanted.map(({ name, label }, i) => toEvent(name, label, results[i]));
    return rollUp(sport.name, sport.slug, events, results);
  });

  // Rows the catalogue couldn't place: still points, so still on the table.
  const leftovers = new Map<string, EventResult[]>();
  for (const result of unclaimed) leftovers.set(result.sport, [...(leftovers.get(result.sport) ?? []), result]);
  for (const [sport, results] of leftovers) {
    const home = sports.find((s) => sameSport(sport, s));
    const events = results.map((r) => toEvent(`${sport} ${r.category}`.trim(), r.category || sport, r));
    rows.push(rollUp(sport, home?.slug ?? "", events, results));
  }

  return rows;
}

/** Ranked by points, then golds, silvers, bronzes. Exact ties share a rank. */
export function buildStandings(table: SportPoints[]): Standing[] {
  const rows = houseRoster.map((house) => {
    const row = { house, total: 0, gold: 0, silver: 0, bronze: 0, rank: 0, tied: false };
    for (const sport of table) {
      row.total += sport.points[house.id];
      for (const event of sport.events) for (const medal of MEDALS) if (event.podium[medal] === house.id) row[medal] += 1;
    }
    return row;
  });
  const compare = (x: Standing, y: Standing) => y.total - x.total || y.gold - x.gold || y.silver - x.silver || y.bronze - x.bronze;
  rows.sort(compare);
  rows.forEach((row, i) => {
    const prev = rows[i - 1];
    row.rank = prev && compare(prev, row) === 0 ? prev.rank : i + 1;
    row.tied = rows.some((other) => other !== row && other.total === row.total);
  });
  return rows;
}

/**
 * The Results-tab row for one catalogue event, in the sheet's own shape — what
 * the medal podium renders. Same matching as `buildSportPoints`.
 */
export function findEventResult(table: PointsTable, sport: Sport, label: string): EventResult | undefined {
  const wanted = medalEventsOf(sport);
  return table.sports
    .flatMap((s) => s.events)
    .find((r) => sameSport(r.sport, sport) && (wanted.length === 1 || eventKey(r.category) === eventKey(label)));
}
