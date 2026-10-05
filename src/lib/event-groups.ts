/**
 * Men's and women's draws of the same format share one page.
 *
 * The sheet keeps one row per medal event (Carrom Men's Singles, Carrom
 * Women's Singles…), but visitors follow "Carrom Singles" and flip between the
 * two sides. Two draws are grouped when the sport plays both a men's and a
 * women's version of that format; a format with only one side (Table Tennis
 * Doubles) or a different pairing (Badminton Mixed Doubles) keeps its own page.
 * Races are left alone for now.
 */
import type { Tournament } from "@/data/tournaments";
import { placeTournament } from "@/lib/sport-tournaments";

const FORMATS = ["Singles", "Doubles"] as const;
export const SIDES = ["Men's", "Women's"] as const;

export type GroupRef = { slug: string; name: string; side: (typeof SIDES)[number] };

/** "Men's" → "mens", for the ?side= link. */
export const sideKey = (side: string) => side.toLowerCase().replace(/[^a-z]/g, "");

/** The shared page a draw belongs on, or null when it stands alone. */
export function groupOf(t: Pick<Tournament, "slug" | "sport" | "name">): GroupRef | null {
  const place = placeTournament(t);
  if (!place || place.sport.kind !== "knockout") return null;
  for (const format of FORMATS) {
    for (const side of SIDES) {
      if (place.event.label !== `${side} ${format}`) continue;
      const bothSides = SIDES.every((s) => place.sport.events.includes(`${s} ${format}`));
      if (!bothSides) return null;
      return { slug: `${place.sport.slug}-${format.toLowerCase()}`, name: `${place.sport.name} ${format}`, side };
    }
  }
  return null;
}
