import { motion } from "motion/react";
import { SectionHead, Btn, Arrow, CountUp } from "../components/ui";
import { Reveal, RevealGroup, revealItem } from "../components/Reveal";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { capabilities, clients, process, site, stats } from "../data/site";
import { EASE } from "../lib/motion";
import { Link } from "react-router-dom";
import { useSeo } from "../hooks/useSeo";

const timeline = [
  {
    period: "2016 — 2019",
    title: "Visual designer & brand support",
    body: "Started in agency life producing print, social and brand collateral for local clients — the years that taught me to work inside real constraints and real deadlines.",
  },
  {
    period: "2019 — 2022",
    title: "Motion & social campaigns",
    body: "Moved into animation full-time. Ran recurring content for hospitals, labs and startups, building motion libraries and template systems clients could keep using after I left.",
  },
  {
    period: "2022 — 2024",
    title: "3D, CGI & product visualisation",
    body: "Added Blender and a product-render workflow. Now handle everything from identity through modelling, lighting and final grade without a handoff between specialists.",
  },
  {
    period: "2024 — now",
    title: "Independent, end to end",
    body: "Working directly with founders and marketing teams as a long-term creative partner — identity, campaigns, films and the occasional front-end build.",
  },
];

export default function About() {
  useSeo({
    title: "About Avishka Udara",
    description:
      "Meet Avishka Udara, a multidisciplinary visual designer from Sri Lanka with 9+ years experience. Specializing in brand identity, motion graphics, 3D animation and creative campaigns for startups, hospitals and NGOs worldwide.",
    path: "/about",
    type: "profile",
    keywords: [
      "About Avishka Udara",
      "Visual Designer Biography",
      "Motion Artist Sri Lanka", 
      "Creative Professional Background",
      "Designer Experience",
      "Brand Designer Story",
      "Motion Graphics Expert",
      "3D Animation Specialist",
      "Sri Lankan Creative"
    ]
  });

  return (
    <>
      <header className="container-x pt-32 pb-12 sm:pt-40 sm:pb-16">
        <Breadcrumbs />
        <SectionHead
          eyebrow="About"
          title={
            <>
              Nine years of making
              <br />
              <span className="text-accent">things move</span>
            </>
          }
        />

        <div className="mt-12 grid gap-10 lg:grid-cols-12">
          <Reveal delay={0.1} className="lg:col-span-7">
            <div className="space-y-5 text-[1.0625rem] leading-relaxed text-muted sm:text-xl">
              <p>
                I&rsquo;m {site.name}, a multidisciplinary designer from {site.location}. I work
                across identity, campaign design, animation, 3D and post-production — which
                sounds broad until you realise most real projects cross those lines anyway.
              </p>
              <p>
                A product launch needs a logo, a film, a set of social cutdowns and a store
                listing. Doing all of that in one place means one idea holds together instead of
                getting reinterpreted four times on its way through three freelancers.
              </p>
              <p>
                I&rsquo;m most useful for teams that need a consistent creative presence without
                a full-time hire: brand identity, social campaigns, motion promos, and
                long-term support where someone owns the whole visual side.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.2} className="lg:col-span-5">
            <div className="rounded-2xl border border-line bg-ink-2 p-6 sm:p-7">
              {[
                ["Location", site.location],
                ["Experience", `${site.years}+ years in visual design, motion and brand communication`],
                ["Best fit", site.bestFit],
                ["Availability", site.availability],
                ["Timezone", site.timezone],
              ].map(([k, v], i) => (
                <div
                  key={k}
                  className={i > 0 ? "mt-5 border-t border-line pt-5" : ""}
                >
                  <p className="mono text-dim">{k}</p>
                  <p className="mt-2 text-sm leading-relaxed text-fg">{v}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </header>

      {/* --------------------------------------------------------- numbers */}
      <section className="border-y border-line bg-ink-2/40 py-14">
        <div className="container-x grid grid-cols-2 gap-y-10 lg:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.7, delay: i * 0.07, ease: EASE }}
              className="lg:border-l lg:border-line lg:pl-8 lg:first:border-0 lg:first:pl-0"
            >
              <p className="display text-[clamp(2.25rem,5.5vw,3.75rem)] text-accent">
                <CountUp to={s.value} suffix={s.suffix} />
              </p>
              <p className="mono mt-2.5 text-dim">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------- timeline */}
      <section className="container-x py-20 sm:py-28">
        <SectionHead eyebrow="Experience" title={<>The path here</>} />

        <div className="mt-12 space-y-px overflow-hidden rounded-2xl border border-line bg-line">
          {timeline.map((t, i) => (
            <motion.div
              key={t.period}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, delay: i * 0.06, ease: EASE }}
              className="group grid gap-3 bg-ink p-6 transition-colors duration-500 hover:bg-ink-2 sm:grid-cols-12 sm:gap-6 sm:p-8"
            >
              <p className="mono text-accent sm:col-span-3">{t.period}</p>
              <div className="sm:col-span-9">
                <h3 className="text-lg font-semibold tracking-[-0.025em] sm:text-xl">{t.title}</h3>
                <p className="mt-2.5 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
                  {t.body}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------- capabilities */}
      <section className="container-x py-8 pb-20 sm:pb-24">
        <SectionHead
          eyebrow="Capabilities"
          title={
            <>
              Everything I&rsquo;d
              <br />
              put my <span className="text-accent">name</span> on
            </>
          }
        />

        <RevealGroup className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {capabilities.map((c) => (
            <motion.div key={c.id} variants={revealItem} className="bg-ink p-6 transition-colors duration-500 hover:bg-ink-2 sm:p-7">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="text-lg font-semibold tracking-[-0.025em]">{c.name}</h3>
                <span className="mono text-dim">{c.index}</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted">{c.blurb}</p>
              <ul className="mt-5 flex flex-wrap gap-1.5">
                {c.items.map((t) => (
                  <li key={t} className="mono rounded-full border border-line px-2.5 py-1.5 text-dim">
                    {t}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </RevealGroup>
      </section>

      {/* --------------------------------------------------------- process */}
      <section className="container-x pb-20 sm:pb-28">
        <SectionHead eyebrow="Process" title={<>How we&rsquo;ll work</>} />

        <RevealGroup className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {process.map((p) => (
            <motion.div key={p.step} variants={revealItem} className="bg-ink p-6 transition-colors duration-500 hover:bg-ink-2 sm:p-7">
              <span className="mono text-accent">{p.step}</span>
              <h3 className="mt-5 text-base font-semibold tracking-[-0.02em]">{p.title}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-muted">{p.body}</p>
            </motion.div>
          ))}
        </RevealGroup>
      </section>

      {/* --------------------------------------------------------- clients */}
      <section className="container-x pb-20 sm:pb-24">
        <div className="rounded-3xl border border-line bg-ink-2 p-8 sm:p-12">
          <p className="mono text-accent">Worked with</p>
          <h2 className="display mt-4 text-[clamp(1.6rem,4vw,2.75rem)]">
            Brands, hospitals & NGOs
          </h2>

          <RevealGroup className="mt-8 flex flex-wrap gap-2" stagger={0.035}>
            {clients.map((c) => (
              <motion.span
                key={c}
                variants={revealItem}
                className="mono rounded-full border border-line px-4 py-2.5 text-muted transition-colors duration-400 hover:border-accent/60 hover:text-fg"
              >
                {c}
              </motion.span>
            ))}
          </RevealGroup>

          <div className="mt-10 flex flex-wrap gap-3">
            <Btn href={`mailto:${site.email}`}>
              {site.email} <Arrow />
            </Btn>
            <Btn to="/contact" variant="ghost">
              Start a project
            </Btn>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ cta */}
      <section className="container-x pb-8">
        <Reveal>
          <Link
            to="/work"
            className="group flex items-center justify-between gap-6 border-t border-line py-8 transition-colors duration-500 hover:border-accent/50"
          >
            <span className="display text-[clamp(1.75rem,5vw,3.5rem)]">See the work</span>
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-line-2 transition-all duration-500 group-hover:border-accent group-hover:bg-accent group-hover:text-ink sm:h-16 sm:w-16">
              <Arrow className="h-4 w-4" />
            </span>
          </Link>
        </Reveal>
      </section>
    </>
  );
}
