/**
 * Which sheet tournaments belong on which sport page.
 *
 * The site has one page per sport with a tab per medal event; the sheet has one
 * tab per draw, listed on its Tournaments tab. A draw belongs to a sport when
 * its Sport column names it ("Badminton", "Table Tennis"), and to an event when
 * its name or slug says the same thing as the event label — so "Badminton
 * Men's Singles Knock Out" or `badminton-mens-singles` both land on Men's
 * Singles, and never on Women's Singles.
 */
import { sports, type Sport } from "@/data/event";
import type { Tournament } from "@/data/tournaments";
import { eventKey, medalEventsOf, sameSport } from "@/lib/points";

/** The words that tell one event of a sport from another. */
const KIND_WORDS = new Set(["men", "women", "mixed", "single", "double"]);
const kindKey = (value: string) =>
  eventKey(value)
    .split(" ")
    .filter((word) => KIND_WORDS.has(word))
    .join(" ");

/** All matching needs: works on full tournaments and on the trimmed page copies. */
type Named = Pick<Tournament, "slug" | "sport" | "name">;

/** Every tournament the sheet lists under this sport. */
export function tournamentsOf<T extends Named>(sport: Sport, all: T[]) {
  return all.filter((t) => sameSport(t.sport, sport) || t.slug === sport.slug || t.slug.startsWith(`${sport.slug}-`));
}

/** The draw for one event tab, or undefined until the sheet has it. */
export function tournamentFor<T extends Named>(sport: Sport, event: string, mine: T[]) {
  if (medalEventsOf(sport).length === 1) return mine[0];
  const wanted = kindKey(event);
  return mine.find((t) => kindKey(t.name) === wanted || kindKey(t.slug.replace(/-/g, " ")) === wanted);
}

/**
 * Where a sheet tournament sits in the catalogue: its sport, and which of that
 * sport's medal events it is. Null when the Sport column names nothing we know.
 */
export function placeTournament<T extends Named>(t: T) {
  const sport = sports.find((s) => tournamentsOf(s, [t]).length > 0);
  if (!sport) return null;
  const event = medalEventsOf(sport).find(({ label }) => tournamentFor(sport, label, [t]) === t);
  return event ? { sport, event } : null;
}
