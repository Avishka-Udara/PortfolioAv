import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { ProjectCard } from "../components/ProjectCard";
import { SetTile } from "../components/SetTile";
import { Lightbox, type LightboxItem } from "../components/Lightbox";
import { SectionHead, Btn, Arrow } from "../components/ui";
import { Reveal } from "../components/Reveal";
import { Breadcrumbs } from "../components/Breadcrumbs";
import {
  categoriesWithWork,
  categoryMeta,
  projects,
  byRecency,
  archiveGroups,
  resolveMedia,
  type CategoryId,
} from "../data/projects";
import { mediaIndex, type MediaItem } from "../lib/media";
import { site } from "../data/site";
import { EASE } from "../lib/motion";
import { cn, mmss } from "../lib/utils";
import { useSeo } from "../hooks/useSeo";

type Filter = CategoryId | "all";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All work" },
  ...categoriesWithWork.map((c) => ({ id: c as Filter, label: categoryMeta[c].label })),
];

/** reverse lookup: optimised MediaItem -> its source key */
const srcToKey = new Map<string, string>();
for (const [k, v] of Object.entries(mediaIndex)) srcToKey.set(v.src, k);
const findKey = (m: MediaItem) => srcToKey.get(m.src) ?? "";

export default function Work() {
  const [params, setParams] = useSearchParams();
  const initial = (params.get("f") as Filter) ?? "all";
  const [filter, setFilter] = useState<Filter>(FILTERS.some((f) => f.id === initial) ? initial : "all");
  const [lb, setLb] = useState<number | null>(null);

  // keep the URL shareable
  useEffect(() => {
    const next = new URLSearchParams(params);
    if (filter === "all") next.delete("f");
    else next.set("f", filter);
    if (next.toString() !== params.toString()) setParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const visible = useMemo(
    () => (filter === "all" ? byRecency : byRecency.filter((p) => p.category === filter)),
    [filter]
  );

  useSeo({
    title: filter === "all" ? "Portfolio" : `${categoryMeta[filter as CategoryId].label} Portfolio`,
    description:
      filter === "all"
        ? "Browse Avishka Udara's complete portfolio — brand identity, campaigns, 2D/3D animation, CGI, video and product design across 240+ projects for 60+ clients worldwide."
        : `${categoryMeta[filter as CategoryId].label} by Avishka Udara — ${categoryMeta[filter as CategoryId].blurb}`,
    path: filter === "all" ? "/work" : `/work?f=${filter}`,
    keywords: filter === "all" ? [
      "Avishka Udara Portfolio",
      "Visual Design Portfolio",
      "Motion Graphics Portfolio", 
      "3D Animation Projects",
      "Brand Identity Cases",
      "Logo Design Portfolio",
      "Creative Work Sri Lanka"
    ] : [
      `Avishka Udara ${categoryMeta[filter as CategoryId].label}`,
      `${categoryMeta[filter as CategoryId].label} Portfolio`,
      `${categoryMeta[filter as CategoryId].label} Sri Lanka`,
      "Visual Designer Work",
      "Creative Projects"
    ]
  });

  /** the lightbox is scoped to one project's media at a time, so next/prev
   *  walks that project's images, videos and 3D models as one sequence */
  const [lbProject, setLbProject] = useState<(typeof visible)[number] | null>(null);

  const lbWindow: LightboxItem[] = lbProject
    ? resolveMedia(lbProject).map((m) => ({
        item: m,
        title: lbProject.title,
        meta: `${lbProject.client} · ${lbProject.year}`,
      }))
    : [];

  /** index of the first asset of a set's media list within a project */
  const setOffset = (p: (typeof visible)[number], keys: string[]) => {
    const media = resolveMedia(p);
    const first = keys.map((k) => mediaIndex[k]).filter(Boolean)[0];
    return first ? media.indexOf(first) : 0;
  };

  const openProject = (p: (typeof visible)[number], at = 0) => {
    setLbProject(p);
    setLb(at);
  };

  const count = (f: Filter) =>
    f === "all" ? projects.length : projects.filter((p) => p.category === f).length;

  return (
    <>
      <header className="container-x pt-32 pb-10 sm:pt-40 sm:pb-14">
        <Breadcrumbs />
        <SectionHead
          eyebrow={`${projects.length} projects`}
          title={
            <>
              All <span className="text-accent">work</span>
            </>
          }
          lede={
            filter === "all"
              ? "Brand identity, campaigns, animation, CGI and product design — filtered by discipline below, or browse the full archive at the bottom of the page."
              : categoryMeta[filter as CategoryId].blurb
          }
        />
      </header>

      {/* ------------------------------------------------------ filter bar */}
      <div className="sticky top-16 z-50 border-y border-line bg-ink/85 backdrop-blur-xl sm:top-20">
        <div className="container-x no-scrollbar flex items-center gap-2 overflow-x-auto py-3.5">
          {FILTERS.map((f) => {
            const active = filter === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                data-cursor="hover"
                className={cn(
                  "mono relative shrink-0 rounded-full px-4 py-2.5 transition-colors duration-300",
                  active ? "text-ink" : "text-muted hover:text-fg"
                )}
              >
                {active && (
                  <motion.span
                    layoutId="filter-pill"
                    className="absolute inset-0 rounded-full bg-accent"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative z-10">
                  {f.label}
                  <span className={cn("ml-1.5 text-[0.9em]", active ? "text-ink/60" : "text-dim")}>
                    {count(f.id)}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ------------------------------------------------------------ grid */}
      <section className="container-x py-12 sm:py-16">
        <div className="mb-8 flex items-center justify-between gap-4 border-b border-line pb-4">
          <p className="mono text-dim">
            <motion.span key={filter} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: EASE }} className="inline-block text-fg">
              {visible.length}
            </motion.span>{" "}
            {visible.length === 1 ? "project" : "projects"}
            {filter !== "all" && <span className="text-dim"> · {categoryMeta[filter as CategoryId].label}</span>}
          </p>
          <p className="mono hidden text-dim sm:block">Hover a tile to preview</p>
        </div>

        <motion.div layout className="grid grid-cols-1 gap-x-5 gap-y-14 sm:grid-cols-2 sm:gap-y-16 lg:grid-cols-3 lg:gap-x-6">
          <AnimatePresence mode="popLayout">
            {visible.map((p, i) =>
              p.sets && p.sets.length ? (
                p.sets.map((s, si) => (
                  <SetTile
                    key={`${p.slug}-set-${si}`}
                    label={s.label}
                    items={resolveMedia(p).filter((m) => s.media.includes(findKey(m)))}
                    index={i + si}
                    onOpen={() => openProject(p, setOffset(p, s.media))}
                  />
                ))
              ) : (
                <ProjectCard key={p.slug} project={p} index={i} onOpen={() => openProject(p)} />
              )
            )}
          </AnimatePresence>
        </motion.div>

        {visible.length === 0 && (
          <p className="mono py-20 text-center text-dim">Nothing in this category yet.</p>
        )}
      </section>

      <Lightbox
        items={lbWindow}
        index={lb}
        onClose={() => {
          setLb(null);
          setLbProject(null);
        }}
        onIndex={setLb}
      />

      {/* ---------------------------------------------------------- archive */}
      <Archive />

      {/* ------------------------------------------------- more on drive */}
      <section className="container-x py-16 sm:py-20">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-line bg-ink-2 p-8 sm:p-12">
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.07]"
              style={{
                backgroundImage:
                  "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
                backgroundSize: "48px 48px",
              }}
            />
            <div className="relative flex flex-col gap-7 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="mono text-accent">Full library</p>
                <h2 className="display mt-4 text-[clamp(1.75rem,4.5vw,3.25rem)]">
                  The complete archive
                </h2>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-muted sm:text-base">
                  Source files, raw exports, motion tests and everything else live in a shared
                  drive. Ask for access and I'll walk you through it.
                </p>
              </div>
              <Btn href={site.drive}>
                Open Google Drive <Arrow />
              </Btn>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}

/* ---------------------------------------------------------------- archive */

function Archive() {
  const total = archiveGroups.reduce((n, g) => n + g.keys.length, 0);
  const [open, setOpen] = useState<string | null>(null);
  const [lb, setLb] = useState<{ group: string; i: number } | null>(null);

  const openKeys = open ? (archiveGroups.find((g) => g.label === open)?.keys ?? []) : [];

  const lbItems: LightboxItem[] = openKeys.map((k) => {
    const m = mediaIndex[k];
    return {
      item: m,
      title: k.split("/").pop()?.replace(/\.\w+$/, "")?.replace(/[_-]+/g, " ") ?? "",
      meta: m.kind === "video" ? `${mmss(m.duration)} · video` : `${m.width}×${m.height}`,
    };
  });

  if (total === 0) return null;

  return (
    <section className="container-x py-16 sm:py-20">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="mono text-accent">Everything else</p>
          <h2 className="display mt-4 text-[clamp(1.75rem,4.5vw,3.25rem)]">Archive</h2>
        </div>
        <p className="mono max-w-xs text-dim">
          {total} additional pieces, grouped by source folder. Click any group to browse.
        </p>
      </div>

      <div className="mt-10 space-y-px overflow-hidden rounded-2xl border border-line bg-line">
        {archiveGroups.map((g) => {
          const isOpen = open === g.label;
          return (
            <div key={g.label} className="bg-ink">
              <button
                onClick={() => setOpen(isOpen ? null : g.label)}
                data-cursor="hover"
                className="group flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors duration-400 hover:bg-ink-2 sm:px-6"
              >
                <span className="mono min-w-0 truncate text-fg">{g.label}</span>
                <span className="flex shrink-0 items-center gap-4">
                  <span className="mono text-dim transition-colors duration-300 group-hover:text-accent">
                    {g.keys.length}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.4, ease: EASE }}
                    className="text-accent"
                  >
                    <svg viewBox="0 0 14 14" className="h-3.5 w-3.5">
                      <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.6" />
                    </svg>
                  </motion.span>
                </span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.5, ease: EASE }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-2 gap-2.5 p-3 sm:grid-cols-3 sm:p-4 lg:grid-cols-4">
                      {g.keys.map((k, i) => {
                        const m = mediaIndex[k];
                        return (
                          <button
                            key={k}
                            onClick={() => setLb({ group: g.label, i })}
                            data-cursor="media"
                            data-cursor-label={m.kind === "video" ? "Play" : "View"}
                            className="group/thumb relative aspect-square overflow-hidden rounded-lg bg-ink-3"
                          >
                            <img
                              src={m.kind === "video" ? m.poster : m.card}
                              alt=""
                              loading="lazy"
                              className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/thumb:scale-110"
                            />
                            <span className="absolute inset-0 bg-ink/30 opacity-0 transition-opacity duration-500 group-hover/thumb:opacity-100" />
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      <Lightbox
        items={lbItems}
        index={lb?.i ?? null}
        onClose={() => setLb(null)}
        onIndex={(i) => setLb({ group: open ?? "", i })}
      />
    </section>
  );
}
