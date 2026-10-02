/**
 * Race tabs: heats, semi-finals and a final, one row per runner.
 *
 *   Race No | Round | Race   | Lane | Runner          | Place | Timing | DAY | Status
 *   1       | Heats | Heat 1 | 1    | Rahul Verma (RR)|   2   |        |     | Completed
 *   10      | Semis | Semi 1 | 2    | Race 1 - 1st    |       |        |     | Upcoming
 *
 * A later-round lane says "Race 1 - 1st" rather than a name — the race
 * equivalent of "Winner Match 1" — so it fills itself in once that race has a
 * place recorded. How many go through from a race is read off those
 * references, so the qualifying rule lives in the draw and nowhere else.
 */
import type { MatchStatus, Race, RaceEntry, RaceRound } from "@/data/tournaments";
import {
  extractGroupTag,
  fillDown,
  normalizeHeader,
  normalizeStatus,
  type ParseWarning,
  type SheetGrid,
} from "./parse";

type RaceField =
  "raceNo" | "round" | "race" | "lane" | "runner" | "place" | "timing" | "day" | "status";

const RACE_HEADERS: Record<RaceField, string[]> = {
  raceNo: ["raceno", "racenumber", "racenum", "no", "sno"],
  round: ["round", "stage"],
  race: ["race", "racename", "heat"],
  lane: ["lane", "laneno", "lanenumber"],
  runner: ["runner", "athlete", "name", "player", "participant"],
  place: ["place", "position", "finish", "rank", "result"],
  timing: ["timing", "time", "slot"],
  day: ["day", "date"],
  status: ["status", "state"],
};

function columnsOf(header: string[]) {
  const map: Partial<Record<RaceField, number>> = {};
  header.forEach((raw, index) => {
    const key = normalizeHeader(raw ?? "");
    if (!key) return;
    for (const [field, aliases] of Object.entries(RACE_HEADERS) as [RaceField, string[]][]) {
      if (map[field] === undefined && aliases.includes(key)) {
        map[field] = index;
        return;
      }
    }
  });
  return map;
}

/** A tab is a race when it has lanes and places rather than two sides. */
export function isRaceTab(header: string[] | undefined) {
  if (!header) return false;
  const map = columnsOf(header);
  return map.lane !== undefined && map.place !== undefined && map.runner !== undefined;
}

const ordinal = (n: number) => {
  const tail = n % 100 >= 11 && n % 100 <= 13 ? "th" : (["th", "st", "nd", "rd"][n % 10] ?? "th");
  return `${n}${tail}`;
};

/** "Race 3 - 1st", "Race 3 1st", "1st Race 3" -> { race: 3, place: 1 } */
function parseRef(value: string): { race: number; place: number } | null {
  const text = value.trim().toLowerCase();
  const after = text.match(/^race\s*(\d+)\s*[-–·:,]?\s*(\d+)\s*(?:st|nd|rd|th)?$/);
  if (after) return { race: Number(after[1]), place: Number(after[2]) };
  const before = text.match(/^(\d+)\s*(?:st|nd|rd|th)\s*(?:in\s*|of\s*)?race\s*(\d+)$/);
  if (before) return { race: Number(before[2]), place: Number(before[1]) };
  return null;
}

type Draft = {
  number: number;
  round: string;
  name: string;
  time: string;
  day: string;
  status: MatchStatus | null;
  entries: (RaceEntry & { ref?: { race: number; place: number } })[];
};

