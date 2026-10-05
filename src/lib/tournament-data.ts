/**
 * Server functions. The handlers are stripped from the client bundle, so the
 * sheet credentials and the Google fetch never reach the browser.
 *
 * Each one returns only what its page draws. At InMobi the tournament pages
 * were shipped every draw in the event — a quarter-megabyte per page, and per
 * auto-refresh — to render one of them. Filtering happens here, on the server.
 *
 * A tournament is one row of the Tournaments tab — one medal event, one draw
 * tab. Men's and women's draws of the same format share a page (see
 * event-groups), so "Carrom Singles" is one row on the home page and one page
 * with a switch between its two draws.
 */
import { createServerFn } from "@tanstack/react-start";

import { sportRules } from "@/data/event";
import { MEDALS, type EventResult, type SportPoints, type Tournament } from "@/data/tournaments";
import { loadSheetData } from "@/lib/sheets";
import { findEventResult } from "@/lib/points";
import { placeTournament } from "@/lib/sport-tournaments";
import { groupOf, SIDES, type GroupRef } from "@/lib/event-groups";

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
 * until the desk flips it. Men's and women's draws of one format collapse into
 * a single row where the first of them sits.
 */
export const getPublishedTournaments = createServerFn({ method: "GET" }).handler(async () => {
  const data = await loadSheetData();
  const groups = new Map<string, GroupRef[]>();
  for (const t of data.tournaments) {
    const ref = groupOf(t);
    if (ref) groups.set(ref.slug, [...(groups.get(ref.slug) ?? []), ref]);
  }
  const seen = new Set<string>();
  const rows = [];
  for (const t of data.tournaments) {
    const ref = groupOf(t);
    // A group with only one side published is just that draw.
    const shared = ref && (groups.get(ref.slug)?.length ?? 0) > 1 ? ref : null;
    if (shared && seen.has(shared.slug)) continue;
    if (shared) seen.add(shared.slug);
    const place = placeTournament(t);
    rows.push({
      slug: shared?.slug ?? t.slug,
      name: shared?.name ?? t.name,
      sport: place?.sport.name ?? t.sport,
      format: t.format,
      dates: t.dates || place?.sport.date || "",
      venue: t.venue || place?.sport.venue || "",
    });
  }
  return { tournaments: rows };
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
 * One tournament page. The slug is either a draw's own (carrom-mens-singles)
 * or a shared page's (carrom-singles); both open the shared page, the first on
 * its own side. `sides` holds one entry per draw — one for a standalone event,
 * two for a men's/women's pair. Null for a slug that isn't published.
 */
export const getTournamentPage = createServerFn({ method: "GET" })
  .inputValidator((input: { slug: string; atLeast?: number }) => input)
  .handler(async ({ data: { slug, atLeast } }) => {
    const data = await loadSheetData({ atLeast: atLeast ?? 0 });
    const direct = data.tournaments.find((item) => item.slug === slug);
    const groupSlug = direct ? groupOf(direct)?.slug : slug;
    const members = groupSlug
      ? data.tournaments
          .filter((item) => groupOf(item)?.slug === groupSlug)
          .sort((a, b) => SIDES.indexOf(groupOf(a)!.side) - SIDES.indexOf(groupOf(b)!.side))
      : [];
    const draws = members.length ? members : direct ? [direct] : [];
    const first = draws[0];
    if (!first) return null;

    const shared = draws.length > 1 ? groupOf(first) : null;
    return {
      name: shared?.name ?? first.name,
      sides: draws.map((t) => ({ side: groupOf(t)?.side ?? null, ...pageFor(t, data.points) })),
      active: Math.max(0, direct ? draws.indexOf(direct) : 0),
      teams: data.points.teams,
      fetchedAt: data.fetchedAt,
    };
  });

/** Everything one draw's view draws: its bracket, its row's details, its medals. */
function pageFor(t: Tournament, points: Awaited<ReturnType<typeof loadSheetData>>["points"]) {
  const place = placeTournament(t);
  // The medal podium, as at InMobi: a race takes its podium from the final's
  // places; everything else from its Results row.
  const ledger = place ? findEventResult(points, place.sport, place.event.label) : undefined;
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
  };
}

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

