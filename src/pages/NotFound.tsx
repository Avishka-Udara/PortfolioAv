import { Link } from "react-router-dom";
import { Btn, Arrow } from "../components/ui";
import { site } from "../data/site";

export default function NotFound() {
  return (
    <section className="container-x grid min-h-[100svh] place-items-center py-32 text-center">
      <div>
        <p className="mono text-accent">Error 404</p>
        <h1 className="display mt-6 text-[clamp(4rem,22vw,14rem)] outline-type">404</h1>
        <p className="mx-auto mt-6 max-w-sm text-sm leading-relaxed text-muted sm:text-base">
          This frame doesn&rsquo;t exist. Let&rsquo;t get you back to the good stuff.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Btn to="/work">
            View work <Arrow />
          </Btn>
          <Btn href={`mailto:${site.email}`} variant="ghost">
            Get in touch
          </Btn>
        </div>
        <p className="mono mt-10 text-dim">
          or <Link to="/" className="link-sweep text-accent">go home</Link>
        </p>
      </div>
    </section>
  );
}
