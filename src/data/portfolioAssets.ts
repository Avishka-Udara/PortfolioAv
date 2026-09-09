import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export type PortfolioCategory = 'branding' | 'logos' | '2d' | '3d' | 'designing';
export type PortfolioMediaType = 'image' | 'video';

export interface PortfolioAsset {
  id: string;
  category: PortfolioCategory;
  type: PortfolioMediaType;
  src: string;
  title: string;
  alt: string;
  collection: string;
  filename: string;
}

export const categoryMeta: Record<
  PortfolioCategory,
  {
    label: string;
    eyebrow: string;
    description: string;
    accent: string;
  }
> = {
  branding: {
    label: 'Branding',
    eyebrow: 'Graphics',
    description: 'Campaign visuals, packaging, posters, and social media systems.',
    accent: 'from-amber-300 via-orange-500 to-rose-500'
  },
  logos: {
    label: 'Logos',
    eyebrow: 'Identity',
    description: 'Marks, symbols, and scalable brand signatures.',
    accent: 'from-sky-300 via-cyan-400 to-blue-500'
  },
  '2d': {
    label: '2D Motion',
    eyebrow: 'Animation',
    description: 'Explainers, promos, looping motion graphics, and GIF moments.',
    accent: 'from-fuchsia-300 via-pink-500 to-red-500'
  },
  '3d': {
    label: '3D Spatial',
    eyebrow: 'Depth',
    description: 'Rendered objects, spatial experiments, and cinematic product scenes.',
    accent: 'from-emerald-300 via-teal-400 to-cyan-500'
  },
  designing: {
    label: 'Design & Composition',
    eyebrow: 'Visuals',
    description: 'UI layouts, image compositions, photo manipulations, and structural designs.',
    accent: 'from-purple-400 via-indigo-500 to-blue-500'
  }
};

const PUBLIC_ROOT = fileURLToPath(new URL('../../public/', import.meta.url));

const CATEGORY_ROOTS: Record<PortfolioCategory, string[]> = {
  branding: ['Graphics'],
  logos: ['Logos_png', 'companies_and_NGO_i_works_with'],
  '2d': ['2D'],
  '3d': ['3D'],
  designing: ['Designings']
};

const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif', '.svg']);
const VIDEO_EXTENSIONS = new Set(['.mp4', '.webm', '.mov', '.m4v']);

function readFilesRecursive(folderPath: string): string[] {
  const entries = fs.readdirSync(folderPath, { withFileTypes: true });

  return entries
    .sort((a, b) => a.name.localeCompare(b.name))
    .flatMap((entry) => {
      const absolutePath = path.join(folderPath, entry.name);
      return entry.isDirectory() ? readFilesRecursive(absolutePath) : absolutePath;
    });
}

function humanize(value: string) {
  return value
    .replace(/\.[^.]+$/, '')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/\bver\b/gi, 'version')
    .replace(/\bqtg\b/gi, 'QTG')
    .trim();
}

function titleCase(value: string) {
  return value.replace(/\w\S*/g, (segment) => segment[0].toUpperCase() + segment.slice(1));
}

function toPublicPath(absolutePath: string) {
  return `/${path.relative(PUBLIC_ROOT, absolutePath).split(path.sep).join('/')}`;
}

function inferType(extension: string): PortfolioMediaType | null {
  if (VIDEO_EXTENSIONS.has(extension)) {
    return 'video';
  }

  if (IMAGE_EXTENSIONS.has(extension)) {
    return 'image';
  }

  return null;
}

function createAsset(category: PortfolioCategory, absolutePath: string): PortfolioAsset | null {
  const extension = path.extname(absolutePath).toLowerCase();
  const type = inferType(extension);

  if (!type) {
    return null;
  }

  const filename = path.basename(absolutePath);
  const rootMatch = CATEGORY_ROOTS[category]
    .map((folder) => path.join(PUBLIC_ROOT, folder))
    .find((folder) => absolutePath.startsWith(folder));
  const relativeFolder = path.dirname(path.relative(rootMatch || PUBLIC_ROOT, absolutePath));
  const collection = relativeFolder === '.' ? categoryMeta[category].label : titleCase(humanize(relativeFolder));
  const title = titleCase(humanize(filename));
  const src = toPublicPath(absolutePath);

  return {
    id: `${category}-${src.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    category,
    type,
    src,
    title,
    alt: `${title} by Avishka Udara`,
    collection,
    filename
  };
}

function collectCategory(category: PortfolioCategory) {
  return CATEGORY_ROOTS[category].flatMap((folder) => {
    const root = path.join(PUBLIC_ROOT, folder);

    if (!fs.existsSync(root)) {
      return [] as PortfolioAsset[];
    }

    return readFilesRecursive(root)
      .map((absolutePath) => createAsset(category, absolutePath))
      .filter((asset): asset is PortfolioAsset => Boolean(asset));
  });
}

export const portfolioAssets = (Object.keys(CATEGORY_ROOTS) as PortfolioCategory[])
  .flatMap((category) => collectCategory(category))
  .sort((left, right) => left.src.localeCompare(right.src));

export const homepageShowcases = {
  branding: portfolioAssets.filter((asset) => asset.category === 'branding').slice(0, 6),
  logos: portfolioAssets.filter((asset) => asset.category === 'logos'),
  motion2d: portfolioAssets.filter((asset) => asset.category === '2d').slice(0, 6),
  spatial3d: portfolioAssets.filter((asset) => asset.category === '3d').slice(0, 6),
  designing: portfolioAssets.filter((asset) => asset.category === 'designing').slice(0, 6)
};

export function toEncodedAssetPath(src: string) {
  return src
    .split('/')
    .map((segment, index) => (index === 0 ? segment : encodeURIComponent(segment)))
    .join('/');
}
