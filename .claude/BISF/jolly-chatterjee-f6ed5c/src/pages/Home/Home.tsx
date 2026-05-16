import {
  createElement,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type Ref,
  type RefObject,
} from "react";
import { Link } from "react-router-dom";
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import "./Home.scss";

const HERO_EASE = [0.25, 0.46, 0.45, 0.94] as const;
const REVEAL_EASE = [0.16, 1, 0.3, 1] as const;

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
    margin: "0px 0px -22% 0px",
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
            className={`home__w${revealed ? " home__w--lit" : ""}`}
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
      transition={{ duration: 0.8, ease: REVEAL_EASE, delay }}
    >
      {children}
    </MotionComp>
  );
}

interface ParallaxImageProps {
  src: string;
  direction: "left" | "right";
  className: string;
  alt?: string;
}

function ParallaxImage({
  src,
  direction,
  className,
  alt = "",
}: ParallaxImageProps) {
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
        <img src={src} alt={alt} loading="lazy" />
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
      transition={{ duration: 0.9, ease: REVEAL_EASE }}
    >
      <img src={src} alt={alt} loading="lazy" />
    </motion.div>
  );
}

const heroSlides = [
  {
    label: "Welcome to BICF",
    title: ["Collective growth", "starts with you."],
    body: "The Black Immigrants Community Foundation advocates for, equips, and stands beside Black immigrants as they build new futures rooted in community and dignity.",
  },
  {
    label: "Our Mission",
    title: ["Practical support.", "Powerful advocacy."],
    body: "We empower Black immigrants with the resources, voice, and community they need to dismantle systemic inequality, one life, one family, one neighborhood at a time.",
  },
  {
    label: "Our Vision",
    title: ["A world that sees,", "values, and celebrates."],
    body: "We envision communities where Black immigrants are not just accepted but celebrated. Free from discrimination, free to thrive.",
  },
];

const SERVICES = [
  {
    n: "01",
    title: "Legal Assistance",
    body: "Guidance through immigration processes, rights protection, and access to the legal expertise that makes navigating a new country possible.",
    img: "/b1.png",
  },
  {
    n: "02",
    title: "Educational Support",
    body: "Scholarships, tutoring, and academic resources that open doors and turn potential into opportunity for every learner we serve.",
    img: "/b2.png",
  },
  {
    n: "03",
    title: "Mental Health and Wellness",
    body: "Culturally grounded counseling and wellness programs that meet our community where they are and walk with them toward healing.",
    img: "/b3.png",
  },
  {
    n: "04",
    title: "Employment Support",
    body: "Job placement, resume coaching, and career development pathways that help Black immigrants build lasting and meaningful careers.",
    img: "/b4.png",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Reach Out",
    body: "Share your story with us. Every conversation begins with listening, without judgment and without pressure.",
  },
  {
    n: "02",
    title: "We Match You",
    body: "Our team connects you with the right resources, programs, and people across our community network.",
  },
  {
    n: "03",
    title: "We Walk With You",
    body: "Ongoing support, advocacy, and community for as long as you need us beside you on the journey.",
  },
];

const TESTIMONIALS = [
  {
    name: "Amina",
    quote:
      "BICF's educational programs made it easier for me to navigate the Canadian education system. From school applications to scholarships, their guidance gave me hope and direction.",
  },
  {
    name: "Samuel",
    quote:
      "After facing discrimination at work, BICF stood by me and helped me find my voice. Their advocacy reminded me that my rights matter.",
  },
  {
    name: "Nadiae",
    quote:
      "Moving to a new country was lonely, but BICF's community programs helped me connect with others and find belonging.",
  },
  {
    name: "Anim",
    quote:
      "The counseling and wellness programs helped me manage the stress of immigration. Their culturally sensitive approach gave me healing and strength.",
  },
  {
    name: "Chinyera",
    quote:
      "As a parent, I appreciate BICF's youth and family programs. They help my children grow confidently while staying proud of their heritage.",
  },
  {
    name: "James",
    quote:
      "BICF's financial literacy workshops taught me how to manage my money wisely. I now feel confident budgeting, saving, and planning for the future.",
  },
];

const PARTNERS = [
  { name: "Government of Ontario", img: "/ontario.png" },
  { name: "Ontario Trillium Foundation", img: "/otf.png" },
  { name: "Black Business Initiative", img: "/bbi.png" },
  {
    name: "Government of Canada — Supporting Black Canadian Communities Initiative",
    img: "/canada.png",
  },
];

