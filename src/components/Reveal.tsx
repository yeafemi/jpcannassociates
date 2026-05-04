import type {
  ComponentPropsWithoutRef,
  CSSProperties,
  ElementType,
  ReactNode,
} from "react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type RevealProps<T extends ElementType> = {
  as?: T;
  children: ReactNode;
  className?: string;
  delay?: "0" | "1" | "2" | "3" | "4";
  variant?: "up" | "left" | "right" | "scale";
  threshold?: number;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children" | "className">;

export function Reveal<T extends ElementType = "div">({
  as,
  children,
  className,
  delay = "0",
  variant = "up",
  threshold = 0.2,
  style,
  ...props
}: RevealProps<T>) {
  const Component = (as ?? "div") as ElementType;
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setVisible(true);
      setProgress(1);
      return;
    }

    let frame = 0;

    const updateProgress = () => {
      frame = 0;

      const currentNode = ref.current;
      if (!currentNode) return;

      const rect = currentNode.getBoundingClientRect();
      const viewportHeight = window.innerHeight || 1;
      const travel = viewportHeight + rect.height * 0.9;
      const nextProgress = Math.min(
        1,
        Math.max(0, (viewportHeight - rect.top + rect.height * 0.18) / travel),
      );

      setVisible(nextProgress >= threshold * 0.45);
      setProgress((current) =>
        Math.abs(current - nextProgress) > 0.02 ? nextProgress : current,
      );
    };

    const requestUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateProgress);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting || progress > threshold * 0.45);
        requestUpdate();
      },
      {
        threshold: [0, threshold, 0.35, 0.6, 1],
        rootMargin: "0px 0px -6% 0px",
      },
    );

    observer.observe(node);
    updateProgress();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);

      if (frame) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, [progress, threshold]);

  const motionStyle = {
    ...style,
    "--reveal-progress": progress.toFixed(3),
  } as CSSProperties;

  return (
    <Component
      ref={ref}
      data-visible={visible}
      className={cn(
        "motion-reveal",
        `motion-${variant}`,
        `motion-delay-${delay}`,
        className,
      )}
      style={motionStyle}
      {...props}
    >
      {children}
    </Component>
  );
}
