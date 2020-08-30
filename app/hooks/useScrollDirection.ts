import React from "react";

const SCROLL_UP = "up" as const;
const SCROLL_DOWN = "down" as const;

// ref: https://gist.github.com/reecelucas/cd110ece696cca8468db895281fa28cb
export const useScrollDirection = (
  initialDirection: typeof SCROLL_UP | typeof SCROLL_DOWN = SCROLL_UP,
  thresholdPixels = 50,
  off = false,
) => {
  const [scrollDir, setScrollDir] = React.useState(initialDirection);

  React.useEffect(() => {
    let lastScrollY = window.pageYOffset;
    let ticking = false;

    const updateScrollDir = () => {
      const scrollY = window.pageYOffset;

      if (Math.abs(scrollY - lastScrollY) < thresholdPixels) {
        // We haven't exceeded the threshold
        ticking = false;
        return;
      }

      setScrollDir(scrollY > lastScrollY ? SCROLL_DOWN : SCROLL_UP);
      lastScrollY = scrollY > 0 ? scrollY : 0;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollDir);
        ticking = true;
      }
    };

    /**
     * Bind the scroll handler if `off` is set to false.
     * If `off` is set to true reset the scroll direction.
     */
    !off ? window.addEventListener("scroll", onScroll) : setScrollDir(initialDirection);

    return () => window.removeEventListener("scroll", onScroll);
  }, [initialDirection, thresholdPixels, off]);

  return scrollDir === "up";
};
