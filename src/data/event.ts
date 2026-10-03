/**
 * The fixed facts of Bright Battle Royale 2026: the houses, the scoring, the
 * eleven sports and when they are played. Everything that changes during the
 * event — draws, scores, medals — comes from the Google Sheet instead.
 */
import bullsLogo from "@/assets/houses/bulldozing-bulls.jpg";
import wolvesLogo from "@/assets/houses/wildfire-wolves.jpg";
import ravensLogo from "@/assets/houses/raging-ravens.jpg";
import sharksLogo from "@/assets/houses/savage-sharks.jpg";

export const scoring = { gold: 25, silver: 15, bronze: 10, totalPossible: 1050 } as const;

export type HouseId = "a" | "b" | "c" | "d";
export type Medal = "gold" | "silver" | "bronze";

/** `code` is what the sheet's house columns resolve to (see `groups` in tournaments.ts). */
export const houseRoster: { id: HouseId; name: string; code: string; color: string; logo: string }[] = [
  { id: "a", name: "Bulldozing Bulls", code: "BB", color: "#E0393E", logo: bullsLogo },
  { id: "b", name: "Wildfire Wolves", code: "WW", color: "#F07A1A", logo: wolvesLogo },
  { id: "c", name: "Raging Ravens", code: "RR", color: "#E8B90C", logo: ravensLogo },
  { id: "d", name: "Savage Sharks", code: "SS", color: "#1F8FD1", logo: sharksLogo },
];

export const houseById = (id: HouseId) => houseRoster.find((house) => house.id === id)?.name ?? "TBC";

export type Sport = { slug: string; name: string; date: string; venue: string; events: string[]; kind: "knockout" | "race" };
export const sports: Sport[] = [
  { slug: "cricket", name: "Cricket", date: "17 OCT", venue: "St. John's Ground", events: ["Final"], kind: "knockout" },
  { slug: "football", name: "Football", date: "10 OCT", venue: "Venue to be confirmed", events: ["Final"], kind: "knockout" },
  { slug: "badminton", name: "Badminton", date: "10 OCT", venue: "Venue to be confirmed", events: ["Men's Singles", "Women's Singles", "Men's Doubles", "Mixed Doubles"], kind: "knockout" },
  { slug: "table-tennis", name: "Table Tennis", date: "08—09 OCT", venue: "Bright Money Office", events: ["Men's Singles", "Women's Singles", "Men's Doubles"], kind: "knockout" },
  { slug: "carrom", name: "Carrom", date: "06—07 OCT", venue: "Bright Money Office", events: ["Men's Singles", "Women's Singles", "Men's Doubles", "Women's Doubles"], kind: "knockout" },
  { slug: "chess", name: "Chess", date: "13 OCT", venue: "Bright Money Office", events: ["Final"], kind: "knockout" },
  { slug: "foosball", name: "Foosball", date: "14 OCT", venue: "Bright Money Office", events: ["Final"], kind: "knockout" },
  { slug: "darts", name: "Darts", date: "15 OCT", venue: "Bright Money Office", events: ["Final"], kind: "knockout" },
  { slug: "relay", name: "Relay", date: "17 OCT", venue: "St. John's Ground", events: ["Men's", "Women's"], kind: "race" },
  { slug: "100m-sprint", name: "100m Sprint", date: "17 OCT", venue: "St. John's Ground", events: ["Men's", "Women's"], kind: "race" },
  { slug: "tug-of-war", name: "Tug of War", date: "10 OCT", venue: "Venue to be confirmed", events: ["Final"], kind: "knockout" },
];

export type ScheduleDay = { date: string; weekday: string; title: string; events: string[]; venue: string; time?: string; finale?: boolean; sportSlug?: string };
export const schedule: ScheduleDay[] = [
  { date: "18 SEP", weekday: "FRI", title: "Auction Day", events: ["Squads drafted live"], venue: "Bright Money Office" },
  { date: "06 OCT", weekday: "TUE", title: "Carrom Singles", events: ["Carrom Men's Singles", "Carrom Women's Singles"], venue: "Bright Money Office", sportSlug: "carrom" },
  { date: "07 OCT", weekday: "WED", title: "Carrom Doubles", events: ["Carrom Men's Doubles", "Carrom Women's Doubles"], venue: "Bright Money Office", sportSlug: "carrom" },
  { date: "08 OCT", weekday: "THU", title: "Table Tennis Singles", events: ["Table Tennis Men's Singles", "Table Tennis Women's Singles"], venue: "Bright Money Office", sportSlug: "table-tennis" },
  { date: "09 OCT", weekday: "FRI", title: "Table Tennis Doubles", events: ["Table Tennis Men's Doubles"], venue: "Bright Money Office", sportSlug: "table-tennis" },
  { date: "10 OCT", weekday: "SAT", title: "Football, Badminton & Tug of War", events: ["Football", "Badminton", "Tug of War"], venue: "Venue to be confirmed", sportSlug: "football" },
  { date: "13 OCT", weekday: "TUE", title: "Chess", events: ["Chess"], venue: "Bright Money Office", sportSlug: "chess" },
  { date: "14 OCT", weekday: "WED", title: "Foosball", events: ["Foosball"], venue: "Bright Money Office", sportSlug: "foosball" },
  { date: "15 OCT", weekday: "THU", title: "Darts", events: ["Darts"], venue: "Bright Money Office", sportSlug: "darts" },
  { date: "17 OCT", weekday: "SAT", title: "Championship Finale", events: ["Cricket", "Relay", "100m Sprint"], venue: "St. John's Ground", finale: true, sportSlug: "cricket" },
];

export type Rule = { section: string; text: string };

/**
 * House rules per sport, summarised from the organisers' rulebook
 * ("Rules and Game Format — Carrom & Table Tennis"). Shown on every tournament
 * page of that sport; a sport with no entry shows no rules section at all.
 * `doubles` rules are added only on a doubles draw.
 */
export const sportRules: Record<string, { all: Rule[]; doubles?: Rule[] }> = {
  carrom: {
    all: [
      { section: "Match format", text: "Every match is two games. The player or team with the higher combined score across both games wins." },
      { section: "Scoring", text: "Each black or white coin is worth 1 point. The Queen is worth 3, once it is covered. Points from both games are added together." },
      { section: "Covering the Queen", text: "Pocket one of your own coins on the very next strike to cover the Queen. If you don't, the Queen goes back to the centre." },
      { section: "Pocketing the Queen early", text: "Pocketing the Queen before your first coin ends your turn and puts the Queen back in the centre circle. No coin is taken off you as a penalty." },
      { section: "Thumb shots", text: "Thumb strikes are not allowed; one counts as a foul." },
      { section: "Fouls", text: "A foul returns one of your pocketed coins to the board. Fouls: pocketing the striker, placing the striker wrongly, handling or moving the striker between turns, and — when both sides have one coin left and the Queen is still on the board — hitting your opponent's last coin directly." },
      { section: "Time limit & tie-breaker", text: "Each match has a 15-minute limit. If the combined scores are level when time runs out, a single tie-breaker board is played straight away, and whoever wins it wins the match." },
      { section: "Conduct", text: "Arrive 10 minutes before your match. Misconduct or unsportsmanlike behaviour can lead to disqualification." },
    ],
    doubles: [
      { section: "Doubles", text: "Two players per team, striking alternately." },
    ],
  },
};
