import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Portal from './Portal';
import useLockBodyScroll from '../../utils/useLockBodyScroll';
import { useSmoothScroll } from '../../context/SmoothScroll';

const MIN_VISIBLE_MS = 500;

export default function PageTransitionLoader() {
  const location = useLocation();
  const { lenis } = useSmoothScroll();
  const [visible, setVisible] = useState(false);
  const isFirstRender = useRef(true);
  const hideTimeoutRef = useRef(null);

  useLockBodyScroll(visible, lenis);

  useEffect(() => {
    // The very first paint is already covered by the #site-loader splash
    // screen in index.html — only show this on actual navigations.
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    setVisible(true);
    clearTimeout(hideTimeoutRef.current);
    hideTimeoutRef.current = setTimeout(() => setVisible(false), MIN_VISIBLE_MS);

    return () => clearTimeout(hideTimeoutRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return (
    <Portal>
      <div
        className={`fixed inset-0 z-[300] flex flex-col items-center justify-center gap-4 transition-opacity duration-300 ${
          visible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        style={{ backgroundColor: 'rgba(0,0,0,0.92)' }}
        aria-hidden={!visible}
      >
        <img
          src="/images/Testimonies of Praise.png"
          alt=""
          className="w-14 h-14 object-contain animate-pulse"
        />
        <div className="w-10 h-10 rounded-full border-[3px] border-brand-accent/20 border-t-brand-accent animate-spin" />
      </div>
    </Portal>
  );
}
