import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { MediaItem } from "../lib/media";
import { isVideo } from "../lib/media";
import { EASE } from "../lib/motion";
import { mmss } from "../lib/utils";

export type LightboxItem = { item: MediaItem; title?: string; meta?: string };

/**
 * Full-screen media viewer. Video autoplays muted; arrow keys and swipe move
 * through the set, escape closes. Focus is trapped inside the dialog.
 */
export function Lightbox({
  items,
  index,
  onClose,
  onIndex,
}: {
  items: LightboxItem[];
  index: number | null;
  onClose: () => void;
  onIndex: (i: number) => void;
}) {
  const open = index !== null;
  const i = index ?? 0;
  const current = open ? items[i] : undefined;
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [progress, setProgress] = useState(0);

  const go = useCallback(
    (delta: number) => {
      if (!open) return;
      onIndex((i + delta + items.length) % items.length);
    },
    [open, i, items.length, onIndex]
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === " " && current && vid) {
        e.preventDefault();
        setMuted((m) => !m);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, go, onClose, current]);

  useEffect(() => {
    setProgress(0);
    if (open) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open, i]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v || !open) return;
    v.muted = muted;
    if (muted) v.play().catch(() => {});
  }, [muted, open]);

  if (!current) return null;
  // narrow once so the union members are reachable below
  const vid = isVideo(current.item) ? current.item : null;
  const img = vid ? null : current.item;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={current.title ?? "Media viewer"}
          className="fixed inset-0 z-95 flex flex-col bg-ink/96 backdrop-blur-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* close */}
          <button
            onClick={onClose}
            aria-label="Close viewer"
            className="absolute top-4 right-4 z-10 grid h-11 w-11 place-items-center rounded-full border border-line-2 bg-ink-2/70 text-fg backdrop-blur-md transition-all duration-300 hover:border-accent hover:bg-accent hover:text-ink"
          >
            <svg viewBox="0 0 20 20" className="h-4 w-4">
              <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
          </button>

          {/* stage */}
          <div
            className="flex min-h-0 flex-1 items-center justify-center px-3 pt-16 pb-24 sm:px-16"
            onClick={(e) => e.target === e.currentTarget && onClose()}
          >
            <AnimatePresence mode="wait">
              <motion.figure
                key={i}
                className="flex max-h-full flex-col items-center"
                initial={{ opacity: 0, scale: 0.96, y: 18 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: -10 }}
                transition={{ duration: 0.45, ease: EASE }}
              >
                {vid ? (
                  <video
                    ref={videoRef}
                    key={vid.src}
                    src={vid.src}
                    poster={vid.poster}
                    autoPlay
                    muted={muted}
                    loop
                    playsInline
                    controls
                    onTimeUpdate={(e) => {
                      const el = e.currentTarget;
                      if (el.duration) setProgress(el.currentTime / el.duration);
                    }}
                    className="max-h-[68vh] w-auto max-w-full rounded-xl bg-black object-contain shadow-2xl"
                  />
                ) : (
                  <img
                    src={img!.src}
                    alt={current.title ?? ""}
                    className="max-h-[68vh] w-auto max-w-full rounded-xl object-contain shadow-2xl"
                  />
                )}
              </motion.figure>
            </AnimatePresence>
          </div>

          {/* arrows */}
          {items.length > 1 && (
            <>
              <button
                onClick={() => go(-1)}
                aria-label="Previous"
                className="absolute top-1/2 left-2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-line-2 bg-ink-2/60 text-fg backdrop-blur-md transition-all duration-300 hover:border-accent hover:text-accent sm:left-5"
              >
                <svg viewBox="0 0 20 20" className="h-4 w-4">
                  <path d="M12 4l-6 6 6 6" stroke="currentColor" strokeWidth="1.7" fill="none" strokeLinecap="round" />
                </svg>
              </button>
              <button
                onClick={() => go(1)}
                aria-label="Next"
                className="absolute top-1/2 right-2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-line-2 bg-ink-2/60 text-fg backdrop-blur-md transition-all duration-300 hover:border-accent hover:text-accent sm:right-5"
              >
                <svg viewBox="0 0 20 20" className="h-4 w-4">
                  <path d="M8 4l6 6-6 6" stroke="currentColor" strokeWidth="1.7" fill="none" strokeLinecap="round" />
                </svg>
              </button>
            </>
          )}

          {/* footer meta */}
          <div className="absolute inset-x-0 bottom-0 px-4 pt-4 pb-5 sm:px-6">
            {vid && (
              <div className="mx-auto mb-4 h-px w-full max-w-2xl bg-line">
                <div className="h-px bg-accent" style={{ width: `${progress * 100}%` }} />
              </div>
            )}
            <div className="mx-auto flex max-w-2xl items-end justify-between gap-4">
              <div className="min-w-0">
                {current.title && (
                  <p className="truncate text-sm font-semibold tracking-[-0.02em] sm:text-base">{current.title}</p>
                )}
                <p className="mono mt-1 text-dim">
                  {String(i + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
                  {vid && ` · ${mmss(vid.duration)}`}
                  {current.meta ? ` · ${current.meta}` : ""}
                </p>
              </div>
              {vid && (
                <button
                  onClick={() => setMuted((m) => !m)}
                  className="mono shrink-0 rounded-full border border-line-2 px-3 py-2 text-muted transition-colors duration-300 hover:border-accent hover:text-accent"
                >
                  {muted ? "Unmute" : "Mute"}
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
