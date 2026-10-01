export const scoring = { gold: 25, silver: 15, bronze: 10, totalPossible: 800 } as const;

export type HouseId = "a" | "b" | "c" | "d";
export type Medal = "gold" | "silver" | "bronze";

const unsortedHouses: { id: HouseId; name: string; points: number; medals: Record<Medal, number>; mark: string }[] = [
  { id: "a", name: "House A", points: 245, medals: { gold: 4, silver: 2, bronze: 1 }, mark: "A" },
  { id: "b", name: "House B", points: 221, medals: { gold: 3, silver: 3, bronze: 2 }, mark: "B" },
  { id: "c", name: "House C", points: 184, medals: { gold: 2, silver: 2, bronze: 3 }, mark: "C" },
  { id: "d", name: "House D", points: 150, medals: { gold: 1, silver: 2, bronze: 2 }, mark: "D" },
];
export const houses = unsortedHouses.sort((a, b) => b.points - a.points || b.medals.gold - a.medals.gold || b.medals.silver - a.medals.silver || b.medals.bronze - a.medals.bronze);

export type Sport = { slug: string; name: string; date: string; venue: string; events: string[]; kind: "knockout" | "race" };
export const sports: Sport[] = [
  { slug: "cricket", name: "Cricket", date: "17 OCT", venue: "St. John's Ground", events: ["Final"], kind: "knockout" },
  { slug: "football", name: "Football", date: "10 OCT", venue: "Venue to be confirmed", events: ["Final"], kind: "knockout" },
  { slug: "badminton", name: "Badminton", date: "10 OCT", venue: "Venue to be confirmed", events: ["Men's Singles", "Women's Singles", "Men's Doubles", "Mixed Doubles"], kind: "knockout" },
  { slug: "table-tennis", name: "Table Tennis", date: "08—09 OCT", venue: "Bright Money Office", events: ["Singles", "Doubles"], kind: "knockout" },
  { slug: "carrom", name: "Carrom", date: "06—07 OCT", venue: "Bright Money Office", events: ["Singles", "Doubles"], kind: "knockout" },
  { slug: "chess", name: "Chess", date: "13 OCT", venue: "Bright Money Office", events: ["Final"], kind: "knockout" },
  { slug: "foosball", name: "Foosball", date: "14 OCT", venue: "Bright Money Office", events: ["Final"], kind: "knockout" },
  { slug: "darts", name: "Darts", date: "15 OCT", venue: "Bright Money Office", events: ["Final"], kind: "knockout" },
  { slug: "relay", name: "Relay", date: "17 OCT", venue: "St. John's Ground", events: ["Final"], kind: "race" },
  { slug: "100m-sprint", name: "100m Sprint", date: "17 OCT", venue: "St. John's Ground", events: ["Heats", "Final"], kind: "race" },
  { slug: "tug-of-war", name: "Tug of War", date: "17 OCT", venue: "St. John's Ground", events: ["Final"], kind: "knockout" },
];

export const venues = ["Bright Money Office", "St. John's Ground", "Venue to be confirmed"];

export type ScheduleDay = { date: string; weekday: string; title: string; events: string[]; venue: string; finale?: boolean; sportSlug?: string };
export const schedule: ScheduleDay[] = [
  { date: "18 SEP", weekday: "FRI", title: "Auction Day", events: ["Squads drafted live"], venue: "Bright Money Office" },
  { date: "06 OCT", weekday: "TUE", title: "Carrom Singles", events: ["Carrom Singles"], venue: "Bright Money Office", sportSlug: "carrom" },
  { date: "07 OCT", weekday: "WED", title: "Carrom Doubles", events: ["Carrom Doubles"], venue: "Bright Money Office", sportSlug: "carrom" },
  { date: "08 OCT", weekday: "THU", title: "Table Tennis Singles", events: ["Table Tennis Singles"], venue: "Bright Money Office", sportSlug: "table-tennis" },
  { date: "09 OCT", weekday: "FRI", title: "Table Tennis Doubles", events: ["Table Tennis Doubles"], venue: "Bright Money Office", sportSlug: "table-tennis" },
  { date: "10 OCT", weekday: "SAT", title: "Football & Badminton", events: ["Football", "Badminton"], venue: "Venue to be confirmed", sportSlug: "football" },
  { date: "13 OCT", weekday: "TUE", title: "Chess", events: ["Chess"], venue: "Bright Money Office", sportSlug: "chess" },
  { date: "14 OCT", weekday: "WED", title: "Foosball", events: ["Foosball"], venue: "Bright Money Office", sportSlug: "foosball" },
  { date: "15 OCT", weekday: "THU", title: "Darts", events: ["Darts"], venue: "Bright Money Office", sportSlug: "darts" },
  { date: "17 OCT", weekday: "SAT", title: "Championship Finale", events: ["Cricket", "Relay", "100m Sprint", "Tug of War"], venue: "St. John's Ground", finale: true, sportSlug: "cricket" },
];

export const nextEvent = { sportSlug: "carrom", name: "Carrom Singles", startsAt: "2026-10-06T10:00:00+05:30", date: "06 OCT", venue: "Bright Money Office", time: "Time to be announced" };

export type Fixture = { id: string; event: string; round: string; home: HouseId; away: HouseId; date: string; status: "upcoming" | "completed"; homeScore?: number; awayScore?: number };
export const fixtures: Record<string, Fixture[]> = Object.fromEntries(sports.map((sport) => [sport.slug, sport.events.flatMap((event, index) => [
  { id: `${sport.slug}-${index}-1`, event, round: sport.kind === "race" ? "Heat 1" : "Semi-final 1", home: "a" as HouseId, away: "d" as HouseId, date: sport.date, status: "upcoming" as const },
  { id: `${sport.slug}-${index}-2`, event, round: sport.kind === "race" ? "Heat 2" : "Semi-final 2", home: "b" as HouseId, away: "c" as HouseId, date: sport.date, status: "upcoming" as const },
])])) as Record<string, Fixture[]>;

export const brackets: Record<string, { round: string; matches: string[] }[]> = Object.fromEntries(sports.map((sport) => [sport.slug, sport.kind === "race" ? [
  { round: "Heats", matches: ["Heat 1 · House A / House D", "Heat 2 · House B / House C"] },
  { round: "Final", matches: ["Qualifiers to be decided"] },
] : [
  { round: "Semi-finals", matches: ["House A vs House D", "House B vs House C"] },
  { round: "Final", matches: ["Winners to be decided"] },
]]));

export type Result = { sportSlug: string; event: string; date: string; podium: { gold: HouseId; silver: HouseId; bronze: HouseId } };
export const results: Result[] = [
  { sportSlug: "carrom", event: "Carrom Singles", date: "06 OCT", podium: { gold: "a", silver: "c", bronze: "b" } },
  { sportSlug: "table-tennis", event: "Table Tennis Singles", date: "08 OCT", podium: { gold: "b", silver: "a", bronze: "d" } },
  { sportSlug: "chess", event: "Chess", date: "13 OCT", podium: { gold: "a", silver: "b", bronze: "c" } },
];

export const players: { house: HouseId; name: string }[] = [
  { house: "a", name: "House A representative" }, { house: "b", name: "House B representative" },
  { house: "c", name: "House C representative" }, { house: "d", name: "House D representative" },
];

export const houseById = (id: HouseId) => houses.find((house) => house.id === id)?.name ?? "TBC";