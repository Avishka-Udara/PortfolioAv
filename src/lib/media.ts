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

export type MediaItem = VideoMedia | ImageMedia;

/** original source path -> optimised web asset */
const index = raw as unknown as Record<string, MediaItem>;

export const mediaIndex = index;
export const mediaKeys = Object.keys(index);

/** Resolve a source path to its optimised variants. */
export function media(key: string): MediaItem | undefined {
  return index[key];
}

/** Grid thumbnail: video -> poster, image -> card. */
export function thumb(m: MediaItem): string {
  return m.kind === "video" ? m.poster : m.card;
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
