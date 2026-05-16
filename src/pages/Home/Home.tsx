import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import "./Home.scss";

const HERO_EASE = [0.25, 0.46, 0.45, 0.94] as const;

const heroSlides = [
  {
    label: "Welcome to BICF",
    title: ["A home for those,", "building new homes."],
    body: "We stand beside Black immigrants from the moment they arrive, with the advocacy, resources, and community that turn unfamiliar ground into firm footing.",
  },
  {
    label: "What We Do",
    title: ["Real support.", "Lasting impact."],
    body: "Legal guidance, educational pathways, wellness, and employment support. Every service is built so Black immigrants don't just survive, they thrive.",
  },
  {
    label: "Our Community",
    title: ["A movement,", "just beginning."],
    body: "BICF is a young foundation built around one clear purpose, to walk with Black immigrants as they build new lives. Every story shared shapes what we become.",
  },
];

const INTRO_FACES = ["/h1.webp", "/h2.webp", "/h3.webp"];

const testimonials = [
  {
    quote:
      "The counseling and wellness programs at BICF helped me manage the stress of immigration. Their culturally sensitive approach gave me healing and strength.",
    name: "Anim",
    role: "Community Member",
  },
  {
    quote:
      "As a parent, I appreciate BICF's youth and family programs. They help my children grow confidently while staying proud of their heritage.",
    name: "Chinyera",
    role: "Parent",
  },
  {
    quote:
      "BICF's financial literacy workshops taught me how to manage my money wisely. I now feel confident budgeting, saving, and planning for the future.",
    name: "James",
    role: "Workshop Participant",
  },
  {
    quote:
      "When I arrived, I felt lost. The team walked me through the legal process step by step. I would not be where I am today without their guidance.",
    name: "Adwoa",
    role: "New Resident",
  },
];

const sponsors = [
  {
    name: "Government of Canada — Supporting Black Canadian Communities Initiative",
    short: "Government of Canada",
    src: "/canada.png",
    href: "https://www.canada.ca/en/employment-social-development/programs/supporting-black-canadian-communities-initiative.html",
  },
  {
    name: "Black Business Initiative",
    short: "BBI",
    src: "/bbi.png",
    href: "https://bbi.ca/",
  },
  {
    name: "Ontario Trillium Foundation",
    short: "Ontario Trillium Foundation",
    src: "/otf.png",
    href: "https://otf.ca/",
  },
  {
    name: "Government of Ontario",
    short: "Government of Ontario",
    src: "/ontario.png",
    href: "https://www.ontario.ca/",
  },
];

const principles = [
  {
    eyebrow: "Our Mission",
    body: "To empower, uplift, and provide comprehensive support to Black immigrants as they navigate the complexities of settling in a new country.",
  },
  {
    eyebrow: "Our Vision",
    body: "A world where Black immigrants thrive and are embraced as valued members of society, free from discrimination and systemic barriers.",
  },
];

const services = [
  {
    label: "Legal Assistance",
    tag: "Pathways forward",
    body: "Providing legal guidance and support for immigration processes and rights protection.",
    image: "/h5.webp",
  },
  {
    label: "Education Support",
    tag: "Learning that lifts",
    body: "Scholarships, tutoring, and resources to help achieve academic and career goals.",
    image: "/h6.webp",
  },
  {
    label: "Employment Support",
    tag: "Work and wealth",
    body: "Job placement support, vocational training, and financial literacy programs to help build stable careers.",
    image: "/h7.webp",
  },
  {
    label: "Mental Health & Wellness",
    tag: "Care that sees you",
    body: "Culturally sensitive counseling and wellness programs for mental health support.",
    image: "/h8.webp",
  },
  {
    label: "Community & Advocacy",
    tag: "Voices amplified",
    body: "Cultural events, leadership development, and policy advocacy that put Black immigrant voices at the centre of decisions that affect their lives. We build the spaces where belonging is practiced and the platforms where change is demanded.",
    image: "/h9.webp",
  },
];

