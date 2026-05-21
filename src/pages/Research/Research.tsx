import { createElement, useEffect, useRef, type ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { useLanguage, type Lang } from "../../context/LanguageContext";
import "./Research.scss";

type Bi = Record<Lang, string>;

const IMAGES = ["/r1.webp", "/r2.webp", "/r3.webp", "/r4.webp", "/r5.webp"];

const EASE = [0.16, 1, 0.3, 1] as const;
const VIEWPORT = { once: true, margin: "0px 0px -12% 0px" } as const;

type Tag = "h1" | "h2" | "h3" | "p" | "div" | "span";

interface ScrollTextProps {
  text: string;
  as?: Tag;
  className?: string;
  id?: string;
}

/* Text fades up once when it scrolls into view, then stays fully visible. */
function ScrollText({ text, as = "p", className, id }: ScrollTextProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return createElement(as, { className, id }, text);
  }

  const MotionComp = motion[as] as typeof motion.p;

  return (
    <MotionComp
      className={className}
      id={id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.7, ease: EASE }}
    >
      {text}
    </MotionComp>
  );
}

type RevealTag = "div" | "article" | "section" | "li" | "span" | "p";

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
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return createElement(as, { className, id }, children);
  }

  const MotionComp = motion[as] as typeof motion.div;

  return (
    <MotionComp
      className={className}
      id={id}
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.7, ease: EASE, delay }}
    >
      {children}
    </MotionComp>
  );
}

interface FeatureImageProps {
  src: string;
  badge?: ReactNode;
  className?: string;
  eager?: boolean;
}

function FeatureImage({ src, badge, className, eager }: FeatureImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-3%", "3%"]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.98, 1, 1.02]);

  if (prefersReducedMotion) {
    return (
      <div ref={ref} className={`r__feature-media ${className || ""}`}>
        <img src={src} alt="" loading="lazy" decoding="async" />
        {badge}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={`r__feature-media ${className || ""}`}
      initial={{ opacity: eager ? 1 : 0 }}
      whileInView={{ opacity: 1 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.8, ease: EASE }}
    >
      <motion.img
        src={src}
        alt=""
        loading="lazy"
        decoding="async"
        style={{ y, scale }}
      />
      {badge}
    </motion.div>
  );
}

function ClosingImage({ src }: { src: string }) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return (
      <div className="r__closing-media">
        <img src={src} alt="" loading="lazy" decoding="async" />
      </div>
    );
  }

  return (
    <motion.div
      className="r__closing-media"
      initial={{ opacity: 0, scale: 0.97 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.9, ease: EASE }}
    >
      <img src={src} alt="" loading="lazy" decoding="async" />
    </motion.div>
  );
}

const FRAMEWORKS: { n: string; label: Bi; title: Bi; body: Bi }[] = [
  {
    n: "01",
    label: { en: "Intersectionality", fr: "Intersectionnalité" },
    title: {
      en: "Centering identity, every layer of it.",
      fr: "Au cœur de l'identité, dans toutes ses dimensions.",
    },
    body: {
      en: "Our research is guided by an intersectional framework that recognizes how race, gender, class, and immigration status converge to shape lived experience. Black immigrants face unique and overlapping challenges that cannot be examined through a single lens.",
      fr: "Nos recherches s'appuient sur un cadre intersectionnel qui reconnaît comment la race, le genre, la classe sociale et le statut d'immigration se conjuguent pour façonner l'expérience vécue. Les immigrants noirs font face à des défis uniques et imbriqués qui ne peuvent être examinés sous un seul angle.",
    },
  },
  {
    n: "02",
    label: { en: "The C Factor", fr: "Le Facteur C" },
    title: {
      en: "Race as a constant force.",
      fr: "La race comme force constante.",
    },
    body: {
      en: "We apply the C Factor, an approach that recognizes race as a constant variable influencing access, opportunity, and outcomes. Even when every other variable is held equal, race continues to bend the curve of daily life for Black immigrants.",
      fr: "Nous appliquons le Facteur C, une approche qui reconnaît la race comme une variable constante influençant l'accès, les possibilités et les résultats. Même lorsque toutes les autres variables sont identiques, la race continue d'infléchir le cours de la vie quotidienne des immigrants noirs.",
    },
  },
];

