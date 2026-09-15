import { useEffect } from 'react';

/**
 * Locks page scroll while `locked` is true — used whenever a full-screen
 * overlay (mobile nav drawer, modal, lightbox) is open. Without this the
 * Lenis-smoothed page underneath keeps scrolling/repainting behind the
 * "fixed" overlay, which on some mobile browsers causes the overlay to
 * visually tear/bleed through with whatever is behind it.
 *
 * Pass the Lenis instance (from useSmoothScroll()) as the second argument
 * to also pause smooth-scroll ticking while the overlay is open.
 */
export default function useLockBodyScroll(locked, lenis) {
  useEffect(() => {
    if (!locked) return;

    const scrollY = window.scrollY;
    const { body } = document;

    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    body.style.left = '0';
    body.style.right = '0';
    body.style.width = '100%';

    if (lenis) lenis.stop();

    return () => {
      body.style.position = '';
      body.style.top = '';
      body.style.left = '';
      body.style.right = '';
      body.style.width = '';
      window.scrollTo(0, scrollY);

      if (lenis) lenis.start();
    };
  }, [locked, lenis]);
}
