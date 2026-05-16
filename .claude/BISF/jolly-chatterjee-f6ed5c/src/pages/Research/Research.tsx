import {
  createElement,
  useEffect,
  useRef,
  useState,
  useMemo,
  type ReactNode,
  type RefObject,
  type Ref,
} from "react";
import { Link } from "react-router-dom";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  useInView,
} from "framer-motion";
import "./Research.scss";

const IMAGES = ["/r1.png", "/r2.png", "/r3.png", "/r4.png", "/r5.png", "/r6.png"];

const EASE = [0.16, 1, 0.3, 1] as const;

let scrollUnlocked = false;
const unlockListeners = new Set<() => void>();

if (typeof window !== "undefined") {
  const onScroll = () => {
    if (!scrollUnlocked && window.scrollY > 24) {
      scrollUnlocked = true;
      unlockListeners.forEach((fn) => fn());
      unlockListeners.clear();
      window.removeEventListener("scroll", onScroll);
    }
  };
  window.addEventListener("scroll", onScroll, { passive: true });
}

function useScrollUnlock() {
  const [unlocked, setUnlocked] = useState(scrollUnlocked);
  useEffect(() => {
    if (scrollUnlocked) {
      setUnlocked(true);
      return;
    }
    const fn = () => setUnlocked(true);
    unlockListeners.add(fn);
    return () => {
      unlockListeners.delete(fn);
    };
  }, []);
  return unlocked;
}

function useScrollReveal<T extends Element>(ref: RefObject<T | null>) {
  const inView = useInView(ref as RefObject<T>, {
    once: true,
    margin: "0px 0px -26% 0px",
  });
  const unlocked = useScrollUnlock();
  return inView && unlocked;
}

type Tag = "h1" | "h2" | "h3" | "p" | "div" | "span";

interface ScrollTextProps {
  text: string;
  as?: Tag;
  className?: string;
  id?: string;
}

