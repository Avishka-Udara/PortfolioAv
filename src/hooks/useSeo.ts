import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { setSeo, type SeoInput } from "../lib/seo";

/**
 * Sets document metadata for the current route. Re-runs on navigation so a
 * deep link into a project previews that project, not the generic site card.
 */
export function useSeo(input: SeoInput = {}) {
  const { pathname } = useLocation();

  useEffect(() => {
    setSeo(input);
    // input is compared by value — an inline object each render is fine
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(input), pathname]);
}
