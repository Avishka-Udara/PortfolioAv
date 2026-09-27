import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "motion/react";
import { AmbientVideo } from "../components/Media";
import { Marquee, SectionHead, Btn, Arrow, CountUp } from "../components/ui";
import { ProjectCard } from "../components/ProjectCard";
import { Lightbox, type LightboxItem } from "../components/Lightbox";
import { useState } from "react";
import { categories, categoryMeta, featured, resolveMedia } from "../data/projects";
import { capabilities, process, site, stats } from "../data/site";
import { mediaIndex } from "../lib/media";
import { EASE } from "../lib/motion";
import { cn } from "../lib/utils";
import { scrollToId } from "../hooks/useSmoothScroll";

/* ------------------------------------------------------------------ hero */

function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);

  const first = "Avishka";
  const second = "Udara";

  return (
    <section ref={ref} className="relative flex min-h-[100svh] flex-col justify-between overflow-hidden pt-28 pb-8 sm:pt-32">
      {/* ambient film behind the type */}
      <motion.div className="pointer-events-none absolute inset-0 -z-10" style={{ scale }}>
        <AmbientVideo
          src="/media/3D/an33.mp4"
          poster="/media/3D/an33-poster.jpg"
          eager
          className="h-full w-full object-cover opacity-80 brightness-[1.45] contrast-[1.08] saturate-[1.15]"
        />
        {/* vertical scrim keeps the type legible over the busiest frames */}
        <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/40 to-ink" />
        {/* soft vignette to settle the edges */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_42%,transparent_0%,rgb(8_8_10/0.86)_76%)]" />
      </motion.div>

      {/* grid texture */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.055]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(ellipse at 50% 0%, #000 0%, transparent 72%)",
        }}
      />

      <motion.div style={{ y, opacity }} className="container-x flex-1">
        {/* status row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
          className="mono flex flex-wrap items-center gap-x-4 gap-y-2 text-dim"
        >
          <span className="inline-flex items-center gap-2 text-fg">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
            </span>
            Available for freelance
          </span>
          <span className="hidden sm:inline">·</span>
          <span>{site.location}</span>
          <span className="hidden sm:inline">·</span>
          <span>{site.years}+ years experience</span>
        </motion.div>

        {/* name */}
        <h1 className="mt-8 sm:mt-12">
          <span className="block overflow-hidden pb-[0.06em]">
            <motion.span
              className="display block text-hero"
              initial={{ y: "110%", filter: "blur(16px)", opacity: 0 }}
              animate={{ y: "0%", filter: "blur(0px)", opacity: 1 }}
              transition={{ duration: 1.15, delay: 0.1, ease: EASE }}
            >
              {first}
              <span className="text-accent">.</span>
            </motion.span>
          </span>
          <span className="block overflow-hidden pb-[0.06em]">
            <motion.span
              className="display block text-hero pl-[0.06em] outline-type"
              initial={{ y: "110%", filter: "blur(16px)", opacity: 0 }}
              animate={{ y: "0%", filter: "blur(0px)", opacity: 1 }}
              transition={{ duration: 1.15, delay: 0.24, ease: EASE }}
            >
              {second}
            </motion.span>
          </span>
        </h1>

        {/* role + blurb */}
        <div className="mt-8 grid gap-8 sm:mt-10 lg:grid-cols-12">
          <motion.p
            initial={{ opacity: 0, y: 22, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.9, delay: 0.45, ease: EASE }}
            className="mono max-w-[17rem] text-muted lg:col-span-4"
          >
            {site.role}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 22, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.9, delay: 0.55, ease: EASE }}
            className="max-w-xl text-[0.975rem] leading-relaxed text-muted sm:text-lg lg:col-span-5"
          >
            {site.intro}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.65, ease: EASE }}
            className="flex flex-wrap items-start gap-3 lg:col-span-3 lg:justify-end"
          >
            <Btn to="/work">
              View work <Arrow />
            </Btn>
            <Btn to="/contact" variant="ghost">
              Contact
            </Btn>
          </motion.div>
        </div>
      </motion.div>

      {/* scroll cue */}
      <motion.button
        onClick={() => scrollToId("work")}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.8 }}
        className="mono group mx-auto mt-10 flex flex-col items-center gap-3 text-dim transition-colors duration-300 hover:text-accent"
      >
        Scroll
        <span className="relative h-10 w-px overflow-hidden bg-line-2">
          <motion.span
            className="absolute inset-x-0 top-0 h-4 bg-accent"
            animate={{ y: ["-100%", "250%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </motion.button>
    </section>
  );
}

/* --------------------------------------------------------- client strip */

function ClientMarquee() {
  const logoKeys = Object.keys(mediaIndex).filter((k) =>
    k.startsWith("companies_and_NGO_i_works_with/")
  );

  return (
    <section className="border-y border-line bg-ink-2/50 py-7 sm:py-9">
      <div className="container-x mb-6">
        <p className="mono text-center text-dim">Trusted by brands, hospitals &amp; NGOs across Sri Lanka and beyond</p>
      </div>
      <Marquee speed={52} className="py-1">
        {logoKeys.map((k) => (
          <LogoTile key={k} k={k} />
        ))}
        <span className="mx-6 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
      </Marquee>
    </section>
  );
}

function LogoTile({ k }: { k: string }) {
  const item = mediaIndex[k];
  const label = k.split("/").pop()?.replace(/\.\w+$/, "").replace(/[_-]/g, " ") ?? "";

  return (
    <div className="group/logo relative flex h-16 w-44 shrink-0 items-center justify-center px-5 sm:h-20 sm:w-52">
      {/* halo: invisible until the pointer arrives, then blooms behind the mark */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 scale-50 rounded-full bg-accent/12 opacity-0 blur-xl transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/logo:scale-110 group-hover/logo:opacity-100"
      />
      <div className="relative h-full w-full overflow-hidden">
        <img
          src={item.kind === "image" ? item.card : ""}
          alt={label}
          loading="lazy"
          className="h-full w-full object-contain opacity-55 transition-all duration-[0.9s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/logo:scale-[1.18] group-hover/logo:opacity-100"
        />
        {/* wipe: a soft light sweeps across the mark on hover */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-[1.1s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/logo:translate-x-full"
        />
      </div>
      {/* caption that rises with the tile */}
      <span className="mono pointer-events-none absolute -bottom-1 left-1/2 -translate-x-1/2 translate-y-1 text-[0.65rem] uppercase tracking-[0.14em] text-accent opacity-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/logo:translate-y-0 group-hover/logo:opacity-100">
        {label}
      </span>
    </div>
  );
}

/* -------------------------------------------------------- selected work */

function SelectedWork() {
  const picks = featured.slice(0, 6);
  const [lb, setLb] = useState<number | null>(null);

  const lbItems: LightboxItem[] = picks.map((p) => ({
    item: resolveMedia(p)[0],
    title: p.title,
    meta: `${p.client} · ${p.year}`,
  }));

  return (
    <section id="work" className="container-x scroll-mt-24 py-20 sm:py-28">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <SectionHead
          eyebrow="Selected work"
          title={
            <>
              A few things
              <br />
              I&rsquo;ve <span className="text-accent">shipped</span>
            </>
          }
        />
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <Btn to="/work" variant="ghost">
            All {featured.length > 6 ? "work" : "projects"} <Arrow />
          </Btn>
        </motion.div>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-6">
        {picks.map((p, i) => (
          <ProjectCard key={p.slug} project={p} index={i} onOpen={() => setLb(i)} />
        ))}
      </div>

      <Lightbox items={lbItems} index={lb} onClose={() => setLb(null)} onIndex={setLb} />
    </section>
  );
}

/* ---------------------------------------------------------- capabilities */

function Capabilities() {
  return (
    <section id="capabilities" className="scroll-mt-24 border-y border-line bg-ink-2/40 py-20 sm:py-28">
      <div className="container-x">
        <SectionHead
          eyebrow="What I do"
          title={
            <>
              Six disciplines,
              <br />
              one <span className="text-accent">brain</span>
            </>
          }
          lede="Most projects need more than one of these. That's the point — brand work that ships with motion, motion that ships with code, and design that survives contact with a real product."
        />

        <div className="mt-14 divide-y divide-line border-y border-line">
          {capabilities.map((c, i) => (
            <CapabilityRow key={c.id} cap={c} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CapabilityRow({ cap, i }: { cap: (typeof capabilities)[number]; i: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, delay: i * 0.05, ease: EASE }}
      className="group relative grid gap-4 py-7 transition-colors duration-500 sm:grid-cols-12 sm:gap-6 sm:py-9"
    >
      {/* hover wash */}
      <span className="pointer-events-none absolute inset-x-0 top-0 h-0 origin-top scale-y-0 bg-gradient-to-r from-accent/8 to-transparent transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100" />

      <div className="flex items-baseline gap-4 sm:col-span-4">
        <span className="mono w-6 shrink-0 text-dim transition-colors duration-500 group-hover:text-accent">
          {cap.index}
        </span>
        <h3 className="text-xl font-semibold tracking-[-0.03em] sm:text-2xl">{cap.name}</h3>
      </div>

      <p className="text-sm leading-relaxed text-muted sm:col-span-4">{cap.blurb}</p>

      <ul className="flex flex-wrap gap-1.5 sm:col-span-4 sm:justify-end">
        {cap.items.map((tag) => (
          <li key={tag}>
            <Link
              to={`/work?f=${cap.id}`}
              data-cursor="hover"
              className="mono inline-block rounded-full border border-line px-2.5 py-1.5 text-dim transition-all duration-400 hover:border-accent/60 hover:bg-accent/10 hover:text-accent"
            >
              {tag}
            </Link>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

/* ---------------------------------------------------------------- stats */

function Stats() {
  return (
    <section className="container-x py-20 sm:py-24">
      <div className="grid grid-cols-2 gap-y-10 border-y border-line py-12 lg:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, delay: i * 0.07, ease: EASE }}
            className={cn("text-center lg:text-left", i > 0 && "lg:border-l lg:border-line lg:pl-10")}
          >
            <p className="display text-[clamp(2.5rem,6vw,4rem)] text-accent">
              <CountUp to={s.value} suffix={s.suffix} />
            </p>
            <p className="mono mt-2.5 text-dim">{s.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- process */

function Process() {
  return (
    <section className="container-x pb-20 sm:pb-28">
      <SectionHead
        eyebrow="How it works"
        title={
          <>
            A process that
            <br />
            removes <span className="text-accent">surprises</span>
          </>
        }
      />

      <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
        {process.map((p, i) => (
          <motion.div
            key={p.step}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, delay: i * 0.08, ease: EASE }}
            className="group relative bg-ink p-6 transition-colors duration-500 hover:bg-ink-2 sm:p-7"
          >
            <span className="mono text-accent">{p.step}</span>
            <h3 className="mt-5 text-lg font-semibold tracking-[-0.025em]">{p.title}</h3>
            <p className="mt-2.5 text-sm leading-relaxed text-muted">{p.body}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ categories */

function CategoryStrip() {
  return (
    <section className="container-x pb-6 sm:pb-10">
      <div className="flex flex-wrap gap-2.5">
        {categories.map((c, i) => (
          <motion.div
            key={c}
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, delay: i * 0.05, ease: EASE }}
          >
            <Link
              to={`/work?f=${c}`}
              data-cursor="hover"
              className="mono group flex items-center gap-2.5 rounded-full border border-line px-5 py-3 text-muted transition-all duration-500 hover:border-accent hover:bg-accent hover:text-ink"
            >
              {categoryMeta[c].label}
              <Arrow className="transition-transform duration-500 group-hover:translate-x-0.5" />
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ page */

export default function Home() {
  return (
    <>
      <Hero />
      <ClientMarquee />
      <SelectedWork />
      <Capabilities />
      <Stats />
      <Process />
      <CategoryStrip />
    </>
  );
}
