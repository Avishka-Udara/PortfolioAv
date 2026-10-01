import { useState } from "react";
import { motion } from "motion/react";
import { SectionHead, Arrow } from "../components/ui";
import { Reveal } from "../components/Reveal";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { capabilities, site } from "../data/site";
import { EASE } from "../lib/motion";
import { cn } from "../lib/utils";
import { useSeo } from "../hooks/useSeo";

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
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [timeline, setTimeline] = useState("");
  const [details, setDetails] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  useSeo({
    title: "Contact Avishka Udara",
    description:
      "Start your next project with Avishka Udara. Professional visual design, motion graphics and 3D animation services. Available for freelance work worldwide with fast turnaround. Get in touch via email or Telegram.",
    path: "/contact",
    keywords: [
      "Contact Avishka Udara",
      "Hire Visual Designer",
      "Motion Graphics Services",
      "3D Animation Services", 
      "Brand Design Services",
      "Freelance Designer Contact",
      "Creative Services Sri Lanka",
      "Design Project Quote",
      "Motion Design Consultation"
    ]
  });

  const toggle = (n: string) =>
    setNeed((cur) => (cur.includes(n) ? cur.filter((x) => x !== n) : [...cur, n]));

  /** Set in .env (VITE_FORMSPREE_ID) to post to a real form instead of mailto. */
  const formId = import.meta.env.VITE_FORMSPREE_ID;
  const delivered = status === "sent";

  const subject = `Project enquiry — ${need.join(", ") || "New project"}`;

  const bodyLines = [
    "Hi Avishka,",
    "",
    "I'd like to talk about a project.",
    "",
    name && `Name: ${name}`,
    email && `Email: ${email}`,
    need.length ? `What I need: ${need.join(", ")}` : "",
    budget ? `Budget: ${budget}` : "",
    timeline ? `Timeline: ${timeline}` : "",
    "",
    "About the project:",
    details,
    "",
    "Thanks!",
  ]
    .filter(Boolean)
    .join("\n");

  const mailto = () =>
    `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines)}`;

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");

    // No form backend configured: hand the composed brief to the mail client.
    if (!formId) {
      window.location.href = mailto();
      setStatus("sent");
      return;
    }

    try {
      const res = await fetch(`https://formspree.io/f/${formId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name,
          email: email || "not given",
          _subject: subject,
          needs: need.join(", ") || "—",
          budget: budget || "Not sure yet",
          timeline: timeline || "—",
          message: details,
        }),
      });
      if (res.ok) {
        setStatus("sent");
        return;
      }
    } catch {
      /* network failure — offer the mailto fallback below */
    }
    setStatus("error");
  };

  return (
    <>
      <header className="container-x pt-32 pb-10 sm:pt-40 sm:pb-14">
        <Breadcrumbs />
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
            <form
              onSubmit={submit}
              noValidate
              className="rounded-2xl border border-line bg-ink-2 p-6 sm:p-8"
            >
              <p className="mono text-accent">Project planner</p>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                Tick what you need, set a rough budget and sketch the brief. Send it straight
                through{formId ? " — I reply within a day or two" : ", or let it open a tidy email in your mail app"}.
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
                        type="button"
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
                        type="button"
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

              {/* contact details + brief */}
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-2">
                  <span className="mono text-dim">Your name</span>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Perera"
                    autoComplete="name"
                    disabled={delivered}
                    className="rounded-xl border border-line bg-ink/60 px-4 py-3 text-sm text-fg outline-none transition-colors duration-300 placeholder:text-dim focus:border-accent/60 disabled:opacity-50"
                  />
                </label>
                <label className="flex flex-col gap-2">
                  <span className="mono text-dim">Email</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jane@company.com"
                    autoComplete="email"
                    disabled={delivered}
                    className="rounded-xl border border-line bg-ink/60 px-4 py-3 text-sm text-fg outline-none transition-colors duration-300 placeholder:text-dim focus:border-accent/60 disabled:opacity-50"
                  />
                </label>
              </div>

              <label className="mt-4 flex flex-col gap-2">
                <span className="mono text-dim">Timeline</span>
                <input
                  type="text"
                  value={timeline}
                  onChange={(e) => setTimeline(e.target.value)}
                  placeholder="Yesterday / this quarter / flexible"
                  disabled={delivered}
                  className="rounded-xl border border-line bg-ink/60 px-4 py-3 text-sm text-fg outline-none transition-colors duration-300 placeholder:text-dim focus:border-accent/60 disabled:opacity-50"
                />
              </label>

              <label className="mt-4 flex flex-col gap-2">
                <span className="mono text-dim">About the project</span>
                <textarea
                  rows={4}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="What you're making, who it's for, anything you've already tried…"
                  disabled={delivered}
                  className="resize-y rounded-xl border border-line bg-ink/60 px-4 py-3 text-sm leading-relaxed text-fg outline-none transition-colors duration-300 placeholder:text-dim focus:border-accent/60 disabled:opacity-50"
                />
              </label>

              {/* summary + cta */}
              <div className="mt-8 flex flex-col gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
                {delivered ? (
                  <p className="mono text-accent">
                    {formId ? "Brief sent — talk soon." : "Opening your mail app…"}
                  </p>
                ) : status === "error" ? (
                  <p className="mono text-hot">
                    Send failed —{" "}
                    <a href={mailto()} className="link-sweep underline">
                      email me directly
                    </a>
                  </p>
                ) : (
                  <p className="mono text-dim">
                    {need.length || budget ? (
                      <>
                        {need.length} selected{budget && ` · ${budget}`}
                      </>
                    ) : (
                      "Nothing selected — just say hi anyway."
                    )}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={status === "sending" || delivered}
                  data-cursor="hover"
                  className="mono group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-full bg-fg px-6 py-3.5 text-ink transition-colors duration-300 hover:bg-accent disabled:opacity-60"
                >
                  <span className="absolute inset-0 origin-bottom scale-y-0 bg-accent transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100" />
                  <span className="relative z-10">
                    {delivered
                      ? "Sent"
                      : status === "sending"
                        ? "Sending…"
                        : formId
                          ? "Send brief"
                          : `Email ${site.name.split(" ")[0]}`}
                  </span>
                  <Arrow className="relative z-10" />
                </button>
              </div>
            </form>
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
