import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useLanguage, type Lang } from "../../context/LanguageContext";
import "./Home.scss";

type Bi = Record<Lang, string>;

const HERO_EASE = [0.25, 0.46, 0.45, 0.94] as const;

const heroSlides: {
  label: Bi;
  title: Record<Lang, string[]>;
  body: Bi;
}[] = [
  {
    label: { en: "Welcome to BICF", fr: "Bienvenue à la BICF" },
    title: {
      en: ["A home for those,", "building new homes."],
      fr: ["Un foyer pour ceux", "qui en bâtissent un."],
    },
    body: {
      en: "We stand beside Black immigrants from the moment they arrive, with the advocacy, resources, and community that turn unfamiliar ground into firm footing.",
      fr: "Nous accompagnons les immigrants noirs dès leur arrivée, avec la défense des droits, les ressources et la communauté qui transforment un terrain inconnu en assise solide.",
    },
  },
  {
    label: { en: "What We Do", fr: "Ce que nous faisons" },
    title: {
      en: ["Real support.", "Lasting impact."],
      fr: ["Un soutien réel.", "Un impact durable."],
    },
    body: {
      en: "Legal guidance, educational pathways, wellness, and employment support. Every service is built so Black immigrants don't just survive, they thrive.",
      fr: "Accompagnement juridique, parcours éducatifs, mieux-être et soutien à l'emploi. Chaque service est conçu pour que les immigrants noirs ne se contentent pas de survivre, mais s'épanouissent.",
    },
  },
  {
    label: { en: "Our Community", fr: "Notre communauté" },
    title: {
      en: ["A movement,", "just beginning."],
      fr: ["Un mouvement", "qui ne fait que commencer."],
    },
    body: {
      en: "BICF is a young foundation built around one clear purpose, to walk with Black immigrants as they build new lives. Every story shared shapes what we become.",
      fr: "La BICF est une jeune fondation animée par un but clair : accompagner les immigrants noirs alors qu'ils bâtissent une nouvelle vie. Chaque histoire partagée façonne ce que nous devenons.",
    },
  },
];

const INTRO_FACES = ["/h1.webp", "/h2.webp", "/h3.webp"];

