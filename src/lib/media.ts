import raw from "../generated/media.json";

export type VideoMedia = {
  kind: "video";
  src: string;
  poster: string;
  width: number;
  height: number;
  duration: number;
  ratio: number;
};

export type ImageMedia = {
  kind: "image";
  src: string;
  card: string;
  width: number;
  height: number;
  ratio: number;
  orientation: "portrait" | "landscape" | "square";
  hasAlpha: boolean;
};

/**
 * A real 3D asset. `src` is the .obj served verbatim from public/; `poster` is
 * a rendered frame used everywhere the model isn't actively mounted (grid
 * thumbnails, lightbox scrubber), so the page never downloads three.js or the
 * mesh until someone opens the viewer.
 */
export type ModelMedia = {
  kind: "model";
  src: string;
  poster: string;
  /** grid thumbnail (same art as the poster) */
  card?: string;
  width: number;
  height: number;
  ratio: number;
};

export type MediaItem = VideoMedia | ImageMedia | ModelMedia;

/** original source path -> optimised web asset */
const index = raw as unknown as Record<string, MediaItem>;

export const mediaIndex = index;
export const mediaKeys = Object.keys(index);

/** Resolve a source path to its optimised variants. */
export function media(key: string): MediaItem | undefined {
  return index[key];
}

/** Grid thumbnail: video/model -> poster, image -> card. */
export function thumb(m: MediaItem): string {
  if (m.kind === "image") return m.card;
  if (m.kind === "model" && m.card) return m.card;
  return m.poster;
}

/** Orientation of any media item, for laying out mixed-ratio grids. */
export function orientation(m: MediaItem): "portrait" | "landscape" | "square" {
  if (m.kind === "image") return m.orientation;
  if (m.ratio > 1.15) return "landscape";
  if (m.ratio < 0.85) return "portrait";
  return "square";
}

export function isVideo(m: MediaItem): m is VideoMedia {
  return m.kind === "video";
}

export function isModel(m: MediaItem): m is ModelMedia {
  return m.kind === "model";
}