const GOALS: { n: string; title: Bi; body: Bi }[] = [
  {
    n: "01",
    title: {
      en: "Reveal Systemic Inequality",
      fr: "Révéler les inégalités systémiques",
    },
    body: {
      en: "Uncover the layered effects of systemic inequality on Black immigrants through comprehensive data analysis and community driven research.",
      fr: "Mettre au jour les effets multiples des inégalités systémiques sur les immigrants noirs grâce à une analyse approfondie des données et à une recherche menée par la communauté.",
    },
  },
  {
    n: "02",
    title: {
      en: "Design Responsive Programs",
      fr: "Concevoir des programmes adaptés",
    },
    body: {
      en: "Create programs that are culturally and contextually responsive to the unique needs and lived realities of Black immigrants.",
      fr: "Créer des programmes adaptés sur le plan culturel et contextuel aux besoins uniques et aux réalités vécues des immigrants noirs.",
    },
  },
  {
    n: "03",
    title: {
      en: "Advocate for Policy Change",
      fr: "Plaider pour des changements de politiques",
    },
    body: {
      en: "Push for policies that address root causes, not just surface level issues affecting Black immigrant communities across the country.",
      fr: "Promouvoir des politiques qui s'attaquent aux causes profondes, et pas seulement aux problèmes de surface, touchant les communautés d'immigrants noirs partout au pays.",
    },
  },
  {
    n: "04",
    title: {
      en: "Elevate Lived Experiences",
      fr: "Valoriser les expériences vécues",
    },
    body: {
      en: "Amplify community knowledge and lived experiences as valid, essential, and transformative evidence for lasting change.",
      fr: "Amplifier les savoirs communautaires et les expériences vécues en tant que données valables, essentielles et transformatrices pour un changement durable.",
    },
  },
];

