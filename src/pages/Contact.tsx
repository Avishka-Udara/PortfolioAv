import { useState } from "react";
import { motion } from "motion/react";
import { SectionHead, Arrow } from "../components/ui";
import { Reveal } from "../components/Reveal";
import { capabilities, site } from "../data/site";
import { EASE } from "../lib/motion";
import { cn } from "../lib/utils";

const budgets = ["< $500", "$500 – $2k", "$2k – $5k", "$5k +", "Not sure yet"];
const needs = [
  "Brand identity",
  "Social media kit",
  "Motion / animation",
  "3D / CGI",
  "Video editing",
  "Website / UI",
  "Something else",
];

export default function Contact() {
  const [need, setNeed] = useState<string[]>([]);
  const [budget, setBudget] = useState("");
  const [sent, setSent] = useState(false);

  const toggle = (n: string) =>
    setNeed((cur) => (cur.includes(n) ? cur.filter((x) => x !== n) : [...cur, n]));

  const mailto = () => {
    const subject = `Project enquiry — ${need.join(", ") || "New project"}`;
    const body = [
      "Hi Avishka,",
      "",
      "I'd like to talk about a project.",
      "",
      need.length ? `What I need: ${need.join(", ")}` : "",
      budget ? `Budget: ${budget}` : "",
      "",
      "Timeline:",
      "Budget:",
      "About the project:",
      "",
      "Thanks!",
    ]
      .filter(Boolean)
      .join("\n");
    return `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <>
      <header className="container-x pt-32 pb-10 sm:pt-40 sm:pb-14">
        <SectionHead
          eyebrow="Contact"
          title={
            <>
              Tell me what
              <br />
              you&rsquo;re <span className="text-accent">making</span>
            </>
          }
          lede={site.availability}
        />
      </header>

      <section className="container-x pb-20 sm:pb-28">
        <div className="grid gap-6 lg:grid-cols-12">
          {/* ------------------------------------------------- direct links */}
          <Reveal className="lg:col-span-5">
            <div className="flex h-full flex-col gap-px overflow-hidden rounded-2xl border border-line bg-line">
              <ContactTile
                label="Email"
                value={site.email}
                href={`mailto:${site.email}`}
                accent
              />
              <ContactTile
                label="Telegram"
                value={site.telegramHandle}
                href={site.telegram}
                note="Fastest reply"
              />
              <ContactTile label="Location" value={site.location} note={site.timezone} />
              <ContactTile
                label="Full archive"
                value="Google Drive"
                href={site.drive}
                note="All projects & source files"
              />
            </div>
          </Reveal>

          {/* ------------------------------------------------------ planner */}
          <Reveal delay={0.12} className="lg:col-span-7">
            <div className="rounded-2xl border border-line bg-ink-2 p-6 sm:p-8">
              <p className="mono text-accent">Project planner</p>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                Tick what you need and set a rough budget. This just builds a tidy email for
                you — no forms, no signup, no newsletter.
              </p>

              {/* needs */}
              <fieldset className="mt-8">
                <legend className="mono mb-4 text-dim">What do you need?</legend>
                <div className="flex flex-wrap gap-2">
                  {needs.map((n) => {
                    const on = need.includes(n);
                    return (
                      <button
                        key={n}
                        onClick={() => toggle(n)}
                        data-cursor="hover"
                        className={cn(
                          "mono relative overflow-hidden rounded-full border px-3.5 py-2.5 transition-colors duration-300",
                          on
                            ? "border-accent bg-accent text-ink"
                            : "border-line text-muted hover:border-line-2 hover:text-fg"
                        )}
                      >
                        {on && (
                          <motion.span
                            layoutId="need-dot"
                            className="absolute inset-0 -z-10 bg-accent"
                            transition={{ type: "spring", stiffness: 380, damping: 32 }}
                          />
                        )}
                        {n}
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              {/* budget */}
              <fieldset className="mt-8">
                <legend className="mono mb-4 text-dim">Rough budget</legend>
                <div className="flex flex-wrap gap-2">
                  {budgets.map((b) => {
                    const on = budget === b;
                    return (
                      <button
                        key={b}
                        onClick={() => setBudget(on ? "" : b)}
                        data-cursor="hover"
                        className={cn(
                          "mono relative overflow-hidden rounded-full border px-3.5 py-2.5 transition-colors duration-300",
                          on ? "border-accent text-ink" : "border-line text-muted hover:border-line-2 hover:text-fg"
                        )}
                      >
                        {on && (
                          <motion.span
                            layoutId="budget-dot"
                            className="absolute inset-0 -z-10 bg-accent"
                            transition={{ type: "spring", stiffness: 380, damping: 32 }}
                          />
                        )}
                        {b}
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              {/* summary + cta */}
              <div className="mt-8 flex flex-col gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
                <p className="mono text-dim">
                  {need.length || budget ? (
                    <>
                      {need.length} selected{need.length === 1 ? "" : ""}
                      {budget && ` · ${budget}`}
                    </>
                  ) : (
                    "Nothing selected — just say hi anyway."
                  )}
                </p>
                <a
                  href={mailto()}
                  onClick={() => setSent(true)}
                  data-cursor="hover"
                  className="mono group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-full bg-fg px-6 py-3.5 text-ink"
                >
                  <span className="absolute inset-0 origin-bottom scale-y-0 bg-accent transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100" />
                  <span className="relative z-10">
                    {sent ? "Opening your mail app" : `Email ${site.name.split(" ")[0]}`}
                  </span>
                  <Arrow className="relative z-10" />
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* --------------------------------------------------- capabilities cta */}
      <section className="container-x pb-8">
        <Reveal>
          <div className="rounded-3xl border border-line bg-ink-2 p-8 sm:p-12">
            <p className="mono text-accent">Not sure what you need?</p>
            <h2 className="display mt-4 text-[clamp(1.6rem,4vw,2.75rem)]">
              Here&rsquo;s everything on the menu
            </h2>
            <div className="mt-8 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
              {capabilities.map((c, i) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.6, delay: i * 0.06, ease: EASE }}
                >
                  <p className="mono text-accent">{c.index}</p>
                  <p className="mt-2 text-sm font-semibold tracking-[-0.02em]">{c.name}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{c.blurb}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}

function ContactTile({
  label,
  value,
  href,
  note,
  accent,
}: {
  label: string;
  value: string;
  href?: string;
  note?: string;
  accent?: boolean;
}) {
  const body = (
    <>
      <p className="mono text-dim">{label}</p>
      <p
        className={cn(
          "mt-2 text-lg font-semibold tracking-[-0.025em] transition-colors duration-300 sm:text-xl",
          href ? "group-hover:text-accent" : "text-fg",
          accent && !href && "text-accent"
        )}
      >
        {value}
      </p>
      {note && <p className="mono mt-2 text-dim">{note}</p>}
      {href && (
        <span className="mono mt-4 inline-flex items-center gap-2 text-muted transition-colors duration-300 group-hover:text-accent">
          Open
          <Arrow />
        </span>
      )}
    </>
  );

  const cls = "block flex-1 bg-ink p-5 transition-colors duration-500 hover:bg-ink-3 sm:p-6";

  return href ? (
    <a href={href} target={href.startsWith("mailto") ? undefined : "_blank"} rel="noreferrer noopener" data-cursor="hover" className={cls}>
      {body}
    </a>
  ) : (
    <div className={cls}>{body}</div>
  );
}
