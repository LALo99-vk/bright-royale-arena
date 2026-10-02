/**
 * The last good read, shared between server instances.
 *
 * On Cloudflare Workers the in-memory cache lives and dies with an isolate,
 * and isolates come and go: every fresh one used to pay a full Google read
 * (~1.5s) before it could answer. They now start from the copy the previous
 * isolate left in the data centre's cache, and refresh it in the background
 * like any stale copy.
 *
 * Elsewhere — Node, the dev server — `caches.default` doesn't exist and this
 * quietly does nothing; the process's own memory serves the same purpose.
 */
import type { SheetData } from "./index";

/** Any URL will do as a key; it is never fetched. */
const keyFor = (spreadsheetId: string) =>
  new Request(`https://sheet-snapshot.internal/v1/${encodeURIComponent(spreadsheetId)}`);

/** Kept a day: older than that and a fresh read is worth the wait. */
const KEEP_SECONDS = 24 * 60 * 60;

function edgeCache(): Cache | undefined {
  const store = (globalThis as { caches?: CacheStorage & { default?: Cache } }).caches;
  return store?.default;
}

export async function readSnapshot(spreadsheetId: string): Promise<SheetData | null> {
  const cache = edgeCache();
  if (!cache) return null;
  try {
    const hit = await cache.match(keyFor(spreadsheetId));
    return hit ? ((await hit.json()) as SheetData) : null;
  } catch (error) {
    console.error("[sheets] snapshot read failed:", error);
    return null;
  }
}

export async function writeSnapshot(spreadsheetId: string, data: SheetData): Promise<void> {
  const cache = edgeCache();
  if (!cache) return;
  await cache.put(
    keyFor(spreadsheetId),
    new Response(JSON.stringify(data), {
      headers: {
        "content-type": "application/json",
        "cache-control": `max-age=${KEEP_SECONDS}`,
      },
    }),
  );
}
