import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation, useNavigationType } from "react-router-dom";
import { useLanguage, type Lang } from "../../context/LanguageContext";
import "./About.scss";

type Bi = Record<Lang, string>;

const ease = [0.25, 0.46, 0.45, 0.94] as const;

const motionMap = {
  div: motion.div,
  span: motion.span,
  p: motion.p,
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  li: motion.li,
  section: motion.section,
} as const;

type RevealTag = keyof typeof motionMap;

type RevealProps = {
  children: ReactNode;
  delay?: number;
  y?: number;
  duration?: number;
  className?: string;
  as?: RevealTag;
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
  const Comp = motionMap[as];
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

function useScrollRestoration(storageKey = "scroll") {
  const { key, pathname } = useLocation();
  const navType = useNavigationType();

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  useEffect(() => {
    const save = () => {
      sessionStorage.setItem(`${storageKey}:${key}`, String(window.scrollY));
    };
    window.addEventListener("pagehide", save);
    window.addEventListener("beforeunload", save);
    return () => {
      save();
      window.removeEventListener("pagehide", save);
      window.removeEventListener("beforeunload", save);
    };
  }, [key, storageKey]);

  useEffect(() => {
    const saved = sessionStorage.getItem(`${storageKey}:${key}`);
    if (navType === "POP" && saved !== null) {
      const y = parseInt(saved, 10);
      requestAnimationFrame(() => {
        window.scrollTo(0, y);
        requestAnimationFrame(() => window.scrollTo(0, y));
      });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, key, navType, storageKey]);
}

const pillars: { label: Bi; tag: Bi; body: Bi; image: string }[] = [
  {
    label: { en: "Purpose", fr: "Raison d'être" },
    tag: { en: "Why we exist", fr: "Pourquoi nous existons" },
    body: {
      en: "Our purpose is to support, empower, and advocate for Black immigrants by addressing systemic barriers that hinder their progress. We foster unity, resilience, and belonging while promoting justice, equality, and opportunity.",
      fr: "Notre raison d'être est de soutenir, d'outiller et de défendre les immigrants noirs en nous attaquant aux barrières systémiques qui freinent leur progression. Nous favorisons l'unité, la résilience et le sentiment d'appartenance tout en promouvant la justice, l'égalité et les possibilités.",
    },
    image: "/b1.webp",
  },
  {
    label: { en: "Mission", fr: "Mission" },
    tag: { en: "What we do", fr: "Ce que nous faisons" },
    body: {
      en: "The mission of BICF is to uplift and empower Black immigrants through practical resources, advocacy, and community engagement. We are dedicated to breaking down systemic inequalities and ensuring access to education, healthcare, employment.",
      fr: "La mission de la BICF est d'élever et d'outiller les immigrants noirs par des ressources concrètes, la défense des droits et l'engagement communautaire. Nous nous consacrons à démanteler les inégalités systémiques et à garantir l'accès à l'éducation, aux soins de santé et à l'emploi.",
    },
    image: "/b2.webp",
  },
  {
    label: { en: "Vision", fr: "Vision" },
    tag: { en: "Where we are headed", fr: "Où nous allons" },
    body: {
      en: "We envision a world where Black immigrants are fully accepted, valued, and celebrated, living free from discrimination and systemic barriers. BICF works toward a future where Black immigrants are leaders, innovators.",
      fr: "Nous imaginons un monde où les immigrants noirs sont pleinement acceptés, valorisés et célébrés, vivant à l'abri de la discrimination et des barrières systémiques. La BICF œuvre pour un avenir où les immigrants noirs sont des leaders et des innovateurs.",
    },
    image: "/b3.webp",
  },
];

const values: { title: Bi; body: Bi }[] = [
  {
    title: { en: "Empowerment", fr: "Autonomisation" },
    body: {
      en: "We believe in the power of self determination and work to equip Black immigrants with the tools, knowledge, and resources they need to succeed. Empowerment through education, advocacy, and access to opportunities is key to creating a more equitable future for Black immigrants and their communities.",
      fr: "Nous croyons au pouvoir de l'autodétermination et nous travaillons à outiller les immigrants noirs avec les outils, les connaissances et les ressources nécessaires à leur réussite. L'autonomisation par l'éducation, la défense des droits et l'accès aux possibilités est essentielle pour bâtir un avenir plus équitable pour les immigrants noirs et leurs communautés.",
    },
  },
  {
    title: { en: "Equality & Justice", fr: "Égalité et justice" },
    body: {
      en: "We are committed to advocating for fairness and equality for all Black immigrants. We believe that every individual deserves equal rights, opportunities, and respect regardless of their race, background, or immigration status. We actively challenge systemic inequalities and work to ensure that Black immigrants are treated justly in all spheres of life.",
      fr: "Nous nous engageons à défendre l'équité et l'égalité pour tous les immigrants noirs. Nous croyons que chaque personne mérite des droits, des possibilités et un respect égaux, peu importe sa race, ses origines ou son statut d'immigration. Nous remettons activement en question les inégalités systémiques et veillons à ce que les immigrants noirs soient traités avec justice dans toutes les sphères de la vie.",
    },
  },
  {
    title: { en: "Community & Solidarity", fr: "Communauté et solidarité" },
    body: {
      en: "We recognize the strength of a united community. BICF fosters a sense of belonging and solidarity among Black immigrants, creating spaces for individuals to connect, share their experiences, and support one another. We believe that collective action, mutual respect, and shared experiences are essential for building a stronger, more resilient community.",
      fr: "Nous reconnaissons la force d'une communauté unie. La BICF favorise un sentiment d'appartenance et de solidarité chez les immigrants noirs, en créant des espaces où les personnes peuvent se rencontrer, partager leurs expériences et se soutenir mutuellement. Nous croyons que l'action collective, le respect mutuel et les expériences partagées sont essentiels pour bâtir une communauté plus forte et plus résiliente.",
    },
  },
  {
    title: {
      en: "Cultural Respect & Diversity",
      fr: "Respect culturel et diversité",
    },
    body: {
      en: "We honor the rich cultural identities of Black immigrants and celebrate the diversity they bring to society. We believe in the importance of preserving cultural heritage while promoting inclusivity and mutual understanding. Our work respects and upholds the value of diverse perspectives, languages, and traditions.",
      fr: "Nous honorons les riches identités culturelles des immigrants noirs et célébrons la diversité qu'ils apportent à la société. Nous croyons en l'importance de préserver le patrimoine culturel tout en favorisant l'inclusion et la compréhension mutuelle. Notre travail respecte et défend la valeur des perspectives, des langues et des traditions diverses.",
    },
  },
  {
    title: {
      en: "Integrity & Transparency",
      fr: "Intégrité et transparence",
    },
    body: {
      en: "We hold ourselves to the highest standards of honesty, accountability, and ethical conduct. We are committed to maintaining transparency in our operations, communications, and decision making processes. We build trust by acting with integrity and ensuring that our actions align with the needs and expectations of the communities we serve.",
      fr: "Nous nous tenons aux normes les plus élevées d'honnêteté, de responsabilité et de conduite éthique. Nous nous engageons à maintenir la transparence dans nos opérations, nos communications et nos processus décisionnels. Nous bâtissons la confiance en agissant avec intégrité et en veillant à ce que nos actions répondent aux besoins et aux attentes des communautés que nous servons.",
    },
  },
  {
    title: {
      en: "Advocacy & Activism",
      fr: "Défense des droits et militantisme",
    },
    body: {
      en: "We are driven by a commitment to social justice and advocate for the rights, needs, and aspirations of Black immigrants. Through activism, policy engagement, and grassroots organizing, we work to bring about systemic change that addresses the unique challenges faced by Black immigrants and dismantles the barriers to equality they encounter.",
      fr: "Nous sommes animés par un engagement envers la justice sociale et nous défendons les droits, les besoins et les aspirations des immigrants noirs. Par le militantisme, l'engagement politique et la mobilisation citoyenne, nous travaillons à provoquer un changement systémique qui s'attaque aux défis uniques des immigrants noirs et qui démantèle les barrières à l'égalité qu'ils rencontrent.",
    },
  },
  {
    title: {
      en: "Collaboration & Partnerships",
      fr: "Collaboration et partenariats",
    },
    body: {
      en: "We believe in the power of collaboration to create lasting change. BICF values partnerships with other organizations, community groups, and stakeholders who share our vision of a just and inclusive society. By working together, we can maximize our collective impact and amplify the voices of Black immigrants.",
      fr: "Nous croyons au pouvoir de la collaboration pour créer un changement durable. La BICF valorise les partenariats avec d'autres organisations, groupes communautaires et parties prenantes qui partagent notre vision d'une société juste et inclusive. En travaillant ensemble, nous pouvons maximiser notre impact collectif et amplifier la voix des immigrants noirs.",
    },
  },
  {
    title: { en: "Resilience & Hope", fr: "Résilience et espoir" },
    body: {
      en: "We celebrate the resilience and strength of Black immigrants who overcome adversity in the face of challenges. At BICF, we are driven by hope, a belief that positive change is possible. We are committed to inspiring and supporting Black immigrants as they build new lives, and as they contribute to a brighter and more inclusive future for all.",
      fr: "Nous célébrons la résilience et la force des immigrants noirs qui surmontent l'adversité face aux défis. À la BICF, nous sommes animés par l'espoir, la conviction qu'un changement positif est possible. Nous nous engageons à inspirer et à soutenir les immigrants noirs alors qu'ils bâtissent une nouvelle vie et qu'ils contribuent à un avenir plus radieux et plus inclusif pour tous.",
    },
  },
];

const services: { title: Bi; body: Bi }[] = [
  {
    title: {
      en: "Legal and Immigration Support",
      fr: "Soutien juridique et à l'immigration",
    },
    body: {
      en: "Guidance and referrals for asylum, residence, and family reunification.",
      fr: "Accompagnement et références pour l'asile, la résidence et la réunification familiale.",
    },
  },
  {
    title: { en: "Education and Mentorship", fr: "Éducation et mentorat" },
    body: {
      en: "Academic support, ESL programs, and career readiness training.",
      fr: "Soutien scolaire, programmes d'anglais langue seconde et formation à la préparation à la carrière.",
    },
  },
  {
    title: {
      en: "Employment and Financial Empowerment",
      fr: "Emploi et autonomisation financière",
    },
    body: {
      en: "Job placement, vocational training, and financial literacy.",
      fr: "Placement professionnel, formation professionnelle et littératie financière.",
    },
  },
  {
    title: {
      en: "Mental Health and Wellness",
      fr: "Santé mentale et mieux-être",
    },
    body: {
      en: "Access to culturally aware counseling and wellness workshops.",
      fr: "Accès à du counseling sensible à la culture et à des ateliers de mieux-être.",
    },
  },
  {
    title: { en: "Community Engagement", fr: "Engagement communautaire" },
    body: {
      en: "Events, cultural programs, and leadership development.",
      fr: "Événements, programmes culturels et développement du leadership.",
    },
  },
  {
    title: {
      en: "Advocacy and Awareness",
      fr: "Défense des droits et sensibilisation",
    },
    body: {
      en: "Promoting equitable policies and amplifying Black immigrant voices.",
      fr: "Promouvoir des politiques équitables et amplifier la voix des immigrants noirs.",
    },
  },
];

const gallery: { src: string; label: Bi; caption: Bi }[] = [
  {
    src: "/b4.webp",
    label: { en: "Together", fr: "Ensemble" },
    caption: {
      en: "Building bridges through shared experience and a common future.",
      fr: "Bâtir des ponts par l'expérience partagée et un avenir commun.",
    },
  },
  {
    src: "/b5.webp",
    label: { en: "Empowerment", fr: "Autonomisation" },
    caption: {
      en: "Programs that turn ambition into lasting opportunity.",
      fr: "Des programmes qui transforment l'ambition en possibilités durables.",
    },
  },
  {
    src: "/b6.webp",
    label: { en: "Solidarity", fr: "Solidarité" },
    caption: {
      en: "Voices amplified through collective action and care.",
      fr: "Des voix amplifiées par l'action collective et l'attention.",
    },
  },
  {
    src: "/b7.webp",
    label: { en: "Advocacy", fr: "Défense des droits" },
    caption: {
      en: "Speaking up for policy change and fair representation.",
      fr: "Prendre la parole pour le changement des politiques et une représentation équitable.",
    },
  },
  {
    src: "/b8.webp",
    label: { en: "Growth", fr: "Croissance" },
    caption: {
      en: "Workshops that build skills and open doors.",
      fr: "Des ateliers qui développent les compétences et ouvrent des portes.",
    },
  },
  {
    src: "/b9.webp",
    label: { en: "Belonging", fr: "Appartenance" },
    caption: {
      en: "Creating spaces where everyone feels at home.",
      fr: "Créer des espaces où chacun se sent chez soi.",
    },
  },
];

const sponsors: { name: Bi; short: Bi; src: string; href: string }[] = [
  {
    name: {
      en: "Government of Canada, Supporting Black Canadian Communities Initiative",
      fr: "Gouvernement du Canada, Initiative Appuyer les communautés noires du Canada",
    },
    short: { en: "Government of Canada", fr: "Gouvernement du Canada" },
    src: "/canada.png",
    href: "https://www.canada.ca/en/employment-social-development/programs/supporting-black-canadian-communities-initiative.html",
  },
  {
    name: { en: "Black Business Initiative", fr: "Black Business Initiative" },
    short: { en: "BBI", fr: "BBI" },
    src: "/bbi.png",
    href: "https://bbi.ca/",
  },
  {
    name: {
      en: "Ontario Trillium Foundation",
      fr: "Fondation Trillium de l'Ontario",
    },
    short: {
      en: "Ontario Trillium Foundation",
      fr: "Fondation Trillium de l'Ontario",
    },
    src: "/otf.png",
    href: "https://otf.ca/",
  },
  {
    name: { en: "Government of Ontario", fr: "Gouvernement de l'Ontario" },
    short: { en: "Government of Ontario", fr: "Gouvernement de l'Ontario" },
    src: "/ontario.png",
    href: "https://www.ontario.ca/",
  },
];

const heroSlides: { label: Bi; title: Record<Lang, string[]>; body: Bi }[] = [
  {
    label: { en: "About / The Foundation", fr: "À propos / La Fondation" },
    title: {
      en: ["Growth powered by Black immigrants."],
      fr: ["La croissance portée par les immigrants noirs."],
    },
    body: {
      en: "The Black Immigrants Community Foundation is a nonprofit organization committed to supporting and empowering Black immigrants through advocacy, resources, and community building.",
      fr: "La Black Immigrants Community Foundation est un organisme sans but lucratif voué au soutien et à l'autonomisation des immigrants noirs par la défense des droits, les ressources et le renforcement communautaire.",
    },
  },
  {
    label: { en: "Our Mission", fr: "Notre mission" },
    title: {
      en: ["Practical resources.", "Real advocacy."],
      fr: ["Des ressources concrètes.", "Une défense réelle."],
    },
    body: {
      en: "BICF uplifts and empowers Black immigrants through practical resources, advocacy, and community engagement, breaking down systemic inequalities along the way.",
      fr: "La BICF élève et outille les immigrants noirs par des ressources concrètes, la défense des droits et l'engagement communautaire, en démantelant les inégalités systémiques en cours de route.",
    },
  },
  {
    label: { en: "Our Vision", fr: "Notre vision" },
    title: {
      en: ["A world that sees,", "values, and celebrates."],
      fr: ["Un monde qui voit,", "valorise et célèbre."],
    },
    body: {
      en: "We envision a world where Black immigrants are fully accepted, valued, and celebrated, living free from discrimination and systemic barriers.",
      fr: "Nous imaginons un monde où les immigrants noirs sont pleinement acceptés, valorisés et célébrés, vivant à l'abri de la discrimination et des barrières systémiques.",
    },
  },
];

const fullStory: Bi[] = [
  {
    en: "The Black Immigrants Community Foundation (BICF) is a nonprofit organization committed to supporting and empowering Black immigrants through advocacy, resources, and community building. We understand that Black immigrants often face complex and intersecting challenges that go beyond the typical struggles associated with immigration, such as racial discrimination, cultural alienation, language barriers, and limited access to critical services. These difficulties are frequently compounded by systemic inequalities that affect their ability to fully integrate and thrive in their new communities.",
    fr: "La Black Immigrants Community Foundation (BICF) est un organisme sans but lucratif voué au soutien et à l'autonomisation des immigrants noirs par la défense des droits, les ressources et le renforcement communautaire. Nous comprenons que les immigrants noirs font souvent face à des défis complexes et imbriqués qui vont au-delà des difficultés habituelles liées à l'immigration, comme la discrimination raciale, l'aliénation culturelle, les barrières linguistiques et l'accès limité aux services essentiels. Ces difficultés sont souvent aggravées par des inégalités systémiques qui nuisent à leur capacité de s'intégrer pleinement et de s'épanouir dans leurs nouvelles communautés.",
  },
  {
    en: "At BICF, we are passionate about addressing these unique barriers and providing a platform where Black immigrants can find the support they need to succeed. Whether it's navigating the immigration process, accessing legal resources, or receiving mental health support, we are here to ensure that Black immigrants have the tools and guidance they need to build a brighter future. Our programs and services are designed to be culturally relevant and responsive to the specific needs of the Black immigrant community, ensuring that individuals feel valued, heard, and supported.",
    fr: "À la BICF, nous mettons toute notre passion à nous attaquer à ces obstacles uniques et à offrir une plateforme où les immigrants noirs peuvent trouver le soutien dont ils ont besoin pour réussir. Qu'il s'agisse de traverser le processus d'immigration, d'accéder à des ressources juridiques ou de recevoir un soutien en santé mentale, nous sommes là pour garantir que les immigrants noirs disposent des outils et de l'accompagnement nécessaires pour bâtir un avenir meilleur. Nos programmes et services sont conçus pour être adaptés à la culture et répondre aux besoins précis de la communauté immigrante noire, afin que chaque personne se sente valorisée, écoutée et soutenue.",
  },
  {
    en: "We offer a broad range of services, including legal assistance, employment resources, educational support, and leadership development. Our goal is to break down the barriers that Black immigrants often face in areas such as education, employment, housing, healthcare, and social services. We also provide a safe and inclusive space for the community to connect, share their experiences, and advocate for the change that is needed to ensure greater social justice and equity for Black immigrants in society.",
    fr: "Nous offrons un large éventail de services, dont l'aide juridique, les ressources d'emploi, le soutien éducatif et le développement du leadership. Notre objectif est de démanteler les obstacles auxquels les immigrants noirs font souvent face dans des domaines comme l'éducation, l'emploi, le logement, les soins de santé et les services sociaux. Nous offrons aussi un espace sûr et inclusif où la communauté peut se rencontrer, partager ses expériences et défendre le changement nécessaire pour assurer une plus grande justice sociale et une plus grande équité pour les immigrants noirs dans la société.",
  },
  {
    en: "BICF operates on the belief that a strong, united community is the key to overcoming adversity. By fostering a sense of belonging and solidarity, we work to reduce isolation, build resilience, and promote civic engagement among Black immigrants. We also strive to amplify the voices of Black immigrants, ensuring they have a seat at the table when decisions are made that affect their lives. Our foundation acts as a bridge between Black immigrants and the broader society, helping to strengthen social ties and increase understanding.",
    fr: "La BICF repose sur la conviction qu'une communauté forte et unie est la clé pour surmonter l'adversité. En favorisant un sentiment d'appartenance et de solidarité, nous travaillons à réduire l'isolement, à renforcer la résilience et à promouvoir l'engagement civique chez les immigrants noirs. Nous nous efforçons aussi d'amplifier la voix des immigrants noirs, en veillant à ce qu'ils aient une place à la table lorsque sont prises les décisions qui touchent leur vie. Notre fondation agit comme un pont entre les immigrants noirs et la société dans son ensemble, contribuant à renforcer les liens sociaux et à accroître la compréhension.",
  },
  {
    en: "Through advocacy, education, and partnerships with other organizations, we aim to influence policies that create a more just and inclusive environment for Black immigrants. We also seek to provide opportunities for leadership development, so that Black immigrants can become active participants in their communities and lead efforts for positive change. Our work is grounded in the principles of social justice, equality, and human dignity, and we are unwavering in our commitment to creating a world where Black immigrants can live, work, and thrive free from discrimination and inequity.",
    fr: "Par la défense des droits, l'éducation et les partenariats avec d'autres organisations, nous cherchons à influencer les politiques afin de créer un environnement plus juste et plus inclusif pour les immigrants noirs. Nous cherchons aussi à offrir des occasions de développement du leadership, afin que les immigrants noirs puissent devenir des participants actifs dans leurs communautés et mener les efforts de changement positif. Notre travail s'appuie sur les principes de justice sociale, d'égalité et de dignité humaine, et notre engagement à créer un monde où les immigrants noirs peuvent vivre, travailler et s'épanouir à l'abri de la discrimination et de l'iniquité est inébranlable.",
  },
  {
    en: "At BICF, we believe that the success of Black immigrants is essential to the broader health and prosperity of society. When Black immigrants thrive, we all thrive. Together, we are building a stronger, more inclusive community where the contributions and potential of Black immigrants are recognized, celebrated, and honored. Through our collective efforts, we can create lasting change and build a more equitable future for generations to come.",
    fr: "À la BICF, nous croyons que la réussite des immigrants noirs est essentielle à la santé et à la prospérité de la société dans son ensemble. Quand les immigrants noirs s'épanouissent, nous nous épanouissons tous. Ensemble, nous bâtissons une communauté plus forte et plus inclusive où les contributions et le potentiel des immigrants noirs sont reconnus, célébrés et honorés. Par nos efforts collectifs, nous pouvons créer un changement durable et bâtir un avenir plus équitable pour les générations à venir.",
  },
];

type AboutProps = {
  pageTitle?: string;
  autoplayDelay?: number;
};

export default function About({
  pageTitle = "About | Black Immigrants Community Foundation",
  autoplayDelay = 8000,
}: AboutProps) {
  const { t, lang } = useLanguage();
  const [activeSlide, setActiveSlide] = useState(0);
  const [storyExpanded, setStoryExpanded] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);

  useScrollRestoration("bicf-scroll");

  useEffect(() => {
    document.title =
      lang === "fr"
        ? "À propos | Black Immigrants Community Foundation"
        : pageTitle;
  }, [pageTitle, lang]);

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
    <main className="about">
      <section className="about__hero" aria-labelledby="about-hero-title">
        <div className="about__hero-media" aria-hidden="true">
          {heroSlides.map((_, i) => (
            <div
              key={i}
              className={`about__hero-shader about__hero-shader--p${i}${
                i === activeSlide ? " about__hero-shader--active" : ""
              }`}
            />
          ))}
        </div>
        <div className="about__hero-veil" aria-hidden="true" />

        <div className="about__hero-panel">
          <div className="about__hero-panel-inner">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlide}
                id={`hero-panel-${activeSlide}`}
                role="tabpanel"
                aria-labelledby={`hero-tab-${activeSlide}`}
                className="about__hero-slide"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.5, ease }}
              >
                <span className="about__hero-label">
                  {t(heroSlides[activeSlide].label)}
                </span>
                <h1 id="about-hero-title" className="about__hero-title">
                  {t(heroSlides[activeSlide].title).map((line, i) => (
                    <span key={i} className="about__hero-line">
                      {line}
                    </span>
                  ))}
                </h1>
                <p className="about__hero-body">
                  {t(heroSlides[activeSlide].body)}
                </p>
              </motion.div>
            </AnimatePresence>

            <div className="about__hero-controls">
              <button
                type="button"
                className="about__hero-nav"
                onClick={() => goTo(activeSlide - 1)}
                aria-label={t({
                  en: "Previous slide",
                  fr: "Diapositive précédente",
                })}
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
                className="about__hero-bars"
                role="tablist"
                aria-label={t({ en: "Hero slides", fr: "Diapositives" })}
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
                    aria-label={t({
                      en: `Go to slide ${i + 1}`,
                      fr: `Aller à la diapositive ${i + 1}`,
                    })}
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
                onClick={() => goTo(activeSlide + 1)}
                aria-label={t({ en: "Next slide", fr: "Diapositive suivante" })}
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

            <div className="about__hero-meta">
              <span>Ajax, Ontario</span>
              <span aria-hidden="true">·</span>
              <span>(905) 931 3776</span>
            </div>
          </div>
        </div>
      </section>

      <section className="about__story" aria-labelledby="about-story-title">
        <div className="about__container">
          <header className="about__section-head">
            <Reveal as="span" className="about__kicker">
              {t({ en: "About Us", fr: "À propos" })}
            </Reveal>
            <Reveal
              as="h2"
              className="about__section-title"
              delay={0.08}
              id="about-story-title"
            >
              {t({
                en: "A foundation built around the realities of Black immigrant life.",
                fr: "Une fondation conçue autour des réalités de la vie des immigrants noirs.",
              })}
            </Reveal>
          </header>

          <div className="about__story-body">
            <Reveal as="p" delay={0}>
              {t({
                en: "The Black Immigrants Community Foundation (BICF) is a nonprofit organization committed to empowering Black immigrants through advocacy, resources, and community building. We understand the intersecting challenges Black immigrants face from racial discrimination and cultural alienation to systemic barriers that hinder integration and success.",
                fr: "La Black Immigrants Community Foundation (BICF) est un organisme sans but lucratif voué à l'autonomisation des immigrants noirs par la défense des droits, les ressources et le renforcement communautaire. Nous comprenons les défis imbriqués auxquels les immigrants noirs font face, de la discrimination raciale et de l'aliénation culturelle aux barrières systémiques qui freinent l'intégration et la réussite.",
              })}
            </Reveal>

            {storyExpanded && (
              <>
                <Reveal as="p" delay={0.1}>
                  {t({
                    en: "At BICF, we provide culturally responsive programs and support to ensure Black immigrants not only survive but thrive in their new communities. Our work is rooted in dignity, equity, and the belief that collective growth comes when everyone has the opportunity to succeed.",
                    fr: "À la BICF, nous offrons des programmes et un soutien adaptés à la culture pour que les immigrants noirs ne se contentent pas de survivre, mais s'épanouissent dans leurs nouvelles communautés. Notre travail est ancré dans la dignité, l'équité et la conviction que la croissance collective survient lorsque chacun a la possibilité de réussir.",
                  })}
                </Reveal>
                {fullStory.map((para, i) => (
                  <Reveal as="p" key={i} delay={0.15 + i * 0.05}>
                    {t(para)}
                  </Reveal>
                ))}
              </>
            )}

            <div className="about__story-button-wrapper">
              <button
                type="button"
                className="about__story-btn"
                aria-expanded={storyExpanded}
                onClick={() => setStoryExpanded(!storyExpanded)}
              >
                {storyExpanded
                  ? t({ en: "Show Less", fr: "Afficher moins" })
                  : t({ en: "Learn More", fr: "En savoir plus" })}
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="about__pillars" aria-labelledby="about-pillars-title">
        <div className="about__pillars-aurora" aria-hidden="true" />
        <div className="about__container">
          <header className="about__section-head">
            <Reveal as="span" className="about__kicker">
              {t({ en: "The Frame", fr: "Le cadre" })}
            </Reveal>
            <Reveal
              as="h2"
              className="about__section-title"
              delay={0.08}
              id="about-pillars-title"
            >
              {t({
                en: "Purpose, mission, and vision.",
                fr: "Raison d'être, mission et vision.",
              })}
            </Reveal>
          </header>

          <div className="about__pillars-stack">
            {pillars.map((p, i) => (
              <motion.article
                key={p.label.en}
                className="about__pillar"
                data-align={i % 2 === 0 ? "left" : "right"}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-12%" }}
                transition={{ duration: 0.95, ease, delay: i * 0.06 }}
              >
                <div className="about__pillar-media">
                  <img
                    src={p.image}
                    alt={`${t(p.label)}, ${t(p.tag)}`}
                    width={1200}
                    height={900}
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="about__pillar-badge">
                    <span className="about__pillar-badge-num">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="about__pillar-badge-text">
                      {t(p.tag)}
                    </span>
                  </span>
                </div>

                <div className="about__pillar-content">
                  <span className="about__pillar-eyebrow">
                    <span className="about__pillar-dot" aria-hidden="true" />
                    {t({ en: "BICF Foundation", fr: "Fondation BICF" })}
                  </span>
                  <h3 className="about__pillar-label">{t(p.label)}</h3>
                  <p className="about__pillar-body">{t(p.body)}</p>
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
              {t({ en: "Core Values", fr: "Valeurs fondamentales" })}
            </Reveal>
            <Reveal
              as="h2"
              className="about__section-title"
              delay={0.08}
              id="about-values-title"
            >
              {t({
                en: "Eight commitments that shape our work.",
                fr: "Huit engagements qui façonnent notre travail.",
              })}
            </Reveal>
          </header>

          <ul className="about__values-grid">
            {values.map((v, i) => (
              <motion.li
                key={v.title.en}
                className="about__value"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-8%" }}
                transition={{ duration: 0.75, ease, delay: (i % 2) * 0.06 }}
              >
                <span className="about__value-num">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="about__value-title">{t(v.title)}</h3>
                <p className="about__value-body">{t(v.body)}</p>
              </motion.li>
            ))}
          </ul>
        </div>
      </section>

      <section
        className="about__services"
        aria-labelledby="about-services-title"
      >
        <div className="about__container">
          <header className="about__section-head">
            <Reveal as="span" className="about__kicker">
              {t({ en: "What We Do", fr: "Ce que nous faisons" })}
            </Reveal>
            <Reveal
              as="h2"
              className="about__section-title"
              delay={0.08}
              id="about-services-title"
            >
              {t({
                en: "Programs and services for the diverse needs of Black immigrants.",
                fr: "Des programmes et services pour les besoins variés des immigrants noirs.",
              })}
            </Reveal>
          </header>

          <ol className="about__services-list">
            {services.map((s, i) => (
              <motion.li
                key={s.title.en}
                className="about__service"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.8, ease, delay: i * 0.05 }}
              >
                <span className="about__service-num">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="about__service-title">{t(s.title)}</h3>
                <p className="about__service-body">{t(s.body)}</p>
              </motion.li>
            ))}
          </ol>

          <Reveal as="p" className="about__services-note" delay={0.2}>
            {t({
              en: "Each service is tailored to promote empowerment, inclusion, and self sufficiency.",
              fr: "Chaque service est conçu pour favoriser l'autonomisation, l'inclusion et l'autonomie.",
            })}
          </Reveal>
        </div>
      </section>

      <section className="about__gallery" aria-labelledby="about-gallery-title">
        <div className="about__container">
          <header className="about__section-head">
            <Reveal as="span" className="about__kicker">
              {t({ en: "Moments", fr: "Moments" })}
            </Reveal>
            <Reveal
              as="h2"
              className="about__section-title"
              delay={0.08}
              id="about-gallery-title"
            >
              {t({ en: "In the community.", fr: "Dans la communauté." })}
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
                tabIndex={0}
              >
                <img
                  src={item.src}
                  alt={t(item.label)}
                  width={1200}
                  height={1500}
                  loading="lazy"
                  decoding="async"
                />
                <span className="about__gallery-index" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                  <span>/{String(gallery.length).padStart(2, "0")}</span>
                </span>
                <figcaption className="about__gallery-caption">
                  <span className="about__gallery-label">{t(item.label)}</span>
                  <span className="about__gallery-text">
                    {t(item.caption)}
                  </span>
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
              {t({ en: "Supported By", fr: "Soutenu par" })}
            </Reveal>
            <Reveal
              as="h2"
              className="about__section-title"
              delay={0.08}
              id="about-sponsors-title"
            >
              {t({
                en: "Proudly funded by leading Canadian institutions and community partners.",
                fr: "Fièrement financé par d'éminentes institutions canadiennes et des partenaires communautaires.",
              })}
            </Reveal>
          </header>

          <Reveal as="p" className="about__sponsors-intro" delay={0.16}>
            {t({
              en: "BICF's programs are sustained by a network of public funders and community foundations who share our commitment to long term equity for Black immigrants in Canada. Their continued investment makes our coordinated, no cost services possible, and turns one organization's intent into a community wide capability.",
              fr: "Les programmes de la BICF sont soutenus par un réseau de bailleurs de fonds publics et de fondations communautaires qui partagent notre engagement envers une équité durable pour les immigrants noirs au Canada. Leur investissement continu rend possibles nos services coordonnés et gratuits, et transforme l'intention d'un seul organisme en une capacité à l'échelle de toute la communauté.",
            })}
          </Reveal>

          <ul className="about__sponsors-grid">
            {sponsors.map((s, i) => (
              <motion.li
                key={s.name.en}
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
                  aria-label={t(s.name)}
                >
                  <img
                    src={s.src}
                    alt={t(s.name)}
                    loading="lazy"
                    decoding="async"
                  />
                </a>
                <span className="about__sponsor-name">{t(s.short)}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
