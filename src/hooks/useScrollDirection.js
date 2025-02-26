import { useState, useEffect } from 'react';

const useScrollDirection = (options = {}) => {
  const {
    initialDirection = 'up',
    thresholdPixels = 10,
    off = false
  } = options;

  const [scrollDirection, setScrollDirection] = useState(initialDirection);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [ticking, setTicking] = useState(false);

  useEffect(() => {
    const updateScrollDirection = () => {
      const scrollY = window.pageYOffset;

      if (Math.abs(scrollY - lastScrollY) < thresholdPixels) {
        // We haven't exceeded the threshold
        setTicking(false);
        return;
      }

      // This is to avoid updating state on small scroll amounts
      const direction = scrollY > lastScrollY ? 'down' : 'up';
      if (direction !== scrollDirection) {
        setScrollDirection(direction);
      }

      setLastScrollY(scrollY > 0 ? scrollY : 0);
      setTicking(false);
    };

    const onScroll = () => {
      if (!off && !ticking) {
        setTicking(true);
        requestAnimationFrame(updateScrollDirection);
      }
    };

    // Passive event listener to improve scroll performance
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => window.removeEventListener('scroll', onScroll);
  }, [scrollDirection, lastScrollY, ticking, off, thresholdPixels]);

  return scrollDirection;
};

export default useScrollDirection; 