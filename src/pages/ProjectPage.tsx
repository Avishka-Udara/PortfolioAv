import { useRef, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { motion, useScroll, useTransform } from "motion/react";
import { bySlug, byRecency, categoryMeta, resolveMedia } from "../data/projects";
import { Lightbox, type LightboxItem } from "../components/Lightbox";
import { Btn, Arrow, Eyebrow } from "../components/ui";
import { Reveal } from "../components/Reveal";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { site } from "../data/site";
import { EASE } from "../lib/motion";
import { mmss } from "../lib/utils";
import { isVideo, isModel } from "../lib/media";
import { useSeo } from "../hooks/useSeo";
import { workJsonLd } from "../lib/seo";

export default function ProjectPage() {
  const { slug = "" } = useParams();
  const project = bySlug(slug);
  const [lb, setLb] = useState<number | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], [0, 110]);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.14]);

  const media = project ? resolveMedia(project) : [];
  const cover = media[0];

  // metadata (and the hooks above) must run before the redirect guard so the
  // hook order is identical on every render
  useSeo(
    project
      ? {
          title: `${project.title} — ${project.client}`,
          description: `${project.summary} A ${categoryMeta[project.category].label.toLowerCase()} project by Avishka Udara for ${project.client} (${project.year}). View detailed case study and project gallery.`,
          path: `/work/${project.slug}`,
          image: cover?.kind === "video" ? cover.poster : cover?.kind === "image" ? cover.src : cover?.poster,
          type: "article",
          keywords: [
            "Avishka Udara",
            `${project.title}`,
            `${project.client} Design`,
            `${categoryMeta[project.category].label} Project`,
            "Visual Design Case Study",
            "Portfolio Project",
            ...project.disciplines
          ],
          jsonLd: workJsonLd({
            title: project.title,
            description: project.summary,
            path: `/work/${project.slug}`,
            image: cover?.kind === "image" ? cover.src : cover?.poster,
            client: project.client,
            year: project.year,
          }),
        }
      : { noindex: true }
  );

  if (!project) return <Navigate to="/work" replace />;

  const meta = categoryMeta[project.category];

  const idx = byRecency.findIndex((p) => p.slug === project.slug);
  const next = byRecency[(idx + 1) % byRecency.length];

  const lbItems: LightboxItem[] = media.map((m) => ({
    item: m,
    title: project.title,
    meta:
      m.kind === "video"
        ? `${mmss(m.duration)} · video`
        : isModel(m)
          ? "interactive 3D model"
          : `${m.width}×${m.height}`,
  }));

  return (
    <article>
      {/* ------------------------------------------------------------- hero */}
      <header className="container-x pt-28 pb-8 sm:pt-36 sm:pb-10">
        <Breadcrumbs />
        <Reveal>
          <Link
            to="/work"
            data-cursor="hover"
            className="mono group inline-flex items-center gap-2 text-dim transition-colors duration-300 hover:text-accent"
          >
            <svg viewBox="0 0 14 14" className="h-3 w-3 rotate-180 transition-transform duration-500 group-hover:-translate-x-1">
              <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" />
            </svg>
            All work
          </Link>
        </Reveal>

        <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <Reveal delay={0.05}>
              <Eyebrow>{meta.label}</Eyebrow>
            </Reveal>
            <h1 className="mt-5">
              <span className="block overflow-hidden pb-[0.05em]">
                <motion.span
                  className="display block text-[clamp(2.1rem,7.5vw,5.5rem)]"
                  initial={{ y: "110%", filter: "blur(14px)" }}
                  animate={{ y: "0%", filter: "blur(0px)" }}
                  transition={{ duration: 1, delay: 0.08, ease: EASE }}
                >
                  {project.title}
                </motion.span>
              </span>
            </h1>
          </div>

          <div className="lg:col-span-5 lg:pt-3">
            <Reveal delay={0.16}>
              <p className="max-w-md text-[0.975rem] leading-relaxed text-muted sm:text-lg">
                {project.summary}
              </p>
            </Reveal>
          </div>
        </div>

        {/* meta strip */}
        <Reveal delay={0.22}>
          <dl className="mt-10 grid grid-cols-2 gap-y-6 border-y border-line py-6 sm:grid-cols-4 sm:gap-y-0">
            <Meta label="Client" value={project.client} />
            <Meta label="Year" value={project.year} />
            <Meta label="Disciplines" value={project.disciplines.join(", ")} />
            <Meta label="Tools" value={project.tools.join(", ")} />
          </dl>
        </Reveal>
      </header>

      {/* ------------------------------------------------------ cover media */}
      {cover && (
        <div ref={heroRef} className="relative overflow-hidden">
          <motion.div style={{ y: imgY, scale: imgScale }} className="relative">
            <button
              onClick={() => setLb(0)}
              data-cursor="media"
              data-cursor-label={isVideo(cover) ? "Play" : isModel(cover) ? "View 3D" : "View"}
              className="group relative block w-full"
            >
              {isVideo(cover) ? (
                <>
                  <video
                    src={cover.src}
                    poster={cover.poster}
                    muted
                    loop
                    playsInline
                    autoPlay
                    preload="metadata"
                    className="max-h-[86svh] w-full bg-ink-2 object-cover"
                  />
                  <span className="absolute inset-0 grid place-items-center">
                    <span className="pointer-events-none grid h-20 w-20 place-items-center rounded-full border border-white/25 bg-ink/40 backdrop-blur-sm transition-all duration-500 group-hover:scale-110 group-hover:border-accent group-hover:bg-accent/90">
                      <span className="pulse-ring absolute inset-0 rounded-full border border-accent" />
                      <svg viewBox="0 0 24 24" className="relative ml-0.5 h-6 w-6 text-fg transition-colors group-hover:text-ink">
                        <path d="M7 4.5v15l13-7.5z" fill="currentColor" />
                      </svg>
                    </span>
                  </span>
                </>
              ) : (
                <img
                  src={cover.src}
                  alt={project.title}
                  className="max-h-[86svh] w-full bg-ink-2 object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
                />
              )}
            </button>
          </motion.div>
        </div>
      )}

      {/* ---------------------------------------------------------- gallery */}
      <section className="container-x py-12 sm:py-16">
        <Reveal>
          <div className="mb-7 flex items-center justify-between gap-4">
            <p className="mono text-dim">
              {media.length} {media.length === 1 ? "piece" : "pieces"} · click to expand
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          {media.map((m, i) => (
            <motion.button
              key={m.src}
              onClick={() => setLb(i)}
              data-cursor="media"
              data-cursor-label={isVideo(m) ? "Play" : "View"}
              initial={{ opacity: 0, y: 26, filter: "blur(10px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.75, delay: Math.min(i, 6) * 0.06, ease: EASE }}
              className="group relative overflow-hidden rounded-xl bg-ink-3"
            >
              <img
                src={m.kind === "video" ? m.poster : isModel(m) ? (m.card ?? m.poster) : m.src}
                alt={`${project.title} ${i + 1}`}
                loading="lazy"
                className="w-full transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
              />
              <span className="absolute inset-0 bg-ink/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              <span className="absolute bottom-3 left-3 flex items-center gap-2">
                <span className="mono rounded-full border border-line-2 bg-ink/70 px-2.5 py-1.5 text-dim backdrop-blur-md transition-colors duration-400 group-hover:border-accent group-hover:text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {isVideo(m) && (
                  <span className="mono rounded-full border border-line-2 bg-ink/70 px-2.5 py-1.5 text-dim backdrop-blur-md">
                    {mmss(m.duration)}
                  </span>
                )}
                {isModel(m) && (
                  <span className="mono flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/15 px-2.5 py-1.5 text-accent backdrop-blur-md">
                    <svg viewBox="0 0 24 24" className="h-3 w-3">
                      <path d="M12 2.6 21 7.4v9.2L12 21.4 3 16.6V7.4z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                    </svg>
                    3D
                  </span>
                )}
              </span>
            </motion.button>
          ))}
        </div>
      </section>

      {/* -------------------------------------------------------- next up */}
      <section className="container-x py-12 sm:py-16">
        <Reveal>
          <Link
            to={`/work/${next.slug}`}
            data-cursor="media"
            data-cursor-label="Next"
            className="group block overflow-hidden rounded-2xl border border-line bg-ink-2"
          >
            <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-9">
              <div>
                <p className="mono text-accent">Next project</p>
                <p className="mt-3 text-2xl font-semibold tracking-[-0.03em] sm:text-4xl">
                  {next.title}
                </p>
                <p className="mono mt-2.5 text-dim">
                  {next.client} · {categoryMeta[next.category].label}
                </p>
              </div>
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full border border-line-2 text-fg transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:border-accent group-hover:bg-accent group-hover:text-ink sm:h-16 sm:w-16">
                <Arrow className="h-4 w-4" />
              </span>
            </div>
          </Link>
        </Reveal>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <p className="mono max-w-md text-dim">
            {site.availability} — <a href={`mailto:${site.email}`} className="text-accent">{site.email}</a>
          </p>
          <Btn to="/work" variant="ghost">
            Browse all <Arrow />
          </Btn>
        </div>
      </section>

      <Lightbox items={lbItems} index={lb} onClose={() => setLb(null)} onIndex={setLb} />
    </article>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="sm:border-l sm:border-line sm:pl-5 first:sm:border-0 first:sm:pl-0">
      <dt className="mono text-dim">{label}</dt>
      <dd className="mt-2 text-sm leading-relaxed text-fg">{value}</dd>
    </div>
  );
}