export function parseRaceTab(
  tab: string,
  grid: SheetGrid,
): { rounds: RaceRound[]; warnings: ParseWarning[] } {
  const warnings: ParseWarning[] = [];
  const header = grid[0] ?? [];
  const col = columnsOf(header);
  if (col.raceNo === undefined) {
    warnings.push({ tab, row: 1, message: 'Needs a "Race No" column numbering each race.' });
    return { rounds: [], warnings };
  }

  // Race details are often merged down a block of lanes; carry them down.
  const rows = fillDown(grid.slice(1), [col.raceNo, col.round, col.race, col.timing, col.day]);
  const read = (row: string[], field: RaceField) => {
    const i = col[field];
    return i === undefined ? "" : (row[i] ?? "").trim();
  };

  const drafts = new Map<number, Draft>();
  rows.forEach((row, i) => {
    const number = Number(read(row, "raceNo"));
    const runnerCell = read(row, "runner");
    // Notes under the draw have no race number and no lane.
    if (!Number.isInteger(number) || number <= 0 || !read(row, "lane")) return;

    const lane = Number(read(row, "lane"));
    if (!Number.isInteger(lane) || lane <= 0) {
      warnings.push({ tab, row: i + 2, message: `Lane "${read(row, "lane")}" is not a number.` });
      return;
    }

    let draft = drafts.get(number);
    if (!draft) {
      draft = {
        number,
        round: read(row, "round") || "Race",
        name: read(row, "race") || `Race ${number}`,
        time: read(row, "timing"),
        day: read(row, "day"),
        status: null,
        entries: [],
      };
      drafts.set(number, draft);
    }
    const status = normalizeStatus(read(row, "status"));
    if (status && (draft.status === null || draft.status === "upcoming")) draft.status = status;

    const placeRaw = read(row, "place");
    const place = placeRaw ? Number.parseInt(placeRaw, 10) : undefined;
    if (placeRaw && !(place && place > 0)) {
      warnings.push({
        tab,
        row: i + 2,
        message: `Place "${placeRaw}" is not a finishing position.`,
      });
    }

    const ref = parseRef(runnerCell);
    if (ref) {
      draft.entries.push({ lane, runner: null, ref, place: place || undefined });
    } else if (runnerCell) {
      const { name, group } = extractGroupTag(runnerCell);
      draft.entries.push({ lane, runner: name, group, place: place || undefined });
    }
    // An empty runner cell is an empty lane: nobody to show.
  });

  const races = [...drafts.values()].sort((a, b) => a.number - b.number);
  const byNumber = new Map(races.map((race) => [race.number, race]));

  // How many go through from each race: the deepest place anyone refers to.
  const advance = new Map<number, number>();
  for (const race of races) {
    for (const entry of race.entries) {
      if (!entry.ref) continue;
      if (!byNumber.has(entry.ref.race)) {
        warnings.push({
          tab,
          row: null,
          message: `${race.name} refers to Race ${entry.ref.race}, which isn't in the tab.`,
        });
        continue;
      }
      advance.set(entry.ref.race, Math.max(advance.get(entry.ref.race) ?? 0, entry.ref.place));
    }
  }

  // Resolve references in race order, so a final can read a semi that has
  // itself just been filled from the heats.
  for (const race of races) {
    for (const entry of race.entries) {
      if (!entry.ref) continue;
      const from = byNumber.get(entry.ref.race);
      if (!from) continue;
      entry.source = `${from.name} · ${ordinal(entry.ref.place)}`;
      const hit = from.entries.filter((e) => e.place === entry.ref!.place);
      if (hit.length > 1) {
        warnings.push({
          tab,
          row: null,
          message: `${from.name} has two runners in ${ordinal(entry.ref.place)} place.`,
        });
      }
      if (hit[0]?.runner) {
        entry.runner = hit[0].runner;
        entry.group = hit[0].group;
      }
    }
  }

  const rounds: RaceRound[] = [];
  for (const draft of races) {
    const final = normalizeHeader(draft.round) === "final" && !advance.has(draft.number);
    const placed = draft.entries.length > 0 && draft.entries.every((e) => e.place);
    const status: MatchStatus = draft.status ?? (placed ? "completed" : "upcoming");
    const race: Race = {
      number: draft.number,
      name: draft.name,
      status,
      time: draft.time,
      ...(draft.day ? { day: draft.day } : {}),
      advance: final ? 3 : (advance.get(draft.number) ?? 0),
      final,
      entries: draft.entries
        .map(({ ref: _ref, ...entry }) => entry)
        .sort((a, b) => a.lane - b.lane),
    };
    const round = rounds.find((r) => r.name === draft.round);
    if (round) round.races.push(race);
    else rounds.push({ name: draft.round, races: [race] });
  }

  return { rounds, warnings };
}

/** Everyone who runs in the first round — the size of the field. */
export function raceFieldSize(rounds: RaceRound[]) {
  return (
    rounds[0]?.races.reduce((sum, race) => sum + race.entries.filter((e) => e.runner).length, 0) ??
    0
  );
}
