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
import { MEDALS, type EventResult, type SportPoints, type Tournament } from "@/data/tournaments";
import { loadSheetData } from "@/lib/sheets";
import { findEventResult } from "@/lib/points";
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
    tournaments: data.tournaments.map((t) => {
      const place = placeTournament(t);
      return {
        slug: t.slug,
        name: t.name,
        sport: place?.sport.name ?? t.sport,
        format: t.format,
        dates: t.dates || place?.sport.date || "",
        venue: t.venue || place?.sport.venue || "",
      };
    }),
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
    // The medal podium, as at InMobi: a race takes its podium from the final's
    // places; everything else from its Results row.
    const ledger = place ? findEventResult(data.points, place.sport, place.event.label) : undefined;
    const raced = raceWinners(t, ledger);
    const winners: SportPoints | null = raced
      ? { sport: place?.sport.name ?? t.sport, slug: place?.sport.slug ?? t.slug, events: [raced], points: {}, awarded: 0, pool: raced.pool, status: "complete" }
      : ledger && place
        ? { sport: place.sport.name, slug: place.sport.slug, events: [ledger], points: {}, awarded: ledger.awarded, pool: ledger.pool, status: ledger.status }
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
      winners,
      teams: data.points.teams,
      fetchedAt: data.fetchedAt,
    };
  });

/**
 * A race's podium is its final: whoever the sheet has 1st, 2nd and 3rd, with
 * the points from its Results row when there is one. Null until the final is
 * run, or for anything that isn't a race. Ported from InMobi.
 */
function raceWinners(t: Tournament, ledger: EventResult | undefined): EventResult | null {
  const final = t.race?.flatMap((round) => round.races).find((race) => race.final);
  if (!final || final.status !== "completed") return null;
  const medals = MEDALS.map((medal, i) => {
    const entry = final.entries.find((e) => e.place === i + 1);
    return {
      medal,
      points: ledger?.medals.find((m) => m.medal === medal)?.points ?? 0,
      team: entry?.group,
      winners: entry?.runner ? [entry.runner] : undefined,
    };
  });
  return { sport: t.sport, category: t.name, medals, awarded: 0, pool: medals.reduce((sum, m) => sum + m.points, 0), status: "complete" };
}

