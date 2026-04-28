import {
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ShaderGradientCanvas as RawShaderGradientCanvas,
  ShaderGradient as RawShaderGradient,
} from "shadergradient";
import "./About.scss";

const ShaderGradientCanvas = RawShaderGradientCanvas as ComponentType<
  Record<string, unknown>
>;
const ShaderGradient = RawShaderGradient as ComponentType<
  Record<string, unknown>
>;
const ease = [0.25, 0.46, 0.45, 0.94] as const;

type RevealProps = {
  children: ReactNode;
  delay?: number;
  y?: number;
  duration?: number;
  className?: string;
  as?: "div" | "h1" | "h2" | "h3" | "p" | "span" | "li" | "section";
  id?: string;
};

function Reveal({
  children,
  delay = 0,
  y = 40,
  duration = 0.85,
  className,
  as = "div",
  id,
}: RevealProps) {
  const Comp = motion[as];
  return (
    <Comp
      id={id}
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12%" }}
      transition={{ duration, delay, ease }}
    >
      {children}
    </Comp>
  );
}

function Arrow({ className }: { className?: string }) {
  return (
    <svg
      className={`about__arrow ${className ?? ""}`}
      viewBox="0 0 130 175"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M 105 25 C 135 22 122 70 78 62 C 38 56 65 110 70 142 L 70 158"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 58 148 L 70 162 L 84 150"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const story = [
  "The Black Immigrants Community Foundation (BICF) is a nonprofit organization committed to supporting and empowering Black immigrants through advocacy, resources, and community building. We understand that Black immigrants often face complex and intersecting challenges that go beyond the typical struggles associated with immigration, such as racial discrimination, cultural alienation, language barriers, and limited access to critical services. These difficulties are frequently compounded by systemic inequalities that affect their ability to fully integrate and thrive in their new communities.",
  "At BICF, we are passionate about addressing these unique barriers and providing a platform where Black immigrants can find the support they need to succeed. Whether it's navigating the immigration process, accessing legal resources, or receiving mental health support, we are here to ensure that Black immigrants have the tools and guidance they need to build a brighter future. Our programs and services are designed to be culturally relevant and responsive to the specific needs of the Black immigrant community, ensuring that individuals feel valued, heard, and supported.",
  "We offer a broad range of services, including legal assistance, employment resources, educational support, and leadership development. Our goal is to break down the barriers that Black immigrants often face in areas such as education, employment, housing, healthcare, and social services. We also provide a safe and inclusive space for the community to connect, share their experiences, and advocate for the change that is needed to ensure greater social justice and equity for Black immigrants in society.",
  "BICF operates on the belief that a strong, united community is the key to overcoming adversity. By fostering a sense of belonging and solidarity, we work to reduce isolation, build resilience, and promote civic engagement among Black immigrants. We also strive to amplify the voices of Black immigrants, ensuring they have a seat at the table when decisions are made that affect their lives. Our foundation acts as a bridge between Black immigrants and the broader society, helping to strengthen social ties and increase understanding.",
  "Through advocacy, education, and partnerships with other organizations, we aim to influence policies that create a more just and inclusive environment for Black immigrants. We also seek to provide opportunities for leadership development, so that Black immigrants can become active participants in their communities and lead efforts for positive change. Our work is grounded in the principles of social justice, equality, and human dignity, and we are unwavering in our commitment to creating a world where Black immigrants can live, work, and thrive free from discrimination and inequity.",
  "At BICF, we believe that the success of Black immigrants is essential to the broader health and prosperity of society. When Black immigrants thrive, we all thrive. Together, we are building a stronger, more inclusive community where the contributions and potential of Black immigrants are recognized, celebrated, and honored. Through our collective efforts, we can create lasting change and build a more equitable future for generations to come.",
];

const pillars = [
  {
    label: "Purpose",
    tag: "Why we exist",
    body: "Our purpose is to support, empower, and advocate for Black immigrants by addressing systemic barriers that hinder their progress. We foster unity, resilience, and belonging while promoting justice, equality, and opportunity.",
    image: "/b1.png",
  },
  {
    label: "Mission",
    tag: "What we do",
    body: "The mission of BICF is to uplift and empower Black immigrants through practical resources, advocacy, and community engagement. We are dedicated to breaking down systemic inequalities and ensuring access to education, healthcare, employment.",
    image: "/b2.png",
  },
  {
    label: "Vision",
    tag: "Where we are headed",
    body: "We envision a world where Black immigrants are fully accepted, valued, and celebrated, living free from discrimination and systemic barriers. BICF works toward a future where Black immigrants are leaders, innovators.",
    image: "/b3.png",
  },
];

const values = [
  {
    title: "Empowerment",
    body: "We believe in the power of self determination and work to equip Black immigrants with the tools, knowledge, and resources they need to succeed. Empowerment through education, advocacy, and access to opportunities is key to creating a more equitable future for Black immigrants and their communities.",
  },
  {
    title: "Equality & Justice",
    body: "We are committed to advocating for fairness and equality for all Black immigrants. We believe that every individual deserves equal rights, opportunities, and respect regardless of their race, background, or immigration status. We actively challenge systemic inequalities and work to ensure that Black immigrants are treated justly in all spheres of life.",
  },
  {
    title: "Community & Solidarity",
    body: "We recognize the strength of a united community. BICF fosters a sense of belonging and solidarity among Black immigrants, creating spaces for individuals to connect, share their experiences, and support one another. We believe that collective action, mutual respect, and shared experiences are essential for building a stronger, more resilient community.",
  },
  {
    title: "Cultural Respect & Diversity",
    body: "We honor the rich cultural identities of Black immigrants and celebrate the diversity they bring to society. We believe in the importance of preserving cultural heritage while promoting inclusivity and mutual understanding. Our work respects and upholds the value of diverse perspectives, languages, and traditions.",
  },
  {
    title: "Integrity & Transparency",
    body: "We hold ourselves to the highest standards of honesty, accountability, and ethical conduct. We are committed to maintaining transparency in our operations, communications, and decision making processes. We build trust by acting with integrity and ensuring that our actions align with the needs and expectations of the communities we serve.",
  },
  {
    title: "Advocacy & Activism",
    body: "We are driven by a commitment to social justice and advocate for the rights, needs, and aspirations of Black immigrants. Through activism, policy engagement, and grassroots organizing, we work to bring about systemic change that addresses the unique challenges faced by Black immigrants and dismantles the barriers to equality they encounter.",
  },
  {
    title: "Collaboration & Partnerships",
    body: "We believe in the power of collaboration to create lasting change. BICF values partnerships with other organizations, community groups, and stakeholders who share our vision of a just and inclusive society. By working together, we can maximize our collective impact and amplify the voices of Black immigrants.",
  },
  {
    title: "Resilience & Hope",
    body: "We celebrate the resilience and strength of Black immigrants who overcome adversity in the face of challenges. At BICF, we are driven by hope, a belief that positive change is possible. We are committed to inspiring and supporting Black immigrants as they build new lives, and as they contribute to a brighter and more inclusive future for all.",
  },
];

const services = [
  {
    title: "Legal and Immigration Support",
    body: "Guidance and referrals for asylum, residence, and family reunification.",
  },
  {
    title: "Education and Mentorship",
    body: "Academic support, ESL programs, and career readiness training.",
  },
  {
    title: "Employment and Financial Empowerment",
    body: "Job placement, vocational training, and financial literacy.",
  },
  {
    title: "Mental Health and Wellness",
    body: "Access to culturally aware counseling and wellness workshops.",
  },
  {
    title: "Community Engagement",
    body: "Events, cultural programs, and leadership development.",
  },
  {
    title: "Advocacy and Awareness",
    body: "Promoting equitable policies and amplifying Black immigrant voices.",
  },
];

const gallery = [
  {
    src: "/b4.png",
    label: "Together",
    caption: "Building bridges through shared experience and a common future.",
  },
  {
    src: "/b5.png",
    label: "Empowerment",
    caption: "Programs that turn ambition into lasting opportunity.",
  },
  {
    src: "/b6.png",
    label: "Solidarity",
    caption: "Voices amplified through collective action and care.",
  },
  {
    src: "/b7.png",
    label: "Advocacy",
    caption: "Speaking up for policy change and fair representation.",
  },
  {
    src: "/b8.png",
    label: "Growth",
    caption: "Workshops that build skills and open doors.",
  },
  {
    src: "/b9.png",
    label: "Belonging",
    caption: "Creating spaces where everyone feels at home.",
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

const heroSlides = [
  {
    label: "About / The Foundation",
    title: ["When Black immigrants thrive,", "we all thrive."],
    body: "The Black Immigrants Community Foundation is a nonprofit organization committed to supporting and empowering Black immigrants through advocacy, resources, and community building.",
  },
  {
    label: "Our Mission",
    title: ["Practical resources.", "Real advocacy."],
    body: "BICF uplifts and empowers Black immigrants through practical resources, advocacy, and community engagement, breaking down systemic inequalities along the way.",
  },
  {
    label: "Our Vision",
    title: ["A world that sees,", "values, and celebrates."],
    body: "We envision a world where Black immigrants are fully accepted, valued, and celebrated, living free from discrimination and systemic barriers.",
  },
];

export default function About() {
  const heroRef = useRef<HTMLElement>(null);
  const [heroVisible, setHeroVisible] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    if (!heroVisible) return;
    const interval = setInterval(() => {
      setActiveSlide((i) => (i + 1) % heroSlides.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [heroVisible]);

  useEffect(() => {
    document.title = "About | Black Immigrants Community Foundation";
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  useEffect(() => {
    const node = heroRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setHeroVisible(entry.isIntersecting),
      { threshold: 0, rootMargin: "100px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <main className="about">
      <section
        ref={heroRef}
        className="about__hero"
        aria-labelledby="about-hero-title"
      >
        <div className="about__hero-shader" aria-hidden="true">
          <ShaderGradientCanvas
            style={{ width: "100%", height: "100%" }}
            pointerEvents="none"
          >
            <ShaderGradient
              animate={heroVisible ? "on" : "off"}
              bgColor1="#000000"
              bgColor2="#000000"
              brightness={1.2}
              cAzimuthAngle={180}
              cDistance={2.4}
              cPolarAngle={95}
              cameraZoom={1}
              color1="#3f0000"
              color2="#c73c00"
              color3="#FD4912"
              destination="onCanvas"
              embedMode="off"
              envPreset="city"
              format="gif"
              fov={45}
              frameRate={6}
              gizmoHelper="hide"
              grain="off"
              lightType="env"
              pixelDensity={1}
              positionX={0}
              positionY={-2.1}
              positionZ={0}
              range="disabled"
              rangeEnd={40}
              rangeStart={0}
              reflection={0.1}
              rotationX={0}
              rotationY={0}
              rotationZ={225}
              shader="defaults"
              type="waterPlane"
              uAmplitude={0}
              uDensity={1.8}
              uFrequency={5.5}
              uSpeed={0.2}
              uStrength={3}
              uTime={0.2}
              wireframe={false}
            />
          </ShaderGradientCanvas>
        </div>
        <div className="about__hero-veil" aria-hidden="true" />

        <div className="about__hero-panel">
          <div className="about__hero-panel-inner">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlide}
                className="about__hero-slide"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.5, ease }}
              >
                <span className="about__hero-label">
                  {heroSlides[activeSlide].label}
                </span>
                <h1 id="about-hero-title" className="about__hero-title">
                  {heroSlides[activeSlide].title.map((line, i) => (
                    <span key={i} className="about__hero-line">
                      {line}
                    </span>
                  ))}
                </h1>
                <p className="about__hero-body">
                  {heroSlides[activeSlide].body}
                </p>
              </motion.div>
            </AnimatePresence>

            <div className="about__hero-controls">
              <button
                type="button"
                className="about__hero-nav"
                onClick={() =>
                  setActiveSlide(
                    (i) => (i - 1 + heroSlides.length) % heroSlides.length,
                  )
                }
                aria-label="Previous slide"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
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
                className="about__hero-bars"
                role="tablist"
                aria-label="Hero slides"
              >
                {heroSlides.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    role="tab"
                    aria-selected={i === activeSlide}
                    aria-label={`Go to slide ${i + 1}`}
                    className={`about__hero-bar ${
                      i === activeSlide ? "about__hero-bar--active" : ""
                    }`}
                    onClick={() => setActiveSlide(i)}
                  />
                ))}
              </div>

              <button
                type="button"
                className="about__hero-nav"
                onClick={() =>
                  setActiveSlide((i) => (i + 1) % heroSlides.length)
                }
                aria-label="Next slide"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
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

            <div className="about__hero-meta">
              <span>Ajax, Ontario</span>
              <span aria-hidden="true">·</span>
              <span>(905) 931 3776</span>
            </div>
          </div>
        </div>

        <svg
          className="about__hero-tear"
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M0,32 C300,8 720,60 1080,30 C1260,16 1380,42 1440,22 L1440,80 L0,80 Z" />
        </svg>
      </section>

      <section className="about__story" aria-labelledby="about-story-title">
        <motion.div
          className="about__story-arrow"
          initial={{ opacity: 0.5, scale: 0.92, rotate: -8 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease, delay: 0.2 }}
          aria-hidden="true"
        >
          <Arrow />
        </motion.div>
        <div className="about__container">
          <header className="about__section-head">
            <Reveal as="span" className="about__kicker">
              About Us
            </Reveal>
            <Reveal
              as="h2"
              className="about__section-title"
              delay={0.08}
              id="about-story-title"
            >
              A foundation built around the realities of Black immigrant life.
            </Reveal>
          </header>

          <div className="about__story-body">
            <Reveal as="p" delay={0}>
              The Black Immigrants Community Foundation (BICF) is a nonprofit
              organization committed to supporting and empowering Black
              immigrants through advocacy, resources, and community building. We
              understand that Black immigrants often face complex and
              intersecting challenges that go beyond the typical struggles
              associated with immigration, such as racial discrimination,
              cultural alienation, language barriers, and limited access to
              critical services. These difficulties are frequently compounded by
              systemic inequalities that affect their ability to fully integrate
              and thrive in their new communities.
            </Reveal>

            {story.slice(1).map((para, i) => (
              <Reveal as="p" key={i + 1} delay={(i + 1) * 0.05}>
                {para}
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="about__pillars" aria-labelledby="about-pillars-title">
        <svg
          className="about__wave about__wave--pillars"
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M0,55 C240,15 540,75 840,40 C1080,12 1260,55 1440,30 L1440,80 L0,80 Z" />
        </svg>
        <div className="about__pillars-aurora" aria-hidden="true" />
        <div className="about__container">
          <header className="about__section-head">
            <Reveal as="span" className="about__kicker">
              The Frame
            </Reveal>
            <Reveal
              as="h2"
              className="about__section-title"
              delay={0.08}
              id="about-pillars-title"
            >
              Purpose, mission, and vision.
            </Reveal>
          </header>

          <div className="about__pillars-stack">
            {pillars.map((p, i) => (
              <motion.article
                key={p.label}
                className="about__pillar"
                data-align={i % 2 === 0 ? "left" : "right"}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-12%" }}
                transition={{ duration: 0.95, ease, delay: i * 0.06 }}
              >
                <div className="about__pillar-media">
                  <img src={p.image} alt="" loading="lazy" />
                  <span className="about__pillar-badge">
                    <span className="about__pillar-badge-num">
                      {String(i + 1).padStart(2, "00")}
                    </span>
                    <span className="about__pillar-badge-text">{p.tag}</span>
                  </span>
                </div>

                <div className="about__pillar-content">
                  <span className="about__pillar-eyebrow">
                    <span className="about__pillar-dot" aria-hidden="true" />
                    BICF Foundation
                  </span>
                  <h3 className="about__pillar-label">{p.label}</h3>
                  <p className="about__pillar-body">{p.body}</p>
                  <span className="about__pillar-arrow" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
                      <path
                        d="M5 12h14M13 5l7 7-7 7"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="about__values" aria-labelledby="about-values-title">
        <div className="about__container">
          <header className="about__section-head">
            <Reveal as="span" className="about__kicker">
              Core Values
            </Reveal>
            <Reveal
              as="h2"
              className="about__section-title"
              delay={0.08}
              id="about-values-title"
            >
              Eight commitments that shape our work.
            </Reveal>
          </header>

          <ul className="about__values-grid">
            {values.map((v, i) => (
              <motion.li
                key={v.title}
                className="about__value"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-8%" }}
                transition={{
                  duration: 0.75,
                  ease,
                  delay: (i % 2) * 0.06,
                }}
              >
                <span className="about__value-num">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="about__value-title">{v.title}</h3>
                <p className="about__value-body">{v.body}</p>
              </motion.li>
            ))}
          </ul>
        </div>
      </section>

      <section
        className="about__services"
        aria-labelledby="about-services-title"
      >
        <svg
          className="about__wave about__wave--services"
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M0,40 C180,60 420,30 720,40 C1020,50 1260,20 1440,55 L1440,80 L0,80 Z" />
        </svg>
        <div className="about__container">
          <header className="about__section-head">
            <Reveal as="span" className="about__kicker">
              What We Do
            </Reveal>
            <Reveal
              as="h2"
              className="about__section-title"
              delay={0.08}
              id="about-services-title"
            >
              Programs and services for the diverse needs of Black immigrants.
            </Reveal>
          </header>

          <ol className="about__services-list">
            {services.map((s, i) => (
              <motion.li
                key={s.title}
                className="about__service"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.8, ease, delay: i * 0.05 }}
              >
                <span className="about__service-num">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="about__service-title">{s.title}</h3>
                <p className="about__service-body">{s.body}</p>
              </motion.li>
            ))}
          </ol>

          <Reveal as="p" className="about__services-note" delay={0.2}>
            Each service is tailored to promote empowerment, inclusion, and self
            sufficiency.
          </Reveal>
        </div>
      </section>

      <section className="about__gallery" aria-labelledby="about-gallery-title">
        <div className="about__container">
          <header className="about__section-head">
            <Reveal as="span" className="about__kicker">
              Moments
            </Reveal>
            <Reveal
              as="h2"
              className="about__section-title"
              delay={0.08}
              id="about-gallery-title"
            >
              In the community.
            </Reveal>
          </header>

          <div className="about__gallery-grid">
            {gallery.map((item, i) => (
              <motion.figure
                key={item.src}
                className={`about__gallery-item about__gallery-item--${i + 1}`}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.9, ease, delay: i * 0.08 }}
              >
                <img src={item.src} alt={item.label} loading="lazy" />
                <span className="about__gallery-index" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                  <span>/{String(gallery.length).padStart(2, "0")}</span>
                </span>
                <figcaption className="about__gallery-caption">
                  <span className="about__gallery-label">{item.label}</span>
                  <span className="about__gallery-text">{item.caption}</span>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </div>
      </section>

      <section
        className="about__sponsors"
        aria-labelledby="about-sponsors-title"
      >
        <div className="about__container">
          <header className="about__section-head about__section-head--center">
            <Reveal as="span" className="about__kicker">
              Supported By
            </Reveal>
            <Reveal
              as="h2"
              className="about__section-title"
              delay={0.08}
              id="about-sponsors-title"
            >
              Proudly funded by leading Canadian institutions and community
              partners.
            </Reveal>
          </header>

          <Reveal as="p" className="about__sponsors-intro" delay={0.16}>
            BICF's programs are sustained by a network of public funders and
            community foundations who share our commitment to long term equity
            for Black immigrants in Canada. Their continued investment makes our
            coordinated, no cost services possible, and turns one organization's
            intent into a community wide capability.
          </Reveal>

          <ul className="about__sponsors-grid">
            {sponsors.map((s, i) => (
              <motion.li
                key={s.name}
                className="about__sponsor"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-8%" }}
                transition={{ duration: 0.7, ease, delay: i * 0.08 }}
              >
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="about__sponsor-link"
                  aria-label={s.name}
                >
                  <img src={s.src} alt={s.name} loading="lazy" />
                </a>
                <span className="about__sponsor-name">{s.short}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
