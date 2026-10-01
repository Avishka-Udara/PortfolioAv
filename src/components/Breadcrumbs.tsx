/**
 * Breadcrumbs component for navigation and SEO
 */
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { bySlug } from "../data/projects";

export function Breadcrumbs() {
  const location = useLocation();
  const pathname = location.pathname;

  const breadcrumbs = generateBreadcrumbs(pathname);

  // Update breadcrumb structured data
  useEffect(() => {
    updateBreadcrumbStructuredData(breadcrumbs);
  }, [pathname]);

  // Don't show breadcrumbs on homepage
  if (pathname === '/') return null;

  return (
    <nav aria-label="Breadcrumb" className="mb-8" itemScope itemType="https://schema.org/BreadcrumbList">
      <ol className="flex items-center space-x-2 text-sm text-zinc-400">
        {breadcrumbs.map((breadcrumb, index) => (
          <li 
            key={breadcrumb.url || breadcrumb.name} 
            className="flex items-center"
            itemProp="itemListElement"
            itemScope 
            itemType="https://schema.org/ListItem"
          >
            {index > 0 && <span className="mx-2 text-zinc-600" aria-hidden="true">/</span>}
            {breadcrumb.url ? (
              <a 
                href={breadcrumb.url}
                className="hover:text-zinc-200 transition-colors"
                itemProp="item"
                {...(index === breadcrumbs.length - 1 && { 'aria-current': 'page' })}
              >
                <span itemProp="name">{breadcrumb.name}</span>
              </a>
            ) : (
              <span className="text-zinc-200" itemProp="name">{breadcrumb.name}</span>
            )}
            <meta itemProp="position" content={String(index + 1)} />
          </li>
        ))}
      </ol>
    </nav>
  );
}

interface Breadcrumb {
  name: string;
  url?: string;
}

function generateBreadcrumbs(pathname: string): Breadcrumb[] {
  const breadcrumbs: Breadcrumb[] = [
    { name: "Avishka Udara", url: "/" }
  ];

  const segments = pathname.split('/').filter(Boolean);

  if (segments.length === 0) return [];

  switch (segments[0]) {
    case 'work':
      breadcrumbs.push({ name: "Work", url: "/work" });
      
      if (segments[1]) {
        const project = bySlug(segments[1]);
        if (project) {
          breadcrumbs.push({ 
            name: project.title,
            // Don't add URL for current page
          });
        }
      }
      break;

    case 'about':
      breadcrumbs.push({ name: "About" });
      break;

    case 'contact':
      breadcrumbs.push({ name: "Contact" });
      break;

    default:
      breadcrumbs.push({ name: segments[0] });
  }

  return breadcrumbs;
}

function updateBreadcrumbStructuredData(breadcrumbs: Breadcrumb[]) {
  // Remove existing breadcrumb structured data
  const existing = document.querySelector('script[data-breadcrumbs="true"]');
  if (existing) {
    existing.remove();
  }

  // Generate new breadcrumb structured data
  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((breadcrumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": breadcrumb.name,
      ...(breadcrumb.url && { 
        "item": `https://avishkaudara.com${breadcrumb.url}` 
      })
    }))
  };

  // Add to document head
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.setAttribute('data-breadcrumbs', 'true');
  script.textContent = JSON.stringify(breadcrumbStructuredData, null, 2);
  document.head.appendChild(script);
}