/**
 * Server functions. The handlers are stripped from the client bundle, so the
 * sheet credentials and the Google fetch never reach the browser.
 *
 * Each one returns only what its page draws. At InMobi the tournament pages
 * were shipped every draw in the event — a quarter-megabyte per page, and per
 * auto-refresh — to render one of them. Filtering happens here, on the server.
 *
 * As at InMobi, a tournament is one row of the Tournaments tab — one medal
 * event, one draw tab, one page. Carrom Singles and Carrom Doubles are two.
 */
import { createServerFn } from "@tanstack/react-start";

import { sportRules } from "@/data/event";
import type { Tournament } from "@/data/tournaments";
import { loadSheetData } from "@/lib/sheets";
import { buildSportPoints } from "@/lib/points";
import { placeTournament } from "@/lib/sport-tournaments";

/**
 * The event-wide standings, plus which tournament page each medal event lives
 * on (keyed by event name, e.g. "Carrom Singles") so its row can link there.
 */
export const getPointsTable = createServerFn({ method: "GET" })
  .inputValidator((input: { atLeast?: number } | undefined) => input ?? {})
  .handler(async ({ data: input }) => {
  const data = await loadSheetData({ atLeast: input.atLeast ?? 0 });
  const eventSlugs: Record<string, string> = {};
  for (const t of data.tournaments) {
    const place = placeTournament(t);
    if (place) eventSlugs[place.event.name] = t.slug;
  }
  return { points: data.points, eventSlugs, fetchedAt: data.fetchedAt };
});

/**
 * The home page list: every tournament the Tournaments tab marks Visible and
 * whose draw tab exists, in the sheet's own order. A row set to "No" stays off
 * until the desk flips it.
 */
export const getPublishedTournaments = createServerFn({ method: "GET" }).handler(async () => {
  const data = await loadSheetData();
  return {
    tournaments: data.tournaments.map((t) => ({
      slug: t.slug,
      name: t.name,
      sport: placeTournament(t)?.sport.name ?? t.sport,
      dates: t.dates,
    })),
  };
});

/** The fields a tournament page renders; the rest stays on the server. */
export type TournamentPage = Pick<
  Tournament,
  | "slug"
  | "name"
  | "sport"
  | "participants"
  | "courtLabel"
  | "rounds"
  | "race"
  | "format"
  | "teams"
  | "dates"
  | "time"
  | "venue"
  | "about"
  | "gallery"
  | "videos"
>;

/**
 * One tournament page: its draw, its row's details, and its medals from the
 * Results tab. Null for a slug that isn't published — hidden means not ready.
 */
export const getTournamentPage = createServerFn({ method: "GET" })
  .inputValidator((input: { slug: string; atLeast?: number }) => input)
  .handler(async ({ data: { slug, atLeast } }) => {
    const data = await loadSheetData({ atLeast: atLeast ?? 0 });
    const t = data.tournaments.find((item) => item.slug === slug);
    if (!t) return null;

    const place = placeTournament(t);
    const result = place
      ? (buildSportPoints(data.points)
          .find((row) => row.slug === place.sport.slug)
          ?.events.find((event) => event.name === place.event.name) ?? null)
      : null;

    const tournament: TournamentPage = {
      slug: t.slug,
      name: t.name,
      sport: t.sport,
      participants: t.participants,
      courtLabel: t.courtLabel,
      rounds: t.rounds,
      race: t.race,
      format: t.format,
      teams: t.teams,
      dates: t.dates,
      time: t.time,
      venue: t.venue,
      about: t.about,
      gallery: t.gallery,
      videos: t.videos,
    };
    const book = place ? sportRules[place.sport.slug] : undefined;
    const rules = book ? [...book.all, ...(t.participants === "doubles" ? (book.doubles ?? []) : [])] : [];
    return {
      tournament,
      rules,
      // Catalogue facts the sheet row may leave blank.
      sport: place ? { name: place.sport.name, date: place.sport.date, venue: place.sport.venue, kind: place.sport.kind } : null,
      result,
      fetchedAt: data.fetchedAt,
    };
  });
