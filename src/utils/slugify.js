/**
 * Utility to convert string into a URL-friendly slug
 * e.g. "Testimony of Bro Blessed" -> "testimony-of-bro-blessed"
 */
export function slugify(title) {
  if (!title) return '';
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Format bytes to readable string (e.g. 1.2 MB)
 */
export function formatBytes(bytes, decimals = 1) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Ensure every item in a list has a stable, unique `id`.
 *
 * The CMS-managed data/adotopoc.json resources have no id field at all
 * (see admin/config.yml — "adotopoc" collection has no id widget), so
 * resource.id was always undefined for anything served from that file.
 * That made shareable resource links resolve to ".../resource/undefined"
 * and, once opened, the lookup on the detail page matched a resource by
 * coincidence rather than by identity. Rows that already carry a real id
 * (e.g. from a populated Supabase table) are left untouched; everything
 * else gets a slug of its title, de-duplicated against collisions.
 */
export function withStableIds(items, { titleKey = 'title' } = {}) {
  const seen = new Map();
  return (items || []).map((item, index) => {
    if (item && item.id) return item;

    const base = slugify(item?.[titleKey]) || `resource-${index}`;
    const count = seen.get(base) || 0;
    seen.set(base, count + 1);
    const id = count === 0 ? base : `${base}-${count + 1}`;

    return { ...item, id };
  });
}