const homeFaqs = [
  {
    q: "How can BICF support me if I'm a newcomer?",
    a: "From the moment you arrive, BICF offers guidance on housing, legal documentation, healthcare navigation, and community connections. We help you understand your rights, access essential services, and build a stable foundation in Canada—completely free of charge.",
  },
  {
    q: "What types of legal assistance do you offer?",
    a: "Our legal team provides support with immigration applications, work permits, refugee claims, family sponsorship, and status renewal. We also offer referrals for complex cases and know your rights workshops. Every consultation is confidential and client-centered.",
  },
  {
    q: "Are your programs really free?",
    a: "Yes. All BICF programs—legal advice, mental health support, employment coaching, education workshops, and community events—are offered at no cost. We are funded by grants, institutional partners, and individual donors who believe in barrier-free support.",
  },
  {
    q: "How do I volunteer with BICF?",
    a: "We welcome volunteers in legal intake, communications, event coordination, youth mentorship, and administrative roles. Fill out the volunteer form on our Get Involved page, and our team will schedule an orientation call to match your skills with current needs.",
  },
  {
    q: "Can I donate to support your work?",
    a: "Absolutely. Donations help us expand our legal services, run mental wellness programs, and keep all supports free. BICF is a registered Canadian non-profit, and contributions are tax-deductible. You can donate online via our secure portal or by e-transfer.",
  },
  {
    q: "How quickly can I access mental health support?",
    a: "We aim to schedule an initial wellness consultation within 3–5 business days. From there, you’ll be connected with a culturally competent counsellor for ongoing sessions—at no cost. Crisis support is available within 24 hours.",
  },
  {
    q: "Do you offer remote services?",
    a: "Yes. While our Ajax office is open for in-person support, we provide phone, video, and email consultations for clients across Ontario and beyond. We also host virtual workshops and support groups regularly.",
  },
];

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const easeOutQ = (t: number) => 1 - Math.pow(1 - t, 4);

type HomeProps = {
  pageTitle?: string;
  autoplayDelay?: number;
};

