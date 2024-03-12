import React, { useRef } from 'react';

export const useRipple = (duration: number = 1000) => {
  const ripplesContainerRef = useRef<HTMLDivElement>(null);

  const createRipple = (event: React.MouseEvent<HTMLElement>) => {
    const container = ripplesContainerRef.current;
    if (!container) return;

    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    container.appendChild(ripple);

    const size = Math.max(container.clientWidth, container.clientHeight);
    const rect = container.getBoundingClientRect();
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    const rippleStyle = {
      top: `${y}px`,
      left: `${x}px`,
      width: `${size}px`,
      height: `${size}px`,
      position: 'absolute',
      borderRadius: '50%',
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      transform: 'translate(-50%, -50%)',
      animation: `ripple-effect ${duration}ms cubic-bezier(0, 0, 0.2, 1) forwards`,
    };

    Object.assign(ripple.style, rippleStyle);

    ripple.addEventListener('animationend', () => {
      ripple.remove();
    });
  };

  return { ripplesContainerRef, createRipple };
};