type HomeProps = {
  pageTitle?: string;
  autoplayDelay?: number;
};

export default function Home({
  pageTitle = "Home | Black Immigrants Community Foundation",
  autoplayDelay = 8000,
}: HomeProps) {
  const [activeSlide, setActiveSlide] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    document.title = pageTitle;
  }, [pageTitle]);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setActiveSlide((i) => (i + 1) % heroSlides.length);
    }, autoplayDelay);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [activeSlide, autoplayDelay]);

  const goTo = (i: number) =>
    setActiveSlide(
      ((i % heroSlides.length) + heroSlides.length) % heroSlides.length,
    );

  const onTabsKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      const next =
        e.key === "ArrowRight"
          ? (activeSlide + 1) % heroSlides.length
          : (activeSlide - 1 + heroSlides.length) % heroSlides.length;
      setActiveSlide(next);
      tabsRef.current[next]?.focus();
    } else if (e.key === "Home") {
      e.preventDefault();
      setActiveSlide(0);
      tabsRef.current[0]?.focus();
    } else if (e.key === "End") {
      e.preventDefault();
      const last = heroSlides.length - 1;
      setActiveSlide(last);
      tabsRef.current[last]?.focus();
    }
  };

  return (
    <main className="home">
      <section className="home__hero" aria-labelledby="home-hero-title">
        <div
          className="home__hero-pattern"
          aria-hidden="true"
          data-slide={activeSlide}
        />
        <div className="home__hero-veil" aria-hidden="true" />

        <div className="home__hero-panel">
          <div className="home__hero-panel-inner">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlide}
                id={`hero-panel-${activeSlide}`}
                role="tabpanel"
                aria-labelledby={`hero-tab-${activeSlide}`}
                className="home__hero-slide"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.5, ease: HERO_EASE }}
              >
                <span className="home__hero-label">
                  {heroSlides[activeSlide].label}
                </span>
                <h1 id="home-hero-title" className="home__hero-title">
                  {heroSlides[activeSlide].title.map((line, i) => (
                    <span key={i} className="home__hero-line">
                      {line}
                    </span>
                  ))}
                </h1>
                <p className="home__hero-body">
                  {heroSlides[activeSlide].body}
                </p>
              </motion.div>
            </AnimatePresence>

            <div className="home__hero-controls">
              <button
                type="button"
                className="home__hero-nav"
                onClick={() => goTo(activeSlide - 1)}
                aria-label="Previous slide"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M15 6L9 12L15 18"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <div
                className="home__hero-bars"
                role="tablist"
                aria-label="Hero slides"
                onKeyDown={onTabsKeyDown}
              >
                {heroSlides.map((_, i) => (
                  <button
                    key={i}
                    ref={(el) => {
                      tabsRef.current[i] = el;
                    }}
                    type="button"
                    role="tab"
                    id={`hero-tab-${i}`}
                    aria-controls={`hero-panel-${i}`}
                    aria-selected={i === activeSlide}
                    tabIndex={i === activeSlide ? 0 : -1}
                    aria-label={`Go to slide ${i + 1}`}
                    className={`home__hero-bar ${i === activeSlide ? "home__hero-bar--active" : ""}`}
                    onClick={() => setActiveSlide(i)}
                  />
                ))}
              </div>

              <button
                type="button"
                className="home__hero-nav"
                onClick={() => goTo(activeSlide + 1)}
                aria-label="Next slide"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M9 6L15 12L9 18"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            <div className="home__hero-meta">
              <span>Ajax, Ontario</span>
              <span aria-hidden="true">·</span>
              <span>(905) 931 3776</span>
            </div>
          </div>
        </div>
      </section>

      <section className="home__stat" aria-label="Our impact">
        <div className="home__stat-inner">
          <Reveal className="home__section-label">Our Impact</Reveal>
          <ScrollText
            as="h2"
            className="home__stat-number"
            text="2,500+ lives touched."
          />
          <ScrollText
            className="home__stat-sub"
            text="Building belonging across Ontario, one family, one neighborhood, one future at a time."
          />
        </div>
      </section>

      <section className="home__about" aria-labelledby="home-about-title">
        <div className="home__about-inner">
          <Reveal className="home__section-label">About BICF</Reveal>
          <ScrollText
            as="h2"
            id="home-about-title"
            className="home__section-title"
            text="Rooted in community. Driven by justice."
          />
          <ScrollText
            className="home__about-body"
            text="The Black Immigrants Community Foundation is a nonprofit dedicated to supporting Black immigrants through advocacy, resources, and culturally grounded programs. From the moment someone arrives, we are here, helping them find footing, voice, and belonging."
          />
          <ScrollText
            className="home__about-body"
            text="Our work bridges policy and lived experience, weaving together legal, educational, wellness, and economic supports into one cohesive ecosystem of care."
          />
          <Reveal className="home__about-cta" delay={0.1}>
            <Link to="/about" className="home__btn">
              Learn More
            </Link>
          </Reveal>
        </div>
      </section>

      <section
        className="home__services"
        aria-labelledby="home-services-title"
      >
        <div className="home__services-head">
          <Reveal className="home__section-label">Our Services</Reveal>
          <ScrollText
            as="h2"
            id="home-services-title"
            className="home__section-title"
            text="Comprehensive support for the Black immigrant community."
          />
        </div>
        <div className="home__services-list">
          {SERVICES.map((s, i) => {
            const isRight = i % 2 === 1;
            return (
              <article
                key={s.n}
                className={`home__panel${isRight ? " home__panel--right" : ""}`}
              >
                <div className="home__panel-media">
                  <ParallaxImage
                    src={s.img}
                    direction={isRight ? "right" : "left"}
                    className="home__panel-img"
                    alt={s.title}
                  />
                </div>
                <div className="home__panel-body">
                  <Reveal as="span" className="home__panel-num">
                    {s.n}
                  </Reveal>
                  <ScrollText
                    as="h3"
                    className="home__panel-title"
                    text={s.title}
                  />
                  <ScrollText className="home__panel-text" text={s.body} />
                </div>
              </article>
            );
          })}
        </div>
        <Reveal className="home__services-cta" delay={0.1}>
          <Link to="/services" className="home__btn">
            View All Services
          </Link>
        </Reveal>
      </section>

      <section className="home__process" aria-labelledby="home-process-title">
        <div className="home__process-head">
          <Reveal className="home__section-label">How We Help</Reveal>
          <ScrollText
            as="h2"
            id="home-process-title"
            className="home__section-title"
            text="A path forward, walked together."
          />
        </div>
        <div className="home__process-grid">
          {STEPS.map((step) => (
            <Reveal as="article" key={step.n} className="home__step">
              <span className="home__step-num">{step.n}</span>
              <ScrollText
                as="h3"
                className="home__step-title"
                text={step.title}
              />
              <ScrollText className="home__step-body" text={step.body} />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="home__voices" aria-labelledby="home-voices-title">
        <div className="home__voices-head">
          <Reveal className="home__section-label">Community Voices</Reveal>
          <ScrollText
            as="h2"
            id="home-voices-title"
            className="home__section-title"
            text="The people behind the work."
          />
          <ScrollText
            className="home__voices-sub"
            text="Hear from those whose lives are interwoven with ours."
          />
        </div>
        <div className="home__voices-grid">
          {TESTIMONIALS.map((t) => (
            <Reveal as="article" key={t.name} className="home__voice">
              <span className="home__voice-mark" aria-hidden="true">
                &ldquo;
              </span>
              <ScrollText className="home__voice-quote" text={t.quote} />
              <p className="home__voice-name">— {t.name}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="home__cta" aria-labelledby="home-cta-title">
        <div className="home__cta-inner">
          <Reveal className="home__section-label">Join the Movement</Reveal>
          <ScrollText
            as="h2"
            id="home-cta-title"
            className="home__cta-title"
            text="Together, we create lasting change."
          />
          <ScrollText
            className="home__cta-body"
            text="Volunteer your time, contribute resources, or simply share our work. Every act of solidarity strengthens the community we are building."
          />
          <Reveal className="home__cta-actions" delay={0.1}>
            <Link to="/volunteer" className="home__btn">
              Volunteer
            </Link>
            <Link to="/donate" className="home__btn home__btn--ghost">
              Donate Now
            </Link>
          </Reveal>
        </div>
      </section>

      <section
        className="home__partners"
        aria-labelledby="home-partners-title"
      >
        <div className="home__partners-head">
          <Reveal className="home__section-label">Supported By</Reveal>
          <ScrollText
            as="h2"
            id="home-partners-title"
            className="home__section-title home__section-title--small"
            text="Proudly funded by leading organizations."
          />
        </div>
        <Reveal className="home__partners-grid">
          {PARTNERS.map((p) => (
            <div key={p.name} className="home__partner" title={p.name}>
              <img src={p.img} alt={p.name} loading="lazy" />
            </div>
          ))}
        </Reveal>
      </section>
    </main>
  );
}