export default function Home({
  pageTitle = "Home | Black Immigrants Community Foundation",
  autoplayDelay = 8000,
}: HomeProps) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [faceIndex, setFaceIndex] = useState(0);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const testimonialTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
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

  useEffect(() => {
    const id = setInterval(() => {
      setFaceIndex((i) => (i + 1) % INTRO_FACES.length);
    }, 3000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (testimonialTimerRef.current) clearTimeout(testimonialTimerRef.current);
    testimonialTimerRef.current = setTimeout(() => {
      setTestimonialIndex((i) => (i + 1) % testimonials.length);
    }, 7000);
    return () => {
      if (testimonialTimerRef.current)
        clearTimeout(testimonialTimerRef.current);
    };
  }, [testimonialIndex]);

  const goToTestimonial = (i: number) =>
    setTestimonialIndex(
      ((i % testimonials.length) + testimonials.length) % testimonials.length,
    );

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

  const storyRef = useRef<HTMLElement | null>(null);
  const imgRef = useRef<HTMLDivElement | null>(null);
  const t1Ref = useRef<HTMLDivElement | null>(null);
  const t2Ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const section = storyRef.current;
    const img = imgRef.current;
    const t1 = t1Ref.current;
    const t2 = t2Ref.current;
    if (!section || !img || !t1 || !t2) return;

    let cachedNat: { pageCX: number; pageCY: number } | null = null;
    let scheduled = false;

    const measureNatural = () => {
      const savedT = img.style.transform;
      const savedO = img.style.opacity;
      img.style.transform = "none";
      img.style.opacity = "0";
      const r = img.getBoundingClientRect();
      cachedNat = {
        pageCX: r.left + window.scrollX + r.width / 2,
        pageCY: r.top + window.scrollY + r.height / 2,
      };
      img.style.transform = savedT;
      img.style.opacity = savedO;
    };

    const remeasure = () => {
      cachedNat = null;
      measureNatural();
    };

    const applyFrame = (p: number, rect: DOMRect) => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      if (!cachedNat) measureNatural();
      const naturalCX = cachedNat!.pageCX - window.scrollX;
      const naturalCY = cachedNat!.pageCY - window.scrollY;
      const fullOffX = vw / 2 - naturalCX;
      const fullOffY = vh / 2 - naturalCY;

      if (rect.top > vh * 0.5) {
        img.style.opacity = "0";
        img.style.transform = "translate3d(0,0,0)";
        img.dataset.animating = "false";
        t1.style.opacity = "0";
        t2.style.opacity = "0";
        return;
      }
      img.style.opacity = String(
        rect.top > 0 ? clamp(1 - rect.top / (vh * 0.5), 0, 1) : 1,
      );

      const pImg = clamp((p - 0.82) / 0.18, 0, 1);
      const eImg = easeOut(pImg);
      const offX = fullOffX * (1 - eImg);
      const offY = fullOffY * (1 - eImg);
      const scale = 1 - eImg * 0.03;
      img.dataset.animating = eImg < 0.999 ? "true" : "false";
      img.style.transform = `translate3d(${Math.round(offX)}px, ${Math.round(offY)}px, 0) scale(${scale.toFixed(4)})`;

      const t1In = clamp((p - 0.1) / 0.2, 0, 1);
      const t1Out = clamp((p - 0.42) / 0.13, 0, 1);
      const t1Op = easeOut(t1In) * (1 - easeOut(t1Out));
      const t1Y = (1 - easeOut(t1In)) * vh * 0.55 + -easeOut(t1Out) * vh * 0.18;
      t1.style.setProperty("--y", `${t1Y.toFixed(2)}px`);
      t1.style.opacity = t1Op.toFixed(3);

      const t2In = clamp((p - 0.5) / 0.2, 0, 1);
      const t2Out = clamp((p - 0.82) / 0.18, 0, 1);
      const t2Op = easeOutQ(t2In) * (1 - easeOut(t2Out));
      const t2Y =
        (1 - easeOutQ(t2In)) * vh * 0.55 + -easeOut(t2Out) * vh * 0.18;
      t2.style.setProperty("--y", `${t2Y.toFixed(2)}px`);
      t2.style.opacity = t2Op.toFixed(3);
    };

    const onScroll = () => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => {
        const rect = section.getBoundingClientRect();
        const total = section.offsetHeight - window.innerHeight;
        const scrolled = clamp(-rect.top, 0, total);
        const p = total > 0 ? scrolled / total : 0;
        applyFrame(p, rect);
        scheduled = false;
      });
    };

    const onResize = () => {
      remeasure();
      onScroll();
    };

    measureNatural();
    onScroll();

    const ro = new ResizeObserver(() => {
      remeasure();
      onScroll();
    });
    ro.observe(section);
    const aboutEl = document.querySelector(".home__about");
    if (aboutEl) ro.observe(aboutEl);

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        remeasure();
        onScroll();
      });
    }

    const onImgLoad = () => {
      remeasure();
      onScroll();
    };
    const innerImg = img.querySelector("img");
    if (innerImg) {
      if ((innerImg as HTMLImageElement).complete) {
        onImgLoad();
      } else {
        innerImg.addEventListener("load", onImgLoad, { once: true });
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    window.addEventListener("load", onResize);

    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("load", onResize);
      if (innerImg) innerImg.removeEventListener("load", onImgLoad);
    };
  }, []);

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
            <div className="home__hero-stage">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                  key={activeSlide}
                  id={`hero-panel-${activeSlide}`}
                  role="tabpanel"
                  aria-labelledby={`hero-tab-${activeSlide}`}
                  className="home__hero-slide"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.55, ease: HERO_EASE }}
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
            </div>

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

      <section className="home__intro" aria-labelledby="home-intro-title">
        <h2 id="home-intro-title" className="home__intro-title">
          <span className="home__intro-line">One community.</span>
          <span className="home__intro-line">
            <span>Endless</span>
            <span className="home__intro-face" aria-hidden="true">
              <AnimatePresence mode="wait">
                <motion.img
                  key={faceIndex}
                  src={INTRO_FACES[faceIndex]}
                  alt=""
                  width={110}
                  height={110}
                  decoding="async"
                  initial={{ opacity: 0, scale: 0.75, rotate: -4 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.85, rotate: 4 }}
                  transition={{ duration: 0.5, ease: HERO_EASE }}
                />
              </AnimatePresence>
            </span>
            <span>hope.</span>
          </span>
        </h2>

        <p className="home__intro-body">
          The Black Immigrants Community Foundation walks alongside families
          building new lives through advocacy, opportunity, and unwavering
          support.
        </p>
      </section>

      <section ref={storyRef} className="home__story" aria-label="Brand story">
        <div className="home__story-stage">
          <div className="home__story-stage-inner">
            <div
              ref={t2Ref}
              className="home__story-text home__story-text--left"
            >
              <span className="home__story-label">Built together</span>
              Resources
              <br />
              that build
              <br />a steady home.
            </div>
            <div
              ref={t1Ref}
              className="home__story-text home__story-text--right"
            >
              <span className="home__story-label">For every arrival</span>
              Advocacy
              <br />
              that meets
              <br />
              the moment.
            </div>
          </div>
        </div>
      </section>

      <section className="home__about" id="about" aria-labelledby="about-title">
        <div className="home__about-grid">
          <div className="home__about-content">
            <div className="home__about-eyebrow">About BICF</div>
            <p className="home__about-body">
              The Black Immigrants Community Foundation (BICF) is a non-profit
              organization dedicated to supporting and empowering Black
              immigrants through advocacy, resources, and community-building
              initiatives.
            </p>
            <a className="home__about-btn" href="/about">
              Learn More
            </a>
          </div>

          <div className="home__about-media">
            <div
              ref={imgRef}
              className="home__about-image"
              data-animating="false"
            >
              <img
                src="/h4.webp"
                alt="Black immigrant family"
                width={720}
                height={960}
                decoding="async"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      <section
        className="home__principles"
        id="principles"
        aria-labelledby="home-principles-title"
      >
        <div className="home__principles-aurora" aria-hidden="true" />
        <div className="home__principles-container">
          <header className="home__principles-head">
            <motion.span
              className="home__principles-kicker"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-12%" }}
              transition={{ duration: 0.6, ease: HERO_EASE }}
            >
              Foundations
            </motion.span>
            <motion.h2
              id="home-principles-title"
              className="home__principles-title"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-12%" }}
              transition={{ duration: 0.85, ease: HERO_EASE, delay: 0.08 }}
            >
              What we stand for, and where we're going.
            </motion.h2>
          </header>

          <div className="home__principles-grid">
            {principles.map((p, i) => (
              <motion.article
                key={p.eyebrow}
                className="home__principle"
                initial={{ opacity: 0, y: 36 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{
                  duration: 0.85,
                  ease: HERO_EASE,
                  delay: 0.1 + i * 0.12,
                }}
              >
                <span className="home__principle-eyebrow">{p.eyebrow}</span>
                <p className="home__principle-body">{p.body}</p>
              </motion.article>
            ))}
          </div>

          <div className="home__principles-cta-wrap">
            <a className="home__principles-cta" href="/about">
              Learn More
            </a>
          </div>
        </div>
      </section>

      <section
        className="home__services"
        id="services"
        aria-labelledby="home-services-title"
      >
        <div className="home__services-aurora" aria-hidden="true" />
        <div className="home__services-container">
          <header className="home__services-head">
            <motion.span
              className="home__services-kicker"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-12%" }}
              transition={{ duration: 0.7, ease: HERO_EASE }}
            >
              Our Services
            </motion.span>
            <motion.h2
              id="home-services-title"
              className="home__services-title"
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-12%" }}
              transition={{ duration: 0.85, ease: HERO_EASE, delay: 0.08 }}
            >
              Programs built around the realities of Black immigrant life.
            </motion.h2>
          </header>

          <div className="home__services-stack">
            {services.map((s, i) => (
              <article
                key={s.label}
                className="home__service-card"
                data-align={i % 2 === 0 ? "left" : "right"}
                style={{
                  top: `calc(2rem + ${i * 1.25}rem)`,
                  zIndex: i + 1,
                }}
              >
                <div className="home__service-media">
                  <img
                    src={s.image}
                    alt={`${s.label} — ${s.tag}`}
                    width={1200}
                    height={900}
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="home__service-badge">
                    <span className="home__service-badge-num">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="home__service-badge-text">{s.tag}</span>
                  </span>
                </div>

                <div className="home__service-content">
                  <span className="home__service-eyebrow">
                    <span className="home__service-dot" aria-hidden="true" />
                    BICF Services
                  </span>
                  <h3 className="home__service-label">{s.label}</h3>
                  <p className="home__service-body">{s.body}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="home__services-cta-wrap">
            <a className="home__services-cta" href="/services">
              Learn More
            </a>
          </div>
        </div>
      </section>

      <section
        className="home__voices"
        id="voices"
        aria-labelledby="home-voices-title"
      >
        <div className="home__voices-container">
          <header className="home__voices-head">
            <motion.span
              className="home__voices-kicker"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-12%" }}
              transition={{ duration: 0.6, ease: HERO_EASE }}
            >
              Community Voices
            </motion.span>
            <motion.h2
              id="home-voices-title"
              className="home__voices-title"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-12%" }}
              transition={{ duration: 0.85, ease: HERO_EASE, delay: 0.08 }}
            >
              Stories from those we walk beside.
            </motion.h2>
          </header>

          <div className="home__voices-stage">
            <AnimatePresence mode="wait">
              <motion.figure
                key={testimonialIndex}
                className="home__voice"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.55, ease: HERO_EASE }}
              >
                <svg
                  className="home__voice-mark"
                  viewBox="0 0 32 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M0 24V14.4C0 10.4 0.8 7.2 2.4 4.8C4 2.4 6.4 0.8 9.6 0L11.2 3.2C9.6 4 8.4 4.8 7.6 5.6C6.8 6.4 6.4 7.6 6.4 9.2H12V24H0ZM20 24V14.4C20 10.4 20.8 7.2 22.4 4.8C24 2.4 26.4 0.8 29.6 0L31.2 3.2C29.6 4 28.4 4.8 27.6 5.6C26.8 6.4 26.4 7.6 26.4 9.2H32V24H20Z"
                    fill="currentColor"
                  />
                </svg>
                <blockquote className="home__voice-quote">
                  {testimonials[testimonialIndex].quote}
                </blockquote>
                <figcaption className="home__voice-meta">
                  <span className="home__voice-name">
                    {testimonials[testimonialIndex].name}
                  </span>
                  <span className="home__voice-role">
                    {testimonials[testimonialIndex].role}
                  </span>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>

          <div className="home__voices-controls">
            <button
              type="button"
              className="home__voices-nav"
              onClick={() => goToTestimonial(testimonialIndex - 1)}
              aria-label="Previous testimonial"
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
              className="home__voices-dots"
              role="tablist"
              aria-label="Testimonials"
            >
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={i === testimonialIndex}
                  aria-label={`Go to testimonial ${i + 1}`}
                  className={`home__voices-dot ${i === testimonialIndex ? "home__voices-dot--active" : ""}`}
                  onClick={() => setTestimonialIndex(i)}
                />
              ))}
            </div>

            <button
              type="button"
              className="home__voices-nav"
              onClick={() => goToTestimonial(testimonialIndex + 1)}
              aria-label="Next testimonial"
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
        </div>
      </section>

      <section
        className="home__sponsors"
        id="supporters"
        aria-labelledby="home-sponsors-title"
      >
        <div className="home__sponsors-container">
          <header className="home__sponsors-head">
            <motion.span
              className="home__sponsors-kicker"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-12%" }}
              transition={{ duration: 0.6, ease: HERO_EASE }}
            >
              Supported By
            </motion.span>
            <motion.h2
              id="home-sponsors-title"
              className="home__sponsors-title"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-12%" }}
              transition={{ duration: 0.85, ease: HERO_EASE, delay: 0.08 }}
            >
              Proudly funded by leading Canadian institutions and community
              partners.
            </motion.h2>
          </header>

          <motion.p
            className="home__sponsors-intro"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-12%" }}
            transition={{ duration: 0.7, ease: HERO_EASE, delay: 0.16 }}
          >
            BICF's programs are sustained by a network of public funders and
            community foundations who share our commitment to long term equity
            for Black immigrants in Canada. Their continued investment makes our
            coordinated, no cost services possible.
          </motion.p>

          <ul className="home__sponsors-grid">
            {sponsors.map((s, i) => (
              <motion.li
                key={s.name}
                className="home__sponsor"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-8%" }}
                transition={{ duration: 0.7, ease: HERO_EASE, delay: i * 0.08 }}
              >
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="home__sponsor-link"
                  aria-label={s.name}
                >
                  <img
                    src={s.src}
                    alt={s.name}
                    loading="lazy"
                    decoding="async"
                  />
                </a>
                <span className="home__sponsor-name">{s.short}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </section>

      <section
        className="home__join"
        id="join"
        aria-labelledby="home-join-title"
      >
        <div className="home__join-aurora" aria-hidden="true" />
        <div className="home__join-container">
          <motion.span
            className="home__join-kicker"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-12%" }}
            transition={{ duration: 0.6, ease: HERO_EASE }}
          >
            Get Involved
          </motion.span>
          <motion.h2
            id="home-join-title"
            className="home__join-title"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-12%" }}
            transition={{ duration: 0.85, ease: HERO_EASE, delay: 0.08 }}
          >
            Join the movement.
          </motion.h2>
          <motion.p
            className="home__join-body"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-12%" }}
            transition={{ duration: 0.7, ease: HERO_EASE, delay: 0.16 }}
          >
            Together, we can create lasting change for Black immigrants in our
            communities. Volunteer your time, partner with us, or simply share
            our story.
          </motion.p>
          <motion.div
            className="home__join-actions"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-12%" }}
            transition={{ duration: 0.7, ease: HERO_EASE, delay: 0.24 }}
          >
            <a
              className="home__join-cta home__join-cta--primary"
              href="/volunteer"
            >
              Volunteer
            </a>
            <a className="home__join-cta home__join-cta--ghost" href="/contact">
              Get In Touch
            </a>
          </motion.div>
        </div>
      </section>

      <section className="home__faqs" aria-labelledby="home-faqs-title">
        <div className="home__faqs-container">
          <motion.header
            className="home__faqs-head"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 0.85, ease: HERO_EASE }}
          >
            <h2 id="home-faqs-title" className="home__faqs-title">
              FAQ
            </h2>
          </motion.header>

          <ul className="home__faqs-list">
            {homeFaqs.map((item, i) => {
              const isOpen = openFaq === i;
              const num = String(i + 1).padStart(2, "0");
              return (
                <motion.li
                  key={i}
                  className={`home__faq ${isOpen ? "home__faq--open" : ""}`}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{
                    duration: 0.65,
                    ease: HERO_EASE,
                    delay: i * 0.04,
                  }}
                >
                  <button
                    type="button"
                    className="home__faq-trigger"
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${i}`}
                    id={`faq-button-${i}`}
                  >
                    <span className="home__faq-num">{num}</span>
                    <span className="home__faq-q">{item.q}</span>
                    <motion.span
                      className="home__faq-icon"
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.35, ease: HERO_EASE }}
                      aria-hidden="true"
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                      >
                        <path
                          d="M7 1V13M1 7H13"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </motion.span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="panel"
                        id={`faq-panel-${i}`}
                        role="region"
                        aria-labelledby={`faq-button-${i}`}
                        className="home__faq-panel"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: HERO_EASE }}
                      >
                        <p className="home__faq-a">{item.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.li>
              );
            })}
          </ul>
        </div>
      </section>
    </main>
  );
}
