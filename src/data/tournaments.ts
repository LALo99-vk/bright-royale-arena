/**
 * Shared shapes for tournament data. These match the InMobi site's types so the
 * bracket and the sheet parser are reused unchanged.
 */
export type MatchStatus = "upcoming" | "live" | "completed" | "cancelled" | "noshow";

/** How participants are shown in the bracket. */
export type ParticipantKind = "team" | "singles" | "doubles";

/** One of the four houses every player belongs to. */
export type Group = {
  /** Short code as written in the sheet, e.g. "BB". */
  code: string;
  name: string;
  color: string;
};

export const groups: Group[] = [
  { code: "BB", name: "Bulldozing Bulls", color: "#E0393E" },
  { code: "WW", name: "Wildfire Wolves", color: "#F07A1A" },
  { code: "RR", name: "Raging Ravens", color: "#E8B90C" },
  { code: "SS", name: "Savage Sharks", color: "#1F8FD1" },
];

export function getGroup(code: string | undefined | null) {
  if (!code) return undefined;
  return groups.find((g) => g.code === code);
}

/* ------------------------------------------------------------------ *
 * Event-wide points table
 * ------------------------------------------------------------------ */

export type Medal = "gold" | "silver" | "bronze";

/** The three places, in the order they are awarded and displayed. */
export const MEDALS: Medal[] = ["gold", "silver", "bronze"];

/** How much of a thing has been decided: none of it, some, or all. */
export type ScoringStatus = "pending" | "partial" | "complete";

/** One medal in one event: what it is worth, and who took it. */
export type EventMedal = {
  medal: Medal;
  /** Read from the sheet rather than hardcoded, so their values always win. */
  points: number;
  /** Group code of the winning house. Undefined until the sheet names one. */
  team?: string | undefined;
  /** Who actually won it, from the Winners tab. Empty for team sports. */
  winners?: string[] | undefined;
};

/** One of the 16 medal events — the unit points are awarded in. */
export type EventResult = {
  /** Sport as written in the sheet, e.g. "Table Tennis". */
  sport: string;
  /** "Open", "Men's Singles", "Doubles". */
  category: string;
  medals: EventMedal[];
  /** Points handed out so far — the medals that have a house against them. */
  awarded: number;
  /** Everything this event is worth: 50 at Bright. */
  pool: number;
  status: ScoringStatus;
};

/** One sport's contribution to the standings, and the events inside it. */
export type SportPoints = {
  sport: string;
  /** Set when the sport matches a tournament, so the row can link to it. */
  slug?: string | undefined;
  events: EventResult[];
  /** Points per house, keyed by group code. Summed from the events. */
  points: Record<string, number>;
  awarded: number;
  /** 50 per event: 200 for badminton, 100 for TT and carrom, 50 for the rest. */
  pool: number;
  status: ScoringStatus;
};

/** Medals won by one house. The tiebreaker when points are level. */
export type MedalCount = { gold: number; silver: number; bronze: number; total: number };

/** The whole standings page in one object, ready to render. */
export type PointsTable = {
  sports: SportPoints[];
  teams: Group[];
  /** Points per house, keyed by group code — never a hand-typed total. */
  totals: Record<string, number>;
  /** Medal counts per house, keyed by group code. */
  medals: Record<string, MedalCount>;
  awarded: number;
  /** Everything in play: 800. */
  pool: number;
  /** Events with all three medals decided. */
  eventsDecided: number;
  eventsTotal: number;
  /** True once a Results tab was found and read. */
  published: boolean;
};

export type BracketSlot = {
  /**
   * Team name (team sports), the player (singles) or both players (doubles).
   * `null` until the feeding match has been decided.
   */
  players: string[] | null;
  /** House code — only set for individual and doubles sports. */
  group?: string | undefined;
  /** Shown while `players` is null — mirrors the sheet's "Winner Match 1". */
  source?: string | undefined;
  /** Match number this slot is fed by, when the sheet said "Winner Match 3". */
  fromMatch?: number | undefined;
  /** This side is a bye — the sheet left no opponent here. */
  bye?: boolean | undefined;
  /** The player reached this slot on a bye rather than by winning. */
  viaBye?: boolean | undefined;
  score?: number | string | null | undefined;
};

export type BracketMatch = {
  id: string;
  /** Sequential across the whole tournament, as in the business sheet. */
  matchNumber: number;
  status: MatchStatus;
  time: string;
  court?: string | undefined;
  a: BracketSlot;
  b: BracketSlot;
  winner?: "a" | "b" | null | undefined;
};

export type BracketRound = {
  name: string;
  matches: BracketMatch[];
};

/** One lane of a race. Later rounds start as a reference and fill in. */
export type RaceEntry = {
  lane: number;
  /** `null` until the race it comes from has been run. */
  runner: string | null;
  group?: string | undefined;
  /** "Heat 3 · 1st" — where a later-round runner comes from. */
  source?: string | undefined;
  /** Finishing place, once the race has been run. */
  place?: number | undefined;
};

export type Race = {
  /** Sequential across the event, as in the sheet's Race No column. */
  number: number;
  /** "Heat 3", "Semi-final 1", "Final". */
  name: string;
  status: MatchStatus;
  time: string;
  day?: string | undefined;
  /** How many go through to the next round; 3 for a final (the medals). */
  advance: number;
  final: boolean;
  entries: RaceEntry[];
};

export type RaceRound = {
  name: string;
  races: Race[];
};

/**
 * One tab of the sheet: a single draw, e.g. Badminton Men's Singles. A sport
 * page on the site shows every tournament whose Sport column names it.
 */
export type Tournament = {
  slug: string;
  sport: string;
  name: string;
  tagline: string;
  dates: string;
  day: string;
  time: string;
  venue: string;
  venueNote: string;
  format: string;
  teams: string;
  image: string;
  accent: "ember" | "turf" | "sky" | "ink";
  participants: ParticipantKind;
  /** What the sheet calls the playing surface: "Board", "Court", "Table". */
  courtLabel?: string | undefined;
  about: string;
  info: { label: string; value: string }[];
  rules?: { section: string; text: string }[];
  rounds: BracketRound[];
  /** Heats to a final, for the races. Set instead of `rounds`. */
  race?: RaceRound[] | undefined;
  gallery: { src: string; caption: string }[];
  videos: {
    id: string;
    title: string;
    duration: string;
    /** Width over height — the card takes the clip's own shape. */
    aspect: number;
    poster: string;
    meta: string;
    shared: boolean;
  }[];
};

/**
 * Templates the sheet loader merges over, by slug. Empty at Bright: every
 * tournament comes from the sheet, and the sport catalogue in `data/event.ts`
 * supplies names, dates and venues until the Tournaments tab overrides them.
 */
export const tournaments: Tournament[] = [];