function ScrollText({
  text,
  as: Component = "p",
  className,
  id,
}: ScrollTextProps) {
  const ref = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const words = useMemo(() => text.split(" "), [text]);
  const revealed = useScrollReveal(ref);

  if (prefersReducedMotion) {
    return (
      <Component className={className} id={id}>
        {text}
      </Component>
    );
  }

  return (
    <Component
      ref={ref as Ref<HTMLParagraphElement>}
      className={className}
      id={id}
    >
      {words.map((w, i) => (
        <span key={i}>
          <span
            className={`r__w${revealed ? " r__w--lit" : ""}`}
            style={{ transitionDelay: `${i * 0.022}s` }}
          >
            {w}
          </span>
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </Component>
  );
}

type RevealTag = "div" | "article" | "span" | "p";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: RevealTag;
  id?: string;
}

function Reveal({
  children,
  className,
  delay = 0,
  as = "div",
  id,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const revealed = useScrollReveal(ref);
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return createElement(as, { className, id }, children);
  }

  const MotionComp = motion[as] as typeof motion.div;

  return (
    <MotionComp
      ref={ref}
      className={className}
      id={id}
      initial={{ opacity: 0, y: 22 }}
      animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
      transition={{ duration: 0.8, ease: EASE, delay }}
    >
      {children}
    </MotionComp>
  );
}

interface ParallaxImageProps {
  src: string;
  direction: "left" | "right";
  className: string;
}

function ParallaxImage({ src, direction, className }: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const revealed = useScrollReveal(ref);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const x = useTransform(
    scrollYProgress,
    [0, 0.45, 1],
    direction === "left" ? ["-6%", "0%", "0%"] : ["6%", "0%", "0%"],
  );
  const scale = useTransform(scrollYProgress, [0, 0.45, 1], [0.96, 1, 1]);

  if (prefersReducedMotion) {
    return (
      <div ref={ref} className={className}>
        <img src={src} alt="" loading="lazy" />
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x, scale }}
      initial={{ opacity: 0 }}
      animate={{ opacity: revealed ? 1 : 0 }}
      transition={{ duration: 0.9, ease: EASE }}
    >
      <img src={src} alt="" loading="lazy" />
    </motion.div>
  );
}

function ClosingImage({ src }: { src: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const revealed = useScrollReveal(ref);
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return (
      <div ref={ref} className="r__closing-media">
        <img src={src} alt="" loading="lazy" />
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className="r__closing-media"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={revealed ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.96 }}
      transition={{ duration: 1, ease: EASE }}
    >
      <img src={src} alt="" loading="lazy" />
    </motion.div>
  );
}

const GOALS = [
  {
    n: "01",
    title: "Reveal Systemic Inequality",
    body: "Uncover the layered effects of systemic inequality on Black immigrants through comprehensive data analysis and community driven research.",
  },
  {
    n: "02",
    title: "Design Responsive Programs",
    body: "Create programs that are culturally and contextually responsive to the unique needs and lived realities of Black immigrants.",
  },
  {
    n: "03",
    title: "Advocate for Policy Change",
    body: "Push for policies that address root causes, not just surface level issues affecting Black immigrant communities across the country.",
  },
  {
    n: "04",
    title: "Elevate Lived Experiences",
    body: "Amplify community knowledge and lived experiences as valid, essential, and transformative evidence for lasting change.",
  },
];

export default function Research() {
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    document.title = "Research | Black Immigrants Community Foundation";
    const desc =
      "BICF research uses intersectional and C Factor frameworks to study, support, and advocate for Black immigrants.";
    let meta = document.querySelector<HTMLMetaElement>(
      'meta[name="description"]',
    );
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", desc);
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  return (
    <main className="r" ref={mainRef}>
      <div className="r__bg" aria-hidden="true">
        <div className="r__bg-grid" />
        <div className="r__bg-orb r__bg-orb--1" />
        <div className="r__bg-orb r__bg-orb--2" />
        <div className="r__bg-orb r__bg-orb--3" />
        <div className="r__bg-orb r__bg-orb--4" />
        <div className="r__bg-orb r__bg-orb--5" />
        <div className="r__bg-dots" />
        <div className="r__bg-dots r__bg-dots--2" />
        <div className="r__bg-ring r__bg-ring--1" />
        <div className="r__bg-ring r__bg-ring--2" />
        <div className="r__bg-ring r__bg-ring--3" />
        <div className="r__bg-line r__bg-line--h1" />
        <div className="r__bg-line r__bg-line--h2" />
        <div className="r__bg-line r__bg-line--v1" />
      </div>

      <h1 className="r__sr-only">
        Research at the Black Immigrants Community Foundation
      </h1>

      <section className="r__opening">
        <div className="r__opening-inner">
          <Reveal className="r__research-label">RESEARCH / FINDINGS</Reveal>
          <ScrollText
            as="h2"
            className="r__opening-title"
            text="Our Research Approach"
          />
          <ScrollText
            className="r__opening-sub"
            text="Evidence based insights driving meaningful change for Black immigrants across communities"
          />
        </div>
      </section>

      <section className="r__narrative">
        <div className="r__narrative-inner">
          <ScrollText
            className="r__narrative-block"
            text="At the Black Immigrants Community Foundation, research plays a vital role in how we understand, support, and advocate for Black immigrants. Our studies help shape programs, influence policies, and amplify the lived experiences of the communities we serve."
          />
          <ScrollText
            className="r__narrative-block"
            text="We are committed to producing research that is community centered, culturally grounded, and actionable. Every study we undertake is designed to create real, measurable impact for Black immigrant communities."
          />
          <ScrollText
            className="r__narrative-block"
            text="Our work bridges the gap between academic research and community needs, ensuring that the voices and experiences of Black immigrants are not just documented but actively drive the conversation forward."
          />
        </div>
      </section>

      <section className="r__panel" aria-labelledby="r-intersect">
        <div className="r__panel-media">
          <ParallaxImage
            src={IMAGES[0]}
            direction="left"
            className="r__panel-img"
          />
        </div>
        <div className="r__panel-body">
          <Reveal as="span" className="r__panel-num">
            01
          </Reveal>
          <ScrollText
            as="h2"
            className="r__panel-title"
            id="r-intersect"
            text="Centering Intersectionality"
          />
          <ScrollText
            className="r__panel-text"
            text="Our research is guided by an intersectional framework that recognizes how multiple aspects of identity, including race, gender, class, and immigration status, intersect to shape people's experiences."
          />
          <ScrollText
            className="r__panel-text"
            text="Black immigrants face unique and overlapping challenges that cannot be examined through a single lens. BICF ensures our findings reflect the realities of those most affected by systemic inequality."
          />
        </div>
      </section>

      <section
        className="r__panel r__panel--right"
        aria-labelledby="r-cfactor"
      >
        <div className="r__panel-body">
          <Reveal as="span" className="r__panel-num">
            02
          </Reveal>
          <ScrollText
            as="h2"
            className="r__panel-title"
            id="r-cfactor"
            text={'The "C Factor" Framework'}
          />
          <ScrollText
            className="r__panel-text"
            text="We apply the C Factor, an approach that recognizes race as a constant factor influencing all other aspects of identity. Even when other variables remain the same, race continues to impact access, opportunity, and outcomes."
          />
          <ScrollText
            className="r__panel-text"
            text="This framework helps us uncover how racial bias intensifies inequality and shapes the daily lives of Black immigrants across communities."
          />
        </div>
        <div className="r__panel-media">
          <ParallaxImage
            src={IMAGES[1]}
            direction="right"
            className="r__panel-img"
          />
        </div>
      </section>

      <section className="r__statement">
        <div className="r__statement-inner">
          <ScrollText
            as="h2"
            className="r__statement-text"
            text="Race Remains Constant"
          />
          <ScrollText
            className="r__statement-sub"
            text="Even when all other variables remain the same, race continues to shape access, opportunity, and outcomes for Black immigrants."
          />
        </div>
      </section>

      <section className="r__converge" aria-labelledby="r-drives">
        <div className="r__converge-media">
          <ParallaxImage
            src={IMAGES[2]}
            direction="left"
            className="r__converge-img"
          />
          <ParallaxImage
            src={IMAGES[3]}
            direction="right"
            className="r__converge-img"
          />
        </div>
        <div className="r__converge-body">
          <ScrollText
            as="h2"
            className="r__converge-title"
            id="r-drives"
            text="Research That Drives Change"
          />
          <ScrollText
            className="r__converge-text"
            text="Every study we publish is designed to translate into action, shaping programs, informing policy, and centering the voices of Black immigrant communities in the decisions that affect them."
          />
        </div>
      </section>

      <section className="r__goals" aria-labelledby="r-goals">
        <div className="r__goals-header">
          <ScrollText
            as="h2"
            className="r__goals-title"
            id="r-goals"
            text="Our Research Goals"
          />
          <ScrollText
            className="r__goals-sub"
            text="Through our intersectional and C Factor frameworks, BICF's research aims to:"
          />
        </div>
        <div className="r__goals-grid">
          {GOALS.map((goal) => (
            <Reveal key={goal.n} as="article" className="r__goal">
              <span className="r__goal-num">{goal.n}</span>
              <ScrollText
                as="h3"
                className="r__goal-card-title"
                text={goal.title}
              />
              <ScrollText className="r__goal-body" text={goal.body} />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="r__closing">
        <ClosingImage src={IMAGES[4]} />
        <div className="r__closing-content">
          <Reveal as="article" className="r__closing-block">
            <ScrollText
              as="h2"
              className="r__closing-heading"
              text="Our Commitment"
            />
            <ScrollText
              className="r__closing-text"
              text="We commit to research grounded in community knowledge, driven by the realities of Black immigrants and accountable to the communities we serve."
            />
            <div className="r__closing-actions">
              <Link to="/partner" className="r__btn">
                Partner With Us
              </Link>
            </div>
          </Reveal>
          <Reveal as="article" className="r__closing-block">
            <ScrollText
              as="h2"
              className="r__closing-heading"
              text="Join Our Research Initiatives"
            />
            <ScrollText
              className="r__closing-text"
              text="Whether you are a researcher, partner organization, or community member with a story to share, your participation strengthens our work and amplifies impact."
            />
            <div className="r__closing-actions">
              <Link to="/research/current" className="r__btn">
                Current Studies
              </Link>
              <Link to="/research/studies" className="r__btn r__btn--ghost">
                Read Our Studies
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
