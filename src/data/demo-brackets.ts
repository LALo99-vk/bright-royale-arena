/**
 * Dummy draws to preview the bracket before the sheet is connected.
 * Same shape the sheet parser will produce, so swapping them out is one line.
 */
import type { BracketMatch, BracketRound, BracketSlot, MatchStatus, ParticipantKind } from "@/data/tournaments";

type Side = [players: string[] | null, group?: string | undefined, score?: number | string | undefined, fromMatch?: number | undefined, source?: string | undefined];

function slot([players, group, score, fromMatch, source]: Side): BracketSlot {
  return { players, group, score, fromMatch, source: source ?? (fromMatch && !players ? `Winner Match ${fromMatch}` : undefined) };
}

function match(n: number, status: MatchStatus, time: string, court: string, a: Side, b: Side, winner?: "a" | "b"): BracketMatch {
  return { id: `m${n}`, matchNumber: n, status, time, court, a: slot(a), b: slot(b), winner: winner ?? null };
}

const ttSingles: BracketRound[] = [
  { name: "Round 1", matches: [
    match(1, "completed", "8 Oct · 10:00 AM", "Table 1", [["Arjun Rao"], "BB", 3], [["Kavya Iyer"], "SS", 1], "a"),
    match(2, "completed", "8 Oct · 10:00 AM", "Table 2", [["Rohan Mehta"], "WW", 1], [["Sneha Pillai"], "RR", 3], "b"),
    match(3, "completed", "8 Oct · 10:30 AM", "Table 1", [["Vikram Shetty"], "RR", 3], [["Aditya Nair"], "BB", 2], "a"),
    match(4, "completed", "8 Oct · 10:30 AM", "Table 2", [["Priya Menon"], "SS", 0], [["Karthik Reddy"], "WW", 3], "b"),
    match(5, "completed", "8 Oct · 11:00 AM", "Table 1", [["Nikhil Joshi"], "BB", 3], [["Ananya Das"], "WW", 0], "a"),
    match(6, "completed", "8 Oct · 11:00 AM", "Table 2", [["Siddharth Kulkarni"], "SS", 2], [["Meera Krishnan"], "RR", 3], "b"),
    match(7, "completed", "8 Oct · 11:30 AM", "Table 1", [["Rahul Bhat"], "WW", 3], [["Divya Hegde"], "BB", 1], "a"),
    match(8, "completed", "8 Oct · 11:30 AM", "Table 2", [["Farhan Sheikh"], "RR", 1], [["Ishaan Gupta"], "SS", 3], "b"),
  ] },
  { name: "Quarter-Finals", matches: [
    match(9, "completed", "8 Oct · 2:00 PM", "Table 1", [["Arjun Rao"], "BB", 3, 1], [["Sneha Pillai"], "RR", 2, 2], "a"),
    match(10, "completed", "8 Oct · 2:00 PM", "Table 2", [["Vikram Shetty"], "RR", 1, 3], [["Karthik Reddy"], "WW", 3, 4], "b"),
    match(11, "live", "8 Oct · 2:45 PM", "Table 1", [["Nikhil Joshi"], "BB", 2, 5], [["Meera Krishnan"], "RR", 1, 6]),
    match(12, "upcoming", "8 Oct · 2:45 PM", "Table 2", [["Rahul Bhat"], "WW", undefined, 7], [["Ishaan Gupta"], "SS", undefined, 8]),
  ] },
  { name: "Semi-Finals", matches: [
    match(13, "upcoming", "8 Oct · 4:00 PM", "Table 1", [["Arjun Rao"], "BB", undefined, 9], [["Karthik Reddy"], "WW", undefined, 10]),
    match(14, "upcoming", "8 Oct · 4:00 PM", "Table 2", [null, undefined, undefined, 11], [null, undefined, undefined, 12]),
  ] },
  { name: "Third Place", matches: [
    match(15, "upcoming", "8 Oct · 5:00 PM", "Table 2", [null, undefined, undefined, 13, "Loser Match 13"], [null, undefined, undefined, 14, "Loser Match 14"]),
  ] },
  { name: "Final", matches: [
    match(16, "upcoming", "8 Oct · 5:30 PM", "Table 1", [null, undefined, undefined, 13], [null, undefined, undefined, 14]),
  ] },
];

const ttDoubles: BracketRound[] = [
  { name: "Quarter-Finals", matches: [
    match(1, "completed", "9 Oct · 10:00 AM", "Table 1", [["Arjun Rao", "Divya Hegde"], "BB", 3], [["Rohan Mehta", "Ananya Das"], "WW", 1], "a"),
    match(2, "completed", "9 Oct · 10:00 AM", "Table 2", [["Sneha Pillai", "Farhan Sheikh"], "RR", 2], [["Kavya Iyer", "Priya Menon"], "SS", 3], "b"),
    match(3, "upcoming", "9 Oct · 10:45 AM", "Table 1", [["Karthik Reddy", "Rahul Bhat"], "WW"], [["Vikram Shetty", "Meera Krishnan"], "RR"]),
    match(4, "upcoming", "9 Oct · 10:45 AM", "Table 2", [["Ishaan Gupta", "Siddharth Kulkarni"], "SS"], [["Nikhil Joshi", "Aditya Nair"], "BB"]),
  ] },
  { name: "Semi-Finals", matches: [
    match(5, "upcoming", "9 Oct · 2:00 PM", "Table 1", [["Arjun Rao", "Divya Hegde"], "BB", undefined, 1], [["Kavya Iyer", "Priya Menon"], "SS", undefined, 2]),
    match(6, "upcoming", "9 Oct · 2:00 PM", "Table 2", [null, undefined, undefined, 3], [null, undefined, undefined, 4]),
  ] },
  { name: "Final", matches: [
    match(7, "upcoming", "9 Oct · 4:00 PM", "Table 1", [null, undefined, undefined, 5], [null, undefined, undefined, 6]),
  ] },
];

const cricket: BracketRound[] = [
  { name: "Semi-Finals", matches: [
    match(1, "completed", "17 Oct · 8:00 AM", "Ground A", [["Bulldozing Bulls"], "BB", "142/6"], [["Savage Sharks"], "SS", "128/9"], "a"),
    match(2, "live", "17 Oct · 8:00 AM", "Ground B", [["Wildfire Wolves"], "WW", "96/3"], [["Raging Ravens"], "RR", "131/7"]),
  ] },
  { name: "Third Place", matches: [
    match(3, "upcoming", "17 Oct · 12:00 PM", "Ground B", [null, undefined, undefined, 1, "Loser Match 1"], [null, undefined, undefined, 2, "Loser Match 2"]),
  ] },
  { name: "Final", matches: [
    match(4, "upcoming", "17 Oct · 3:00 PM", "Ground A", [["Bulldozing Bulls"], "BB", undefined, 1], [null, undefined, undefined, 2]),
  ] },
];

/** sport slug → event name → draw */
export const demoBrackets: Record<string, Record<string, { kind: ParticipantKind; rounds: BracketRound[] }>> = {
  cricket: { Final: { kind: "team", rounds: cricket } },
  "table-tennis": {
    Singles: { kind: "singles", rounds: ttSingles },
    Doubles: { kind: "doubles", rounds: ttDoubles },
  },
};
