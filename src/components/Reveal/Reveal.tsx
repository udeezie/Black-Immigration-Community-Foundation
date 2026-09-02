/* Shared scroll-into-view animation.
   
      Wraps children in a motion element that fades and lifts once, the first
      time it enters the viewport. `as` picks the element so the markup stays
      semantic. Honours prefers-reduced-motion by rendering a plain element.
   
      Note: it forwards only the props listed in its type. Adding ARIA
      attributes (role, aria-label) to a <Reveal> will not compile; put them on a
      plain element inside it instead. */

import { createElement, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;
const VIEWPORT = { once: true, margin: "0px 0px -10% 0px" } as const;

const map = {
  div: motion.div,
  section: motion.section,
  article: motion.article,
  span: motion.span,
  p: motion.p,
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  li: motion.li,
  ul: motion.ul,
  figure: motion.figure,
  blockquote: motion.blockquote,
  header: motion.header,
} as const;

export type RevealTag = keyof typeof map;

type Props = {
  children: ReactNode;
  as?: RevealTag;
  className?: string;
  id?: string;
  delay?: number;
  y?: number;
  duration?: number;
};

export default function Reveal({
  children,
  as = "div",
  className,
  id,
  delay = 0,
  y = 22,
  duration = 0.7,
}: Props) {
  const reduce = useReducedMotion();
  if (reduce) return createElement(as, { className, id }, children);

  const Comp = map[as];
  return (
    <Comp
      id={id}
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration, delay, ease: EASE }}
    >
      {children}
    </Comp>
  );
}
