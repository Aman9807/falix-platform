"use client";

import { useInView } from "framer-motion";
import { ReactNode, useRef } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  id?: string;
  delay?: number;
  style?: React.CSSProperties;
}


export default function SectionReveal({ children, className, id, delay = 0, style }: Props) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      id={id}
      className={className}
      style={{
        ...style,
        opacity:    inView ? 1 : 0,
        transform:  inView ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.65s ${delay}s cubic-bezier(0.16,1,0.3,1), transform 0.65s ${delay}s cubic-bezier(0.16,1,0.3,1)`,
      }}
    >
      {children}
    </section>
  );
}
