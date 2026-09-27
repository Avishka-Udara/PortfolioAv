import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { capabilities, site } from "../data/site";
import { categoriesWithWork } from "../data/projects";
import { Arrow, Magnetic } from "./ui";
import { EASE } from "../lib/motion";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-14 border-t border-line bg-ink-2 pt-16 pb-8 sm:mt-20 sm:pt-20">
      {/* ------------------------------------------------------- CTA block */}
      <div className="container-x">
        <div className="grid gap-10 pb-16 sm:pb-20 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-8">
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.7, ease: EASE }}
              className="mono text-accent"
            >
              Available for work
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 30, filter: "blur(14px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.9, ease: EASE }}
              className="display mt-5 text-[clamp(2.25rem,8.5vw,6rem)]"
            >
              Let&rsquo;s make
              <br />
              something{" "}
              <span className="relative inline-block">
                <span className="grad-text">move</span>
                <motion.span
                  className="absolute -right-3 -bottom-1 h-2 w-2 rounded-full bg-accent sm:-right-5"
                  animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                />
              </span>
              .
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
              className="mt-9 flex flex-wrap items-center gap-3"
            >
              <Magnetic>
                <a
                  href={`mailto:${site.email}`}
                  data-cursor="hover"
                  className="mono group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full bg-fg px-7 py-4 text-ink"
                >
                  <span className="absolute inset-0 origin-bottom scale-y-0 bg-accent transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100" />
                  <span className="relative z-10">{site.email}</span>
                  <Arrow className="relative z-10" />
                </a>
              </Magnetic>
              <Magnetic>
                <a
                  href={site.telegram}
                  target="_blank"
                  rel="noreferrer noopener"
                  data-cursor="hover"
                  className="mono inline-flex items-center gap-2.5 rounded-full border border-line-2 px-7 py-4 text-fg transition-colors duration-300 hover:border-accent hover:text-accent"
                >
                  Telegram
                  <Arrow />
                </a>
              </Magnetic>
            </motion.div>
          </div>

          {/* link columns */}
          <div className="grid grid-cols-2 gap-8 lg:col-span-4 lg:grid-cols-1 lg:gap-10">
            <FooterCol title="Explore">
              <FooterLink to="/work">All work</FooterLink>
              <FooterLink to="/work?f=visual">Visual design</FooterLink>
              <FooterLink to="/work?f=motion">Motion</FooterLink>
              <FooterLink to="/work?f=3d">3D & CGI</FooterLink>
              <FooterLink to="/work?f=video">Video</FooterLink>
              <FooterLink to="/about">About</FooterLink>
            </FooterCol>

            <FooterCol title="Capabilities">
              {capabilities
                .filter((c) => categoriesWithWork.includes(c.id))
                .map((c) => (
                  <FooterLink key={c.id} to={`/work?f=${c.id}`}>
                    {c.name}
                  </FooterLink>
                ))}
            </FooterCol>
          </div>
        </div>

        {/* giant wordmark */}
        <div className="edge-fade overflow-hidden pt-4 pb-2">
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1, ease: EASE }}
            className="display outline-type text-center text-[clamp(3.5rem,17vw,13rem)] leading-[0.82] select-none"
          >
            AVISHKA UDARA
          </motion.p>
        </div>

        <div className="mono mt-8 flex flex-col items-center justify-between gap-3 border-t border-line pt-6 text-dim sm:flex-row">
          <p>
            &copy; {year} {site.name} — {site.location}
          </p>
          <p className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            <span>{site.timezone}</span>
            <span className="hidden sm:inline">·</span>
            <span>{site.availability}</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mono mb-4 text-fg">{title}</p>
      <ul className="flex flex-col gap-2.5">{children}</ul>
    </div>
  );
}

function FooterLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        to={to}
        data-cursor="hover"
        className="link-sweep text-sm text-muted transition-colors duration-300 hover:text-accent"
      >
        {children}
      </Link>
    </li>
  );
}
