import { houseRoster, results, scoring, sports, type HouseId, type Medal } from "@/data/mockData";

export const MEDALS: Medal[] = ["gold", "silver", "bronze"];
export const EVENT_POOL = scoring.gold + scoring.silver + scoring.bronze;

export type House = (typeof houseRoster)[number];
export type EventPoints = { name: string; label: string; status: "pending" | "complete"; podium: Partial<Record<Medal, HouseId>>; awarded: number };
export type SportPoints = { slug: string; name: string; events: EventPoints[]; points: Record<HouseId, number>; awarded: number; pool: number; status: "pending" | "partial" | "complete" };
export type Standing = { house: House; total: number; gold: number; silver: number; bronze: number; rank: number; tied: boolean };

const zero = (): Record<HouseId, number> => ({ a: 0, b: 0, c: 0, d: 0 });

/** Every medal event, grouped by sport, scored from the results so far. */
export function buildSportPoints(): SportPoints[] {
  return sports.map((sport) => {
    // "Final" and "Heats + Final" are one medal event named after the sport;
    // everything else (Singles, Doubles…) is its own medal event.
    const named = sport.events.filter((e) => e !== "Final" && e !== "Heats");
    const names = named.length ? named.map((e) => ({ name: `${sport.name} ${e}`, label: e })) : [{ name: sport.name, label: "Final" }];
    const points = zero();
    const events = names.map(({ name, label }) => {
      const result = results.find((r) => r.event === name);
      if (!result) return { name, label, status: "pending" as const, podium: {}, awarded: 0 };
      for (const medal of MEDALS) points[result.podium[medal]] += scoring[medal];
      return { name, label, status: "complete" as const, podium: result.podium, awarded: EVENT_POOL };
    });
    const awarded = events.reduce((sum, e) => sum + e.awarded, 0);
    const pool = events.length * EVENT_POOL;
    return { slug: sport.slug, name: sport.name, events, points, awarded, pool, status: awarded === 0 ? "pending" : awarded === pool ? "complete" : "partial" };
  });
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