export default function Research() {
  const mainRef = useRef<HTMLElement>(null);
  const { t, lang } = useLanguage();

  useEffect(() => {
    document.title = t({
      en: "Research | Black Immigrants Community Foundation",
      fr: "Recherche | Black Immigrants Community Foundation",
    });
    const desc = t({
      en: "BICF research uses intersectional and C Factor frameworks to study, support, and advocate for Black immigrants.",
      fr: "La recherche de la BICF utilise les cadres intersectionnel et du Facteur C pour étudier, soutenir et défendre les immigrants noirs.",
    });
    let meta = document.querySelector<HTMLMetaElement>(
      'meta[name="description"]',
    );
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", desc);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  return (
    <main className="r" ref={mainRef}>
      <div className="r__bg" aria-hidden="true">
        <div className="r__bg-grid" />
        <div className="r__bg-orb r__bg-orb--1" />
        <div className="r__bg-orb r__bg-orb--2" />
        <div className="r__bg-orb r__bg-orb--3" />
      </div>

      <h1 className="r__sr-only">
        {t({
          en: "Research at the Black Immigrants Community Foundation",
          fr: "La recherche à la Black Immigrants Community Foundation",
        })}
      </h1>

      <section className="r__opening">
        <div className="r__opening-grid">
          <div className="r__opening-content">
            <Reveal as="span" className="r__research-label">
              {t({ en: "Research / Findings", fr: "Recherche / Résultats" })}
            </Reveal>
            <ScrollText
              as="h2"
              className="r__opening-title"
              text={t({
                en: "Our Research Approach.",
                fr: "Notre approche de recherche.",
              })}
            />
            <ScrollText
              className="r__opening-sub"
              text={t({
                en: "Evidence based insights driving meaningful change for Black immigrants across communities.",
                fr: "Des constats fondés sur des données probantes qui génèrent un changement réel pour les immigrants noirs dans toutes les communautés.",
              })}
            />
            <Reveal as="div" className="r__opening-meta" delay={0.18}>
              <span className="r__opening-meta-item">
                <span className="r__opening-meta-num">02</span>
                {t({ en: "Frameworks", fr: "Cadres" })}
              </span>
              <span className="r__opening-meta-divider" aria-hidden="true" />
              <span className="r__opening-meta-item">
                <span className="r__opening-meta-num">04</span>
                {t({ en: "Goals", fr: "Objectifs" })}
              </span>
              <span className="r__opening-meta-divider" aria-hidden="true" />
              <span className="r__opening-meta-item">
                <span className="r__opening-meta-num">01</span>
                {t({ en: "Commitment", fr: "Engagement" })}
              </span>
            </Reveal>
          </div>

          <FeatureImage
            src={IMAGES[1]}
            className="r__opening-media"
            eager
            badge={
              <span className="r__feature-badge" aria-hidden="true">
                <span className="r__feature-badge-dot" />
                <span className="r__feature-badge-num">01</span>
                <span className="r__feature-badge-label">
                  {t({ en: "Research", fr: "Recherche" })}
                </span>
              </span>
            }
          />
        </div>
      </section>

      <section className="r__narrative" aria-labelledby="r-why">
        <div className="r__narrative-grid">
          <div className="r__narrative-aside">
            <Reveal as="span" className="r__feature-kicker">
              {t({ en: "Why Research", fr: "Pourquoi la recherche" })}
            </Reveal>
            <ScrollText
              as="h2"
              id="r-why"
              className="r__narrative-heading"
              text={t({
                en: "Why research matters here.",
                fr: "Pourquoi la recherche compte ici.",
              })}
            />
            <FeatureImage
              src={IMAGES[3]}
              className="r__narrative-media"
              badge={
                <span className="r__feature-badge" aria-hidden="true">
                  <span className="r__feature-badge-dot" />
                  <span className="r__feature-badge-num">03</span>
                  <span className="r__feature-badge-label">
                    {t({ en: "In Action", fr: "En action" })}
                  </span>
                </span>
              }
            />
          </div>
          <div className="r__narrative-body">
            <ScrollText
              className="r__narrative-lead"
              text={t({
                en: "At the Black Immigrants Community Foundation, research plays a vital role in how we understand, support, and advocate for Black immigrants.",
                fr: "À la Black Immigrants Community Foundation, la recherche joue un rôle essentiel dans notre façon de comprendre, de soutenir et de défendre les immigrants noirs.",
              })}
            />
            <ScrollText
              className="r__narrative-block"
              text={t({
                en: "Our studies help shape programs, influence policies, and amplify the lived experiences of the communities we serve.",
                fr: "Nos études contribuent à façonner les programmes, à influencer les politiques et à amplifier les expériences vécues des communautés que nous servons.",
              })}
            />
            <ScrollText
              className="r__narrative-block"
              text={t({
                en: "We are committed to producing research that is community centered, culturally grounded, and actionable. Every study we undertake is designed to create real, measurable impact for Black immigrant communities.",
                fr: "Nous nous engageons à produire une recherche centrée sur la communauté, ancrée dans la culture et porteuse d'action. Chaque étude que nous menons est conçue pour générer un impact réel et mesurable pour les communautés d'immigrants noirs.",
              })}
            />
            <ScrollText
              className="r__narrative-block"
              text={t({
                en: "Our work bridges the gap between academic research and community needs, ensuring that the voices and experiences of Black immigrants are not just documented but actively drive the conversation forward.",
                fr: "Notre travail jette un pont entre la recherche universitaire et les besoins de la communauté, en veillant à ce que les voix et les expériences des immigrants noirs soient non seulement documentées, mais qu'elles fassent activement avancer la conversation.",
              })}
            />
          </div>
        </div>
      </section>

      <section className="r__feature" aria-labelledby="r-frameworks">
        <div className="r__feature-grid">
          <FeatureImage
            src={IMAGES[0]}
            badge={
              <span className="r__feature-badge" aria-hidden="true">
                <span className="r__feature-badge-dot" />
                <span className="r__feature-badge-num">02</span>
                <span className="r__feature-badge-label">
                  {t({ en: "Frameworks", fr: "Cadres" })}
                </span>
              </span>
            }
          />
          <div className="r__feature-content">
            <Reveal as="span" className="r__feature-kicker">
              {t({ en: "Methodology", fr: "Méthodologie" })}
            </Reveal>
            <ScrollText
              as="h2"
              id="r-frameworks"
              className="r__feature-title"
              text={t({ en: "How we study.", fr: "Notre façon d'étudier." })}
            />
            <ScrollText
              className="r__feature-lede"
              text={t({
                en: "Two frameworks shape every study we publish, making sure the people most affected are the ones we hear most clearly.",
                fr: "Deux cadres façonnent chaque étude que nous publions, afin que les personnes les plus touchées soient celles que nous entendons le plus clairement.",
              })}
            />
            <ul className="r__cards">
              {FRAMEWORKS.map((f, i) => (
                <Reveal
                  key={f.n}
                  as="li"
                  className="r__card"
                  delay={0.06 + i * 0.08}
                >
                  <span className="r__card-num" aria-hidden="true">
                    {f.n}
                  </span>
                  <div className="r__card-body">
                    <span className="r__card-label">{t(f.label)}</span>
                    <h3 className="r__card-title">{t(f.title)}</h3>
                    <p className="r__card-text">{t(f.body)}</p>
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="r__statement">
        <div className="r__statement-inner">
          <ScrollText
            as="h2"
            className="r__statement-text"
            text={t({
              en: "Race Remains Constant",
              fr: "La race demeure constante",
            })}
          />
          <ScrollText
            className="r__statement-sub"
            text={t({
              en: "Even when all other variables remain the same, race continues to shape access, opportunity, and outcomes for Black immigrants.",
              fr: "Même lorsque toutes les autres variables demeurent identiques, la race continue de façonner l'accès, les possibilités et les résultats pour les immigrants noirs.",
            })}
          />
        </div>
      </section>

      <section className="r__feature r__feature--flip" aria-labelledby="r-goals">
        <div className="r__feature-grid">
          <div className="r__feature-content">
            <Reveal as="span" className="r__feature-kicker">
              {t({ en: "Our Goals", fr: "Nos objectifs" })}
            </Reveal>
            <ScrollText
              as="h2"
              id="r-goals"
              className="r__feature-title"
              text={t({
                en: "What we're building toward.",
                fr: "Ce que nous bâtissons.",
              })}
            />
            <ScrollText
              className="r__feature-lede"
              text={t({
                en: "Through intersectional and C Factor frameworks, our research targets four outcomes, every one of them measurable, every one of them owned by community.",
                fr: "À travers les cadres intersectionnel et du Facteur C, notre recherche vise quatre résultats, chacun mesurable et chacun porté par la communauté.",
              })}
            />
            <ul className="r__cards r__cards--compact">
              {GOALS.map((g, i) => (
                <Reveal
                  key={g.n}
                  as="li"
                  className="r__card"
                  delay={0.06 + i * 0.06}
                >
                  <span className="r__card-num" aria-hidden="true">
                    {g.n}
                  </span>
                  <div className="r__card-body">
                    <h3 className="r__card-title">{t(g.title)}</h3>
                    <p className="r__card-text">{t(g.body)}</p>
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>
          <FeatureImage
            src={IMAGES[2]}
            badge={
              <span className="r__feature-badge" aria-hidden="true">
                <span className="r__feature-badge-dot" />
                <span className="r__feature-badge-num">04</span>
                <span className="r__feature-badge-label">
                  {t({ en: "Goals", fr: "Objectifs" })}
                </span>
              </span>
            }
          />
        </div>
      </section>

      <section className="r__converge" aria-labelledby="r-drives">
        <div className="r__converge-inner">
          <Reveal as="span" className="r__feature-kicker">
            {t({ en: "In Practice", fr: "En pratique" })}
          </Reveal>
          <ScrollText
            as="h2"
            id="r-drives"
            className="r__converge-title"
            text={t({
              en: "Research that drives change.",
              fr: "Une recherche qui génère le changement.",
            })}
          />
          <ScrollText
            className="r__converge-text"
            text={t({
              en: "Every study we publish is designed to translate into action, shaping programs, informing policy, and centering the voices of Black immigrant communities in the decisions that affect them.",
              fr: "Chaque étude que nous publions est conçue pour se traduire en action, en façonnant les programmes, en éclairant les politiques et en plaçant les voix des communautés d'immigrants noirs au cœur des décisions qui les concernent.",
            })}
          />
        </div>
      </section>

      <section className="r__closing" aria-labelledby="r-commitment">
        <div className="r__closing-grid">
          <ClosingImage src={IMAGES[4]} />

          <div className="r__closing-content">
            <Reveal as="span" className="r__feature-kicker">
              {t({ en: "What's Next", fr: "La suite" })}
            </Reveal>

            <Reveal as="article" className="r__closing-block">
              <ScrollText
                as="h2"
                id="r-commitment"
                className="r__closing-heading"
                text={t({
                  en: "Our Commitment.",
                  fr: "Notre engagement.",
                })}
              />
              <ScrollText
                className="r__closing-text"
                text={t({
                  en: "We commit to research grounded in community knowledge, driven by the realities of Black immigrants and accountable to the communities we serve.",
                  fr: "Nous nous engageons à mener une recherche ancrée dans les savoirs communautaires, guidée par les réalités des immigrants noirs et redevable envers les communautés que nous servons.",
                })}
              />
              <div className="r__closing-actions">
                <Link to="/partner" className="r__btn">
                  {t({ en: "Partner With Us", fr: "Devenir partenaire" })}
                </Link>
              </div>
            </Reveal>

            <span className="r__closing-divider" aria-hidden="true" />

            <Reveal as="article" className="r__closing-block">
              <ScrollText
                as="h2"
                className="r__closing-heading"
                text={t({
                  en: "Join Our Research Initiatives.",
                  fr: "Participez à nos initiatives de recherche.",
                })}
              />
              <ScrollText
                className="r__closing-text"
                text={t({
                  en: "Whether you are a researcher, partner organization, or community member with a story to share, your participation strengthens our work and amplifies impact.",
                  fr: "Que vous soyez chercheur, organisation partenaire ou membre de la communauté ayant une histoire à partager, votre participation renforce notre travail et amplifie son impact.",
                })}
              />
              <div className="r__closing-actions">
                <Link to="/research/current" className="r__btn">
                  {t({ en: "Current Studies", fr: "Études en cours" })}
                </Link>
                <Link
                  to="/research/studies"
                  className="r__btn r__btn--ghost"
                >
                  {t({ en: "Read Our Studies", fr: "Lire nos études" })}
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </main>
  );
}