const testimonials: { quote: Bi; name: string; role: Bi }[] = [
  {
    quote: {
      en: "The counseling and wellness programs at BICF helped me manage the stress of immigration. Their culturally sensitive approach gave me healing and strength.",
      fr: "Les programmes de counseling et de mieux-être de la BICF m'ont aidée à gérer le stress de l'immigration. Leur approche sensible à la culture m'a apporté guérison et force.",
    },
    name: "Anim",
    role: { en: "Community Member", fr: "Membre de la communauté" },
  },
  {
    quote: {
      en: "As a parent, I appreciate BICF's youth and family programs. They help my children grow confidently while staying proud of their heritage.",
      fr: "En tant que parent, j'apprécie les programmes jeunesse et famille de la BICF. Ils aident mes enfants à grandir avec confiance tout en restant fiers de leur héritage.",
    },
    name: "Chinyera",
    role: { en: "Parent", fr: "Parent" },
  },
  {
    quote: {
      en: "BICF's financial literacy workshops taught me how to manage my money wisely. I now feel confident budgeting, saving, and planning for the future.",
      fr: "Les ateliers de littératie financière de la BICF m'ont appris à gérer mon argent judicieusement. Je me sens maintenant à l'aise pour budgéter, épargner et planifier l'avenir.",
    },
    name: "James",
    role: { en: "Workshop Participant", fr: "Participant aux ateliers" },
  },
  {
    quote: {
      en: "When I arrived, I felt lost. The team walked me through the legal process step by step. I would not be where I am today without their guidance.",
      fr: "À mon arrivée, je me sentais perdue. L'équipe m'a guidée pas à pas dans le processus juridique. Je ne serais pas là où je suis aujourd'hui sans leur accompagnement.",
    },
    name: "Adwoa",
    role: { en: "New Resident", fr: "Nouvelle résidente" },
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

const principles: { eyebrow: Bi; body: Bi }[] = [
  {
    eyebrow: { en: "Our Mission", fr: "Notre mission" },
    body: {
      en: "To empower, uplift, and provide comprehensive support to Black immigrants as they navigate the complexities of settling in a new country.",
      fr: "Outiller, élever et offrir un soutien complet aux immigrants noirs alors qu'ils traversent les complexités de l'installation dans un nouveau pays.",
    },
  },
  {
    eyebrow: { en: "Our Vision", fr: "Notre vision" },
    body: {
      en: "A world where Black immigrants thrive and are embraced as valued members of society, free from discrimination and systemic barriers.",
      fr: "Un monde où les immigrants noirs s'épanouissent et sont accueillis comme des membres précieux de la société, à l'abri de la discrimination et des barrières systémiques.",
    },
  },
];

const services: { label: Bi; tag: Bi; body: Bi; image: string }[] = [
  {
    label: { en: "Legal Assistance", fr: "Aide juridique" },
    tag: { en: "Pathways forward", fr: "Des voies vers l'avenir" },
    body: {
      en: "Providing legal guidance and support for immigration processes and rights protection.",
      fr: "Accompagnement et soutien juridiques pour les démarches d'immigration et la protection des droits.",
    },
    image: "/h5.webp",
  },
  {
    label: { en: "Education Support", fr: "Soutien à l'éducation" },
    tag: { en: "Learning that lifts", fr: "Un savoir qui élève" },
    body: {
      en: "Scholarships, tutoring, and resources to help achieve academic and career goals.",
      fr: "Bourses, tutorat et ressources pour atteindre ses objectifs scolaires et professionnels.",
    },
    image: "/h6.webp",
  },
  {
    label: { en: "Employment Support", fr: "Soutien à l'emploi" },
    tag: { en: "Work and wealth", fr: "Travail et prospérité" },
    body: {
      en: "Job placement assistance, resume building, and career development resources.",
      fr: "Aide au placement, rédaction de CV et ressources de développement de carrière.",
    },
    image: "/h7.webp",
  },
  {
    label: { en: "Mental Health & Wellness", fr: "Santé mentale et mieux-être" },
    tag: { en: "Care that sees you", fr: "Des soins qui vous voient" },
    body: {
      en: "Culturally sensitive counseling and wellness programs for mental health support.",
      fr: "Counseling sensible à la culture et programmes de mieux-être pour le soutien en santé mentale.",
    },
    image: "/h8.webp",
  },
  {
    label: {
      en: "Community & Advocacy",
      fr: "Communauté et défense des droits",
    },
    tag: { en: "Voices amplified", fr: "Des voix amplifiées" },
    body: {
      en: "Empowering Black immigrants through community, leadership, and advocacy.",
      fr: "Outiller les immigrants noirs par la communauté, le leadership et la défense des droits.",
    },
    image: "/h9.webp",
  },
];

const homeFaqs: { q: Bi; a: Bi }[] = [
  {
    q: {
      en: "How can BICF support me if I'm a newcomer?",
      fr: "Comment la BICF peut-elle m'aider si je suis nouvel arrivant?",
    },
    a: {
      en: "From the moment you arrive, BICF offers guidance on housing, legal documentation, healthcare navigation, and community connections. We help you understand your rights, access essential services, and build a stable foundation in Canada, completely free of charge.",
      fr: "Dès votre arrivée, la BICF offre un accompagnement pour le logement, les documents juridiques, l'orientation dans le système de santé et les liens communautaires. Nous vous aidons à comprendre vos droits, à accéder aux services essentiels et à bâtir une base stable au Canada, entièrement sans frais.",
    },
  },
  {
    q: {
      en: "What types of legal assistance do you offer?",
      fr: "Quels types d'aide juridique offrez-vous?",
    },
    a: {
      en: "Our legal team provides support with immigration applications, work permits, refugee claims, family sponsorship, and status renewal. We also offer referrals for complex cases and know your rights workshops. Every consultation is confidential and client centered.",
      fr: "Notre équipe juridique offre un soutien pour les demandes d'immigration, les permis de travail, les demandes d'asile, le parrainage familial et le renouvellement de statut. Nous proposons aussi des références pour les cas complexes et des ateliers sur vos droits. Chaque consultation est confidentielle et centrée sur le client.",
    },
  },
  {
    q: {
      en: "Are your programs really free?",
      fr: "Vos programmes sont-ils vraiment gratuits?",
    },
    a: {
      en: "Yes. Every BICF program is offered at no cost. That includes legal advice, mental health support, employment coaching, education workshops, and community events. We are funded by grants, institutional partners, and individual donors who believe in barrier free support.",
      fr: "Oui. Chaque programme de la BICF est offert sans frais. Cela comprend les conseils juridiques, le soutien en santé mentale, l'accompagnement à l'emploi, les ateliers éducatifs et les événements communautaires. Nous sommes financés par des subventions, des partenaires institutionnels et des donateurs individuels qui croient en un soutien sans barrières.",
    },
  },
  {
    q: {
      en: "How do I volunteer with BICF?",
      fr: "Comment puis-je faire du bénévolat avec la BICF?",
    },
    a: {
      en: "We welcome volunteers in legal intake, communications, event coordination, youth mentorship, and administrative roles. Fill out the volunteer form on our Get Involved page, and our team will schedule an orientation call to match your skills with current needs.",
      fr: "Nous accueillons des bénévoles pour l'accueil juridique, les communications, la coordination d'événements, le mentorat jeunesse et les tâches administratives. Remplissez le formulaire de bénévolat sur notre page Participer, et notre équipe planifiera un appel d'orientation pour jumeler vos compétences aux besoins actuels.",
    },
  },
  {
    q: {
      en: "Can I donate to support your work?",
      fr: "Puis-je faire un don pour soutenir votre travail?",
    },
    a: {
      en: "Absolutely. Donations help us expand our legal services, run mental wellness programs, and keep all supports free. BICF is a registered Canadian nonprofit, and contributions are tax deductible. You can donate online via our secure portal or by bank transfer.",
      fr: "Absolument. Les dons nous aident à élargir nos services juridiques, à offrir des programmes de mieux-être mental et à garder tous les soutiens gratuits. La BICF est un organisme sans but lucratif canadien enregistré, et les contributions sont déductibles d'impôt. Vous pouvez faire un don en ligne par notre portail sécurisé ou par virement bancaire.",
    },
  },
  {
    q: {
      en: "How quickly can I access mental health support?",
      fr: "À quelle vitesse puis-je accéder à un soutien en santé mentale?",
    },
    a: {
      en: "We aim to schedule an initial wellness consultation within 3 to 5 business days. From there, you will be connected with a culturally competent counsellor for ongoing sessions, at no cost. Crisis support is available within 24 hours.",
      fr: "Nous visons à planifier une première consultation de mieux-être dans un délai de 3 à 5 jours ouvrables. Vous serez ensuite jumelé à un conseiller compétent sur le plan culturel pour des séances continues, sans frais. Un soutien en cas de crise est disponible dans les 24 heures.",
    },
  },
  {
    q: {
      en: "Do you offer remote services?",
      fr: "Offrez-vous des services à distance?",
    },
    a: {
      en: "Yes. While our Ajax office is open for in-person support, we provide phone, video, and email consultations for clients across Ontario and beyond. We also host virtual workshops and support groups regularly.",
      fr: "Oui. Bien que notre bureau d'Ajax soit ouvert pour le soutien en personne, nous offrons des consultations par téléphone, par vidéo et par courriel pour les clients de partout en Ontario et au-delà. Nous organisons aussi régulièrement des ateliers et des groupes de soutien virtuels.",
    },
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
  const { t, lang } = useLanguage();
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
    document.title =
      lang === "fr"
        ? "Accueil | Black Immigrants Community Foundation"
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

    // Respect reduced motion: render the final state and skip the scroll work.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      img.style.opacity = "1";
      img.style.transform = "none";
      img.dataset.animating = "false";
      t1.style.opacity = "1";
      t1.style.setProperty("--y", "0px");
      t2.style.opacity = "1";
      t2.style.setProperty("--y", "0px");
      return;
    }

    // iOS shows/hides its toolbar during scroll, which changes
    // window.innerHeight every frame. Reading it live made the pinned image
    // vibrate, so we cache the viewport and only refresh on a real width
    // change (orientation), ignoring the toolbar's height-only churn.
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    let vw = window.innerWidth;
    let vh = window.innerHeight;

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
        const total = section.offsetHeight - vh;
        const scrolled = clamp(-rect.top, 0, total);
        const p = total > 0 ? scrolled / total : 0;
        applyFrame(p, rect);
        scheduled = false;
      });
    };

    // Refresh viewport + measurements only on a real resize. On touch devices
    // a height-only change is the iOS toolbar — ignore it to avoid jitter.
    const syncViewport = () => {
      if (coarse && window.innerWidth === vw) return;
      vw = window.innerWidth;
      vh = window.innerHeight;
      remeasure();
    };

    const onResize = () => {
      syncViewport();
      onScroll();
    };

    measureNatural();
    onScroll();

    const ro = new ResizeObserver(() => {
      syncViewport();
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

    const onLoad = () => {
      remeasure();
      onScroll();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    window.addEventListener("load", onLoad);

    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("load", onLoad);
      if (innerImg) innerImg.removeEventListener("load", onImgLoad);
    };
  }, []);

  return (
    <main className="home">
      <section className="home__hero" aria-labelledby="home-hero-title">
        <div className="home__hero-media" aria-hidden="true">
          {heroSlides.map((_, i) => (
            <div
              key={i}
              className={
                `home__hero-pattern home__hero-pattern--${i + 1}` +
                (i === activeSlide ? " home__hero-pattern--active" : "")
              }
            />
          ))}
          <div className="home__hero-scrim" />
          <div className="home__hero-glow" />
        </div>

        <div className="home__hero-panel">
          <div className="home__hero-panel-inner">
            <div className="home__hero-stage">
              <div
                key={activeSlide}
                id={`hero-panel-${activeSlide}`}
                role="tabpanel"
                aria-labelledby={`hero-tab-${activeSlide}`}
                className="home__hero-slide"
              >
                <span className="home__hero-label">
                  {t(heroSlides[activeSlide].label)}
                </span>
                <h1 id="home-hero-title" className="home__hero-title">
                  {t(heroSlides[activeSlide].title).map((line, i) => (
                    <span key={i} className="home__hero-line">
                      {line}
                    </span>
                  ))}
                </h1>
                <p className="home__hero-body">
                  {t(heroSlides[activeSlide].body)}
                </p>
              </div>
            </div>

            <div className="home__hero-controls">
              <button
                type="button"
                className="home__hero-nav"
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
                className="home__hero-bars"
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
                    className={`home__hero-bar ${i === activeSlide ? "home__hero-bar--active" : ""}`}
                    onClick={() => setActiveSlide(i)}
                  />
                ))}
              </div>

              <button
                type="button"
                className="home__hero-nav"
                onClick={() => goTo(activeSlide + 1)}
                aria-label={t({
                  en: "Next slide",
                  fr: "Diapositive suivante",
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
          <span className="home__intro-line">
            {t({ en: "One community.", fr: "Une communauté." })}
          </span>
          <span className="home__intro-line">
            <span>{t({ en: "Endless", fr: "Espoir" })}</span>
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
            <span>{t({ en: "hope.", fr: "infini." })}</span>
          </span>
        </h2>

        <p className="home__intro-body">
          {t({
            en: "The Black Immigrants Community Foundation walks alongside families building new lives through advocacy, opportunity, and unwavering support.",
            fr: "La Black Immigrants Community Foundation accompagne les familles qui bâtissent une nouvelle vie par la défense des droits, les possibilités et un soutien indéfectible.",
          })}
        </p>
      </section>

      <section
        ref={storyRef}
        className="home__story"
        aria-label={t({ en: "Brand story", fr: "Histoire de la marque" })}
      >
        <div className="home__story-stage">
          <div className="home__story-stage-inner">
            <div
              ref={t2Ref}
              className="home__story-text home__story-text--left"
            >
              <span className="home__story-label">
                {t({ en: "Built together", fr: "Bâti ensemble" })}
              </span>
              {t({
                en: (
                  <>
                    Resources
                    <br />
                    that build
                    <br />a steady home.
                  </>
                ),
                fr: (
                  <>
                    Des ressources
                    <br />
                    qui bâtissent
                    <br />un foyer stable.
                  </>
                ),
              })}
            </div>
            <div
              ref={t1Ref}
              className="home__story-text home__story-text--right"
            >
              <span className="home__story-label">
                {t({ en: "For every arrival", fr: "Pour chaque arrivée" })}
              </span>
              {t({
                en: (
                  <>
                    Advocacy
                    <br />
                    that meets
                    <br />
                    the moment.
                  </>
                ),
                fr: (
                  <>
                    Une défense
                    <br />
                    à la hauteur
                    <br />
                    du moment.
                  </>
                ),
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="home__about" id="about" aria-labelledby="about-title">
        <div className="home__about-grid">
          <div className="home__about-content">
            <div className="home__about-eyebrow">
              {t({ en: "About BICF", fr: "À propos de la BICF" })}
            </div>
            <p className="home__about-body">
              {t({
                en: "The Black Immigrants Community Foundation (BICF) is a nonprofit organization dedicated to supporting and empowering Black immigrants through advocacy, resources, and community building initiatives.",
                fr: "La Black Immigrants Community Foundation (BICF) est un organisme sans but lucratif voué au soutien et à l'autonomisation des immigrants noirs par la défense des droits, les ressources et des initiatives de renforcement communautaire.",
              })}
            </p>
            <Link className="home__about-btn" to="/about">
              {t({ en: "Learn More", fr: "En savoir plus" })}
            </Link>
          </div>

          <div className="home__about-media">
            <div
              ref={imgRef}
              className="home__about-image"
              data-animating="false"
            >
              <img
                src="/h4.webp"
                alt={t({
                  en: "Black immigrant family",
                  fr: "Famille d'immigrants noirs",
                })}
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
              {t({ en: "Foundations", fr: "Fondements" })}
            </motion.span>
            <motion.h2
              id="home-principles-title"
              className="home__principles-title"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-12%" }}
              transition={{ duration: 0.85, ease: HERO_EASE, delay: 0.08 }}
            >
              {t({
                en: "What we stand for, and where we're going.",
                fr: "Ce que nous défendons, et là où nous allons.",
              })}
            </motion.h2>
          </header>

          <div className="home__principles-grid">
            {principles.map((p, i) => (
              <motion.article
                key={p.eyebrow.en}
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
                <span className="home__principle-eyebrow">
                  {t(p.eyebrow)}
                </span>
                <p className="home__principle-body">{t(p.body)}</p>
              </motion.article>
            ))}
          </div>

          <div className="home__principles-cta-wrap">
            <Link className="home__principles-cta" to="/about">
              {t({ en: "Learn More", fr: "En savoir plus" })}
            </Link>
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
              {t({ en: "Our Services", fr: "Nos services" })}
            </motion.span>
            <motion.h2
              id="home-services-title"
              className="home__services-title"
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-12%" }}
              transition={{ duration: 0.85, ease: HERO_EASE, delay: 0.08 }}
            >
              {t({
                en: "Programs built around the realities of Black immigrant life.",
                fr: "Des programmes conçus autour des réalités de la vie des immigrants noirs.",
              })}
            </motion.h2>
          </header>

          <div className="home__services-stack">
            {services.map((s, i) => (
              <article
                key={s.label.en}
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
                    alt={`${t(s.label)}, ${t(s.tag)}`}
                    width={1200}
                    height={900}
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="home__service-badge">
                    <span className="home__service-badge-num">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="home__service-badge-text">
                      {t(s.tag)}
                    </span>
                  </span>
                </div>

                <div className="home__service-content">
                  <span className="home__service-eyebrow">
                    <span className="home__service-dot" aria-hidden="true" />
                    {t({ en: "BICF Services", fr: "Services de la BICF" })}
                  </span>
                  <h3 className="home__service-label">{t(s.label)}</h3>
                  <p className="home__service-body">{t(s.body)}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="home__services-cta-wrap">
            <Link className="home__services-cta" to="/services">
              {t({ en: "Learn More", fr: "En savoir plus" })}
            </Link>
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
              {t({ en: "Community Voices", fr: "Voix de la communauté" })}
            </motion.span>
            <motion.h2
              id="home-voices-title"
              className="home__voices-title"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-12%" }}
              transition={{ duration: 0.85, ease: HERO_EASE, delay: 0.08 }}
            >
              {t({
                en: "Stories from those we walk beside.",
                fr: "Des récits de ceux et celles que nous accompagnons.",
              })}
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
                  {t(testimonials[testimonialIndex].quote)}
                </blockquote>
                <figcaption className="home__voice-meta">
                  <span className="home__voice-name">
                    {testimonials[testimonialIndex].name}
                  </span>
                  <span className="home__voice-role">
                    {t(testimonials[testimonialIndex].role)}
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
              aria-label={t({
                en: "Previous testimonial",
                fr: "Témoignage précédent",
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
              className="home__voices-dots"
              role="tablist"
              aria-label={t({ en: "Testimonials", fr: "Témoignages" })}
            >
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={i === testimonialIndex}
                  aria-label={t({
                    en: `Go to testimonial ${i + 1}`,
                    fr: `Aller au témoignage ${i + 1}`,
                  })}
                  className={`home__voices-dot ${i === testimonialIndex ? "home__voices-dot--active" : ""}`}
                  onClick={() => setTestimonialIndex(i)}
                />
              ))}
            </div>

            <button
              type="button"
              className="home__voices-nav"
              onClick={() => goToTestimonial(testimonialIndex + 1)}
              aria-label={t({
                en: "Next testimonial",
                fr: "Témoignage suivant",
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
              {t({ en: "Supported By", fr: "Soutenu par" })}
            </motion.span>
            <motion.h2
              id="home-sponsors-title"
              className="home__sponsors-title"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-12%" }}
              transition={{ duration: 0.85, ease: HERO_EASE, delay: 0.08 }}
            >
              {t({
                en: "Proudly funded by leading Canadian institutions and community partners.",
                fr: "Fièrement financé par d'éminentes institutions canadiennes et des partenaires communautaires.",
              })}
            </motion.h2>
          </header>

          <motion.p
            className="home__sponsors-intro"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-12%" }}
            transition={{ duration: 0.7, ease: HERO_EASE, delay: 0.16 }}
          >
            {t({
              en: "BICF's programs are sustained by a network of public funders and community foundations who share our commitment to long term equity for Black immigrants in Canada. Their continued investment makes our coordinated, no cost services possible.",
              fr: "Les programmes de la BICF sont soutenus par un réseau de bailleurs de fonds publics et de fondations communautaires qui partagent notre engagement envers une équité durable pour les immigrants noirs au Canada. Leur investissement continu rend possibles nos services coordonnés et gratuits.",
            })}
          </motion.p>

          <ul className="home__sponsors-grid">
            {sponsors.map((s, i) => (
              <motion.li
                key={s.name.en}
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
                  aria-label={t(s.name)}
                >
                  <img
                    src={s.src}
                    alt={t(s.name)}
                    loading="lazy"
                    decoding="async"
                  />
                </a>
                <span className="home__sponsor-name">{t(s.short)}</span>
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
            {t({ en: "Get Involved", fr: "Participer" })}
          </motion.span>
          <motion.h2
            id="home-join-title"
            className="home__join-title"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-12%" }}
            transition={{ duration: 0.85, ease: HERO_EASE, delay: 0.08 }}
          >
            {t({ en: "Join the movement.", fr: "Joignez-vous au mouvement." })}
          </motion.h2>
          <motion.p
            className="home__join-body"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-12%" }}
            transition={{ duration: 0.7, ease: HERO_EASE, delay: 0.16 }}
          >
            {t({
              en: "Together, we can create lasting change for Black immigrants in our communities. Volunteer your time, partner with us, or simply share our story.",
              fr: "Ensemble, nous pouvons créer un changement durable pour les immigrants noirs de nos communautés. Donnez de votre temps, devenez partenaire ou partagez simplement notre histoire.",
            })}
          </motion.p>
          <motion.div
            className="home__join-actions"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-12%" }}
            transition={{ duration: 0.7, ease: HERO_EASE, delay: 0.24 }}
          >
            <Link
              className="home__join-cta home__join-cta--primary"
              to="/volunteer"
            >
              {t({ en: "Volunteer", fr: "Bénévolat" })}
            </Link>
            <Link
              className="home__join-cta home__join-cta--ghost"
              to="/contact"
            >
              {t({ en: "Get In Touch", fr: "Nous joindre" })}
            </Link>
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
                    <span className="home__faq-q">{t(item.q)}</span>
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
                        <p className="home__faq-a">{t(item.a)}</p>
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
