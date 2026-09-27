import { useEffect, useRef, useState } from "react";
import type { MediaItem } from "../lib/media";
import { cn } from "../lib/utils";

/**
 * Image/video surface with a fade-in and a reserved box, so nothing reflows
 * as media arrives. `loading="lazy"` keeps off-screen assets out of the
 * initial download.
 */
export function MediaFrame({
  item,
  src,
  alt,
  className,
  imgClassName,
  sizes,
  priority = false,
}: {
  item: MediaItem;
  /** defaults to the card/poster variant */
  src?: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const [loaded, setLoaded] = useState(false);
  const useSrc = src ?? (item.kind === "video" ? item.poster : item.card ?? item.src);

  return (
    <div className={cn("relative overflow-hidden bg-ink-3", className)}>
      {!loaded && <div className="absolute inset-0 animate-pulse bg-ink-3" aria-hidden />}
      <img
        src={useSrc}
        alt={alt}
        width={item.width}
        height={item.height}
        sizes={sizes}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
        className={cn(
          "h-full w-full object-cover transition-opacity duration-700",
          loaded ? "opacity-100" : "opacity-0",
          imgClassName
        )}
      />
    </div>
  );
}

/**
 * Card surface: poster by default, and on a fine pointer the video starts
 * playing muted once the pointer arrives. The <video> element is only
 * inserted on hover so the grid never downloads 30 clips.
 */
export function HoverMedia({
  item,
  alt,
  className,
  imgClassName,
  sizes,
  onClick,
  cursorLabel,
  active = false,
}: {
  item: MediaItem;
  alt: string;
  className?: string;
  imgClassName?: string;
  sizes?: string;
  onClick?: () => void;
  cursorLabel?: string;
  /** play immediately (used when the card is the lightbox's current item) */
  active?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [play, setPlay] = useState(false);
  const [ready, setReady] = useState(false);
  const isVideo = item.kind === "video";

  useEffect(() => {
    if (!play || !videoRef.current) return;
    const v = videoRef.current;
    v.currentTime = 0;
    const p = v.play();
    if (p) p.catch(() => setPlay(false));
  }, [play]);

  const start = () => isVideo && setPlay(true);
  const stop = () => {
    setPlay(false);
    const v = videoRef.current;
    if (v) {
      v.pause();
      v.currentTime = 0;
    }
  };

  useEffect(() => {
    if (active) start();
    else if (!active) stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  return (
    <div
      className={cn("relative overflow-hidden bg-ink-3", className)}
      onPointerEnter={start}
      onPointerLeave={stop}
      data-cursor={onClick ? "media" : undefined}
      data-cursor-label={cursorLabel ?? (isVideo ? "Play" : "View")}
    >
      <MediaFrame
        item={item}
        alt={alt}
        sizes={sizes}
        className="absolute inset-0"
        imgClassName={cn(isVideo && play && ready && "opacity-0", imgClassName)}
      />

      {isVideo && play && (
        <video
          ref={videoRef}
          src={item.src}
          poster={item.poster}
          muted
          loop
          playsInline
          preload="metadata"
          onCanPlay={() => setReady(true)}
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-500",
            ready ? "opacity-100" : "opacity-0"
          )}
        />
      )}
    </div>
  );
}

/**
 * Plays a clip only once it has been within 200px of the viewport, so
 * full-bleed background films start themselves without costing initial load.
 * Pass `eager` for above-the-fold media.
 */
export function AmbientVideo({
  src,
  poster,
  className,
  eager = false,
}: {
  src: string;
  poster?: string;
  className?: string;
  eager?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [seen, setSeen] = useState(eager);

  useEffect(() => {
    if (eager) {
      ref.current?.play().catch(() => {});
      return;
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true);
          el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { rootMargin: "200px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [eager]);

  return (
    <video
      ref={ref}
      src={seen ? src : undefined}
      poster={poster}
      muted
      loop
      playsInline
      autoPlay={eager}
      preload={eager ? "auto" : "none"}
      className={className}
    />
  );
}
