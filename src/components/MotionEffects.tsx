import { useEffect } from "react";

const INTERACTIVE_SELECTOR = [
  "[data-cursor-reactive='true']",
  ".interactive-lift",
  "button",
  "a",
  "input",
  "textarea",
  "select",
  "[role='button']",
].join(", ");

export function MotionEffects() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const supportsFinePointer = window.matchMedia("(pointer: fine)").matches;

    if (prefersReducedMotion || !supportsFinePointer) {
      return;
    }

    const root = document.documentElement;
    let frame = 0;
    let pointerX = window.innerWidth / 2;
    let pointerY = window.innerHeight / 3;
    let activeElement: HTMLElement | null = null;

    const commitPointer = () => {
      frame = 0;
      root.style.setProperty("--cursor-x", `${pointerX}px`);
      root.style.setProperty("--cursor-y", `${pointerY}px`);
    };

    const requestCommit = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(commitPointer);
    };

    const clearActive = () => {
      if (!activeElement) return;

      activeElement.removeAttribute("data-cursor-active");
      activeElement = null;
    };

    const handlePointerMove = (event: PointerEvent) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      requestCommit();

      const target = event.target as HTMLElement | null;
      const nextActive =
        target?.closest<HTMLElement>(INTERACTIVE_SELECTOR) ?? null;

      if (activeElement !== nextActive) {
        if (activeElement) {
          activeElement.removeAttribute("data-cursor-active");
          // Reset magnetic offset
          activeElement.style.removeProperty("transform");
        }

        activeElement = nextActive;

        if (activeElement) {
          activeElement.setAttribute("data-cursor-active", "true");

          // Check for magnetic property
          const isMagnetic =
            activeElement.hasAttribute("data-magnetic") ||
            activeElement.classList.contains("magnetic");
          if (isMagnetic) {
            activeElement.setAttribute("data-is-magnetic", "true");
          }
        }

        // Update cursor aura state based on what we are hovering
        if (nextActive) {
          const isLarge =
            nextActive.tagName === "A" ||
            nextActive.tagName === "BUTTON" ||
            nextActive.hasAttribute("data-magnetic");
          root.style.setProperty("--cursor-scale", isLarge ? "1.5" : "1");
          root.style.setProperty(
            "--cursor-blend",
            isLarge ? "difference" : "screen",
          );
        } else {
          root.style.setProperty("--cursor-scale", "1");
          root.style.setProperty("--cursor-blend", "screen");
        }
      }

      if (activeElement) {
        const rect = activeElement.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        activeElement.style.setProperty("--pointer-x", `${x}px`);
        activeElement.style.setProperty("--pointer-y", `${y}px`);

        // Magnetic effect logic
        if (activeElement.hasAttribute("data-is-magnetic")) {
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          const distanceX = event.clientX - centerX;
          const distanceY = event.clientY - centerY;

          // Pull strength (0.2 = 20% of distance)
          const pull = 0.25;
          activeElement.style.transform = `translate3d(${distanceX * pull}px, ${distanceY * pull}px, 0)`;
        }
      }
    };

    const handlePointerLeave = () => {
      clearActive();
      root.style.setProperty("--cursor-opacity", "0");
    };

    const handlePointerEnter = () => {
      root.style.setProperty("--cursor-opacity", "1");
    };

    root.style.setProperty("--cursor-opacity", "1");
    commitPointer();
    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });
    window.addEventListener("pointerleave", handlePointerLeave);
    window.addEventListener("pointerenter", handlePointerEnter);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("pointerenter", handlePointerEnter);
      clearActive();

      if (frame) {
        window.cancelAnimationFrame(frame);
      }

      root.style.removeProperty("--cursor-x");
      root.style.removeProperty("--cursor-y");
      root.style.removeProperty("--cursor-opacity");
    };
  }, []);

  return <div aria-hidden="true" className="cursor-aura" />;
}
