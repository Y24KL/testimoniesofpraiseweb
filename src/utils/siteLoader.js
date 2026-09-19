const MIN_VISIBLE_MS = 650;
const FADE_MS = 600;

const mountedAt = typeof performance !== 'undefined' ? performance.now() : Date.now();

/**
 * Fades out and removes the #site-loader element defined in index.html.
 * Call once, from the top-level App component, after first mount — this
 * ties the loader to the real React app being ready rather than to
 * window 'load' (which can fire before code-split chunks/fonts are
 * actually usable, or well after the app has already painted).
 *
 * Waits out a minimum visible time so the loader never just flashes on
 * fast connections, which would read as a glitch rather than a loader.
 */
export function hideSiteLoader() {
  const el = document.getElementById('site-loader');
  if (!el) return;

  const elapsed = (typeof performance !== 'undefined' ? performance.now() : Date.now()) - mountedAt;
  const wait = Math.max(0, MIN_VISIBLE_MS - elapsed);

  setTimeout(() => {
    el.classList.add('site-loader--hidden');
    setTimeout(() => el.remove(), FADE_MS);
  }, wait);
}
