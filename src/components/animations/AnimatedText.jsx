import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function AnimatedText({
  text,
  className = '',
  as: Component = 'div',
  delay = 0,
  stagger = 0.04
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const words = el.querySelectorAll('.word-span');
    const ctx = gsap.context(() => {
      gsap.fromTo(
        words,
        {
          y: '100%',
          opacity: 0,
          rotateX: -40,
        },
        {
          y: '0%',
          opacity: 1,
          rotateX: 0,
          duration: 0.9,
          ease: 'power3.out',
          stagger: stagger,
          delay: delay,
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, [text, delay, stagger]);

  const words = (text || '').split(' ');

  return (
    <Component
      ref={containerRef}
      className={`inline-block overflow-hidden perspective-1000 ${className}`}
      style={{ perspective: '1000px' }}
    >
      {words.map((word, i) => (
        <span
          key={i}
          className="word-span inline-block will-change-transform mr-[0.25em]"
        >
          {word}
        </span>
      ))}
    </Component>
  );
}
