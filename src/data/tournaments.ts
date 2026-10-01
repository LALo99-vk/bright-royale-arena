/**
 * Shared shapes for tournament data. These match the InMobi site's types so the
 * bracket (and later the sheet parser) can be reused unchanged.
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
