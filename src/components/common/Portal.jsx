import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

/**
 * Renders children into document.body instead of wherever this component
 * sits in the React tree.
 *
 * Every full-screen overlay (mobile nav drawer, resource preview modal,
 * prayer request modal, lightbox, etc.) lives several levels deep inside
 * page wrappers that use `overflow-hidden` / `relative` for their own
 * decorative purposes. A `position: fixed` element nested inside one of
 * those ancestors can end up clipped or mis-positioned on some mobile
 * browsers instead of covering the real viewport, which is what caused
 * the overlay to visually "bleed through" with the content behind it.
 * Portaling straight to <body> sidesteps that entirely.
 */
export default function Portal({ children }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;
  return createPortal(children, document.body);
}
