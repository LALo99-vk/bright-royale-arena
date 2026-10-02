import { useState } from "react";
import { Play, X } from "lucide-react";
import type { Tournament } from "@/data/tournaments";
import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

/**
 * A Drive video.
 *
 * The card is a poster and nothing else until someone presses play — then the
 * clip opens in a lightbox rather than inside the grid cell. Playing in place
 * is what forced every card to be big enough to watch in; with the player
 * lifted out, the shelf can be sized for scanning and the video gets the room
 * it actually needs.
 *
 * The poster comes through our own proxy, so it needs nothing more than the
 * folder being shared with the reader account. The player is still Drive's own
 * iframe, which loads in the visitor's browser and so does need the file itself
 * to be "anyone with the link" — when it isn't, we say so on the card.
 */
export function VideoCard({ video }: { video: Tournament["videos"][number] }) {
  const [open, setOpen] = useState(false);
  // Drive reports the encoded dimensions, and a phone clip can be stored
  // landscape with the rotation held separately — so the poster, which Drive
  // renders the right way up, gets the last word once it has actually loaded.
  const [aspect, setAspect] = useState(video.aspect);

  const frame = "relative w-full overflow-hidden rounded-xl bg-primary ring-1 ring-border/70";

  return (
    <article className="group">
      {video.shared ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          style={{ aspectRatio: aspect }}
          className={cn(
            frame,
            "cursor-pointer transition duration-300",
            "hover:-translate-y-0.5 hover:shadow-[0_16px_34px_-18px_rgba(20,20,50,0.55)] hover:ring-accent/60",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
          )}
          aria-label={`Play ${video.title}`}
        >
          <img
            src={video.poster}
            alt=""
            loading="lazy"
            onLoad={(event) => {
              const { naturalWidth, naturalHeight } = event.currentTarget;
              if (naturalWidth > 0 && naturalHeight > 0) {
                setAspect(naturalWidth / naturalHeight);
              }
            }}
            className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
          {/* A scrim only where the controls sit, so the frame keeps its colour. */}
          <span
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/60 to-transparent"
          />
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex size-11 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/50 backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:bg-accent group-hover:ring-accent">
              <Play className="size-4 translate-x-px fill-white text-white" />
            </span>
          </span>
          {video.duration && (
            <span className="absolute bottom-2 right-2 rounded bg-black/70 px-1.5 py-0.5 text-[0.68rem] font-medium tabular-nums text-white">
              {video.duration}
            </span>
          )}
        </button>
      ) : (
        <div
          style={{ aspectRatio: aspect }}
          className={cn(
            frame,
            "flex flex-col items-center justify-center gap-1.5 px-4 text-center",
          )}
        >
          <Play className="size-5 text-primary-foreground/40" />
          <p className="font-display text-xs font-bold text-primary-foreground/90">
            Not shared yet
          </p>
          <p className="text-[0.68rem] leading-snug text-primary-foreground/60">
            Set it to &ldquo;Anyone with the link&rdquo; in Drive.
          </p>
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          closeButton={false}
          className="w-auto max-w-none border-0 bg-transparent p-0 text-white shadow-none"
        >
          {/* Width is capped by the viewport on both axes at once, so the clip
              fills the frame exactly and never letterboxes inside it. The bar
              costs the height it takes, so the clip is measured against a
              slightly shorter viewport than the frame alone would need. */}
          <div
            className="flex flex-col gap-2"
            style={{ width: `min(92vw, ${(aspect * 78).toFixed(2)}vh)` }}
          >
            {/* Our chrome stays outside the frame. Drive's player draws its
                own pop-out button in the iframe's top-right corner, and a
                close button in that corner landed on top of it — on the phone
                the two were a single unreadable smudge. Above the frame it
                cannot collide with anything Drive decides to draw. */}
            <div className="flex items-center gap-3">
              <DialogTitle className="min-w-0 flex-1 truncate text-sm font-medium text-white/75">
                {video.title}
              </DialogTitle>
              <DialogClose
                className={cn(
                  "flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full",
                  "bg-white/10 text-white/80 ring-1 ring-white/20 transition",
                  "hover:bg-white/20 hover:text-white",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white",
                )}
              >
                <X className="size-4" />
                <span className="sr-only">Close</span>
              </DialogClose>
            </div>
            <div className="overflow-hidden rounded-xl bg-black" style={{ aspectRatio: aspect }}>
              {open && (
                <iframe
                  src={`https://drive.google.com/file/d/${video.id}/preview`}
                  title={video.title}
                  allow="autoplay; fullscreen"
                  allowFullScreen
                  className="size-full"
                />
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </article>
  );
}
