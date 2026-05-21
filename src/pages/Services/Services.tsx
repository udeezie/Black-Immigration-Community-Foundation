import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage, type Lang } from "../../context/LanguageContext";
import "./Services.scss";

type Bi = Record<Lang, string>;

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

const heroSlides: { label: Bi; title: Record<Lang, string[]>; body: Bi }[] = [
  {
    label: { en: "Our Services", fr: "Nos services" },
    title: {
      en: ["Comprehensive support", "for Black immigrants."],
      fr: ["Un soutien complet", "pour les immigrants noirs."],
    },
    body: {
      en: "Programs that help families overcome barriers, build stability, and thrive. Culturally relevant, no cost, and open to anyone navigating a barrier.",
      fr: "Des programmes qui aident les familles à surmonter les obstacles, à bâtir leur stabilité et à s'épanouir. Adaptés à la culture, gratuits et ouverts à toute personne confrontée à un obstacle.",
    },
  },
  {
    label: { en: "What We Offer", fr: "Ce que nous offrons" },
    title: {
      en: ["Every door,", "covered."],
      fr: ["Chaque porte,", "ouverte."],
    },
    body: {
      en: "Legal, education, employment, wellness, family, community. Coordinated under one roof so support never falls between the cracks.",
      fr: "Droit, éducation, emploi, mieux-être, famille, communauté. Coordonnés sous un même toit pour que personne ne passe entre les mailles du filet.",
    },
  },
  {
    label: { en: "Our Commitment", fr: "Notre engagement" },
    title: {
      en: ["No cost.", "No barriers."],
      fr: ["Sans frais.", "Sans obstacles."],
    },
    body: {
      en: "Every program is delivered at no cost and built around the cultural realities of the people we serve.",
      fr: "Chaque programme est offert sans frais et conçu autour des réalités culturelles des personnes que nous servons.",
    },
  },
];

type Solution = {
  num: string;
  group: "first" | "work" | "community";
  title: Bi;
  body: Bi;
  detail: Bi;
  tags: Bi[];
};

const solutions: Solution[] = [
  {
    num: "01",
    group: "first",
    title: { en: "Immigration Support", fr: "Soutien à l'immigration" },
    body: {
      en: "Our legal and immigration services include referrals, workshops, and assistance with residency, asylum, and family reunification, ensuring immigrants can navigate complex processes with ease.",
      fr: "Nos services juridiques et d'immigration comprennent des références, des ateliers et de l'aide pour la résidence, l'asile et la réunification familiale, afin que les immigrants puissent traverser des démarches complexes avec aisance.",
    },
    detail: {
      en: "Our legal assistance and immigration support services help individuals navigate complex immigration processes with confidence. We offer referrals to trusted legal professionals, workshops on rights and responsibilities, assistance with asylum, naturalization, permanent residence, temporary residence, and family reunification processes.",
      fr: "Nos services d'aide juridique et de soutien à l'immigration aident les personnes à traverser des démarches d'immigration complexes en toute confiance. Nous offrons des références vers des professionnels du droit de confiance, des ateliers sur les droits et responsabilités, ainsi que de l'aide pour l'asile, la naturalisation, la résidence permanente, la résidence temporaire et la réunification familiale.",
    },
    tags: [
      { en: "Asylum", fr: "Asile" },
      { en: "Residency", fr: "Résidence" },
      { en: "Reunification", fr: "Réunification" },
    ],
  },
  {
    num: "02",
    group: "first",
    title: {
      en: "Crisis and Emergency Support",
      fr: "Soutien en cas de crise et d'urgence",
    },
    body: {
      en: "BICF offers immediate assistance to those facing emergencies such as domestic violence, homelessness, or deportation threats, providing compassionate, culturally appropriate intervention.",
      fr: "La BICF offre une aide immédiate aux personnes confrontées à des urgences telles que la violence familiale, l'itinérance ou des menaces d'expulsion, en proposant une intervention bienveillante et adaptée à la culture.",
    },
    detail: {
      en: "In times of urgent need, BICF stands ready to assist. We provide immediate crisis intervention for individuals facing domestic violence, homelessness, deportation threats, medical emergencies, or other urgent situations. Our trained staff and partners respond with care, discretion, and culturally appropriate support.",
      fr: "En cas de besoin urgent, la BICF est prête à intervenir. Nous offrons une intervention immédiate en situation de crise pour les personnes confrontées à la violence familiale, à l'itinérance, à des menaces d'expulsion, à des urgences médicales ou à d'autres situations pressantes. Notre personnel et nos partenaires formés répondent avec soin, discrétion et un soutien adapté à la culture.",
    },
    tags: [
      { en: "Crisis", fr: "Crise" },
      { en: "Safety", fr: "Sécurité" },
      { en: "Emergency", fr: "Urgence" },
    ],
  },
  {
    num: "03",
    group: "first",
    title: {
      en: "Social and Community Services",
      fr: "Services sociaux et communautaires",
    },
    body: {
      en: "We assist individuals in accessing housing, healthcare, transportation, and public benefits, ensuring stability and wellbeing.",
      fr: "Nous aidons les personnes à accéder au logement, aux soins de santé, au transport et aux prestations publiques, pour assurer leur stabilité et leur bien-être.",
    },
    detail: {
      en: "Navigating social systems can be overwhelming, especially for newcomers. BICF offers assistance with housing applications, access to healthcare, transportation, public benefits, and other essential services. Our case managers provide individualized support to help clients understand and access the services available to them, promoting stability and wellbeing.",
      fr: "S'orienter dans les systèmes sociaux peut être accablant, surtout pour les nouveaux arrivants. La BICF offre de l'aide pour les demandes de logement, l'accès aux soins de santé, le transport, les prestations publiques et d'autres services essentiels. Nos gestionnaires de cas offrent un soutien personnalisé pour aider les clients à comprendre et à accéder aux services qui leur sont offerts, favorisant la stabilité et le bien-être.",
    },
    tags: [
      { en: "Housing", fr: "Logement" },
      { en: "Healthcare", fr: "Santé" },
      { en: "Benefits", fr: "Prestations" },
    ],
  },
  {
    num: "04",
    group: "first",
    title: { en: "Cultural Integration", fr: "Intégration culturelle" },
    body: {
      en: "We help newcomers adapt to life in Canada while celebrating their heritage through orientation programs, cultural events, and language support, ensuring inclusion without loss of identity.",
      fr: "Nous aidons les nouveaux arrivants à s'adapter à la vie au Canada tout en célébrant leur héritage, grâce à des programmes d'orientation, des événements culturels et un soutien linguistique, pour une inclusion sans perte d'identité.",
    },
    detail: {
      en: "We help newcomers feel at home while honoring their heritage. Our cultural orientation programs introduce Black immigrants to life in Canada, covering topics like legal rights, public services, social norms, and community resources. We also celebrate and preserve cultural traditions through events, language support, and cultural exchange.",
      fr: "Nous aidons les nouveaux arrivants à se sentir chez eux tout en honorant leur héritage. Nos programmes d'orientation culturelle font découvrir aux immigrants noirs la vie au Canada, abordant des sujets comme les droits, les services publics, les normes sociales et les ressources communautaires. Nous célébrons et préservons aussi les traditions culturelles par des événements, un soutien linguistique et des échanges culturels.",
    },
    tags: [
      { en: "Orientation", fr: "Orientation" },
      { en: "Language", fr: "Langue" },
      { en: "Heritage", fr: "Héritage" },
    ],
  },
  {
    num: "05",
    group: "work",
    title: { en: "Educational Support", fr: "Soutien éducatif" },
    body: {
      en: "We promote education as a path to empowerment through tutoring, mentorship, ESL programs, and career readiness workshops.",
      fr: "Nous faisons de l'éducation une voie d'autonomisation grâce au tutorat, au mentorat, aux programmes d'anglais langue seconde et aux ateliers de préparation à la carrière.",
    },
    detail: {
      en: "We believe education is a critical pathway to empowerment. BICF provides academic resources, tutoring, mentorship programs, and college/career readiness workshops for individuals of all ages. We support adult learners through ESL (English as a Second Language) programs, GED preparation, and continuing education guidance, helping immigrants overcome barriers to educational access and achievement.",
      fr: "Nous croyons que l'éducation est une voie essentielle vers l'autonomie. La BICF offre des ressources scolaires, du tutorat, des programmes de mentorat et des ateliers de préparation aux études et à la carrière pour les personnes de tous âges. Nous soutenons les apprenants adultes par des programmes d'anglais langue seconde, la préparation au diplôme d'équivalence et l'orientation en formation continue, aidant les immigrants à surmonter les obstacles à l'accès et à la réussite scolaires.",
    },
    tags: [
      { en: "Tutoring", fr: "Tutorat" },
      { en: "ESL", fr: "ALS" },
      { en: "Career Prep", fr: "Préparation carrière" },
      { en: "Mentorship", fr: "Mentorat" },
    ],
  },
  {
    num: "06",
    group: "work",
    title: {
      en: "Employment and Workforce Development",
      fr: "Emploi et développement de la main-d'œuvre",
    },
    body: {
      en: "We equip individuals with job readiness skills, vocational training, and career connections, helping them access stable employment and dignified livelihoods.",
      fr: "Nous outillons les personnes avec des compétences d'employabilité, une formation professionnelle et des contacts de carrière, les aidant à accéder à un emploi stable et à des moyens de subsistance dignes.",
    },
    detail: {
      en: "We support economic mobility through job readiness programs, resume assistance, vocational training, and workforce development. BICF connects clients with job opportunities, entrepreneurship training, and small business support, helping to create pathways to stable, dignified employment.",
      fr: "Nous soutenons la mobilité économique par des programmes d'employabilité, de l'aide à la rédaction de CV, de la formation professionnelle et du développement de la main-d'œuvre. La BICF met les clients en relation avec des occasions d'emploi, de la formation en entrepreneuriat et du soutien aux petites entreprises, contribuant à créer des voies vers un emploi stable et digne.",
    },
    tags: [
      { en: "Resume", fr: "CV" },
      { en: "Training", fr: "Formation" },
      { en: "Entrepreneurship", fr: "Entrepreneuriat" },
    ],
  },
  {
    num: "07",
    group: "work",
    title: {
      en: "Financial and Economic Empowerment",
      fr: "Autonomisation financière et économique",
    },
    body: {
      en: "Our financial literacy workshops, emergency aid, and employment training help individuals achieve economic stability and independence.",
      fr: "Nos ateliers de littératie financière, notre aide d'urgence et notre formation à l'emploi aident les personnes à atteindre la stabilité et l'indépendance économiques.",
    },
    detail: {
      en: "Economic empowerment is key to long term stability. BICF offers financial literacy workshops, budgeting assistance, emergency financial aid, and support in navigating public and private financial resources. We empower individuals to make informed financial decisions and gain economic independence.",
      fr: "L'autonomisation économique est essentielle à une stabilité durable. La BICF offre des ateliers de littératie financière, de l'aide à la budgétisation, une aide financière d'urgence et un accompagnement pour s'orienter parmi les ressources financières publiques et privées. Nous outillons les personnes à prendre des décisions financières éclairées et à gagner leur indépendance économique.",
    },
    tags: [
      { en: "Literacy", fr: "Littératie" },
      { en: "Aid", fr: "Aide" },
      { en: "Budgeting", fr: "Budgétisation" },
    ],
  },
  {
    num: "08",
    group: "work",
    title: {
      en: "Technology and Digital Literacy",
      fr: "Technologie et littératie numérique",
    },
    body: {
      en: "We bridge the digital divide by offering computer training, internet safety workshops, and digital access support, empowering immigrants to confidently use technology for education and employment.",
      fr: "Nous comblons le fossé numérique en offrant de la formation en informatique, des ateliers sur la sécurité en ligne et un soutien à l'accès numérique, permettant aux immigrants d'utiliser la technologie en toute confiance pour leurs études et leur emploi.",
    },
    detail: {
      en: "Digital access is a necessity. BICF provides training in digital literacy, internet safety, and technology use for all ages. We offer workshops on using essential software, navigating online services, and applying for jobs or benefits online. Access to devices and internet support may be available for qualifying individuals.",
      fr: "L'accès numérique est une nécessité. La BICF offre de la formation en littératie numérique, en sécurité sur Internet et en utilisation de la technologie pour tous les âges. Nous proposons des ateliers sur l'utilisation des logiciels essentiels, la navigation dans les services en ligne et les demandes d'emploi ou de prestations en ligne. L'accès à des appareils et un soutien à la connexion peuvent être offerts aux personnes admissibles.",
    },
    tags: [
      { en: "Digital", fr: "Numérique" },
      { en: "Safety", fr: "Sécurité" },
      { en: "Access", fr: "Accès" },
    ],
  },
  {
    num: "09",
    group: "community",
    title: {
      en: "Mental Health and Wellness",
      fr: "Santé mentale et mieux-être",
    },
    body: {
      en: "BICF provides culturally sensitive counseling, wellness workshops, and trauma informed care, helping reduce stigma and promote healing.",
      fr: "La BICF offre du counseling sensible à la culture, des ateliers de mieux-être et des soins tenant compte des traumatismes, contribuant à réduire la stigmatisation et à favoriser la guérison.",
    },
    detail: {
      en: "Mental health matters. BICF provides culturally competent mental health resources, including counseling referrals, wellness workshops, trauma informed care, and peer support groups. We work to reduce stigma and ensure Black immigrants have access to emotional support that reflects their cultural backgrounds and experiences.",
      fr: "La santé mentale compte. La BICF offre des ressources en santé mentale adaptées à la culture, notamment des références en counseling, des ateliers de mieux-être, des soins tenant compte des traumatismes et des groupes de soutien par les pairs. Nous travaillons à réduire la stigmatisation et à garantir aux immigrants noirs un soutien émotionnel qui reflète leurs origines et leurs expériences culturelles.",
    },
    tags: [
      { en: "Counseling", fr: "Counseling" },
      { en: "Trauma Care", fr: "Soins du traumatisme" },
      { en: "Peer Support", fr: "Soutien par les pairs" },
    ],
  },
  {
    num: "10",
    group: "community",
    title: {
      en: "Youth and Family Programs",
      fr: "Programmes jeunesse et famille",
    },
    body: {
      en: "We strengthen families through after school activities, mentorship, parenting classes, and youth leadership programs empowering the next generation to grow confidently and purposefully.",
      fr: "Nous renforçons les familles par des activités parascolaires, du mentorat, des cours pour parents et des programmes de leadership jeunesse, permettant à la prochaine génération de grandir avec confiance et détermination.",
    },
    detail: {
      en: "Supporting the next generation is a cornerstone of our work. We offer after school programs, mentorship, family counseling, parenting classes, and youth leadership development. Our services help young people navigate identity, education, and social challenges, while strengthening family relationships and intergenerational understanding.",
      fr: "Soutenir la prochaine génération est une pierre angulaire de notre travail. Nous offrons des programmes parascolaires, du mentorat, du counseling familial, des cours pour parents et du développement du leadership jeunesse. Nos services aident les jeunes à composer avec l'identité, l'éducation et les défis sociaux, tout en renforçant les liens familiaux et la compréhension entre les générations.",
    },
    tags: [
      { en: "Youth", fr: "Jeunesse" },
      { en: "Parenting", fr: "Parentalité" },
      { en: "Leadership", fr: "Leadership" },
    ],
  },
  {
    num: "11",
    group: "community",
    title: {
      en: "Advocacy and Awareness",
      fr: "Défense des droits et sensibilisation",
    },
    body: {
      en: "BICF amplifies the voices of Black immigrants through grassroots organizing, public education, and policy reform.",
      fr: "La BICF amplifie la voix des immigrants noirs par la mobilisation citoyenne, l'éducation du public et la réforme des politiques.",
    },
    detail: {
      en: "BICF is dedicated to amplifying the voices of Black immigrants through grassroots organizing, policy advocacy, and public education. We raise awareness of the unique challenges faced by Black immigrant communities, engage in civic action, and work with policymakers to drive systemic change. Our advocacy campaigns focus on immigration reform, racial justice, and equitable access to services.",
      fr: "La BICF se consacre à amplifier la voix des immigrants noirs par la mobilisation citoyenne, la défense des politiques et l'éducation du public. Nous sensibilisons aux défis uniques que vivent les communautés d'immigrants noirs, participons à l'action civique et collaborons avec les décideurs pour générer un changement systémique. Nos campagnes de défense portent sur la réforme de l'immigration, la justice raciale et l'accès équitable aux services.",
    },
    tags: [
      { en: "Policy", fr: "Politiques" },
      { en: "Organizing", fr: "Mobilisation" },
      { en: "Civic Action", fr: "Action civique" },
    ],
  },
  {
    num: "12",
    group: "community",
    title: {
      en: "Environmental and Sustainability Initiatives",
      fr: "Initiatives environnementales et de durabilité",
    },
    body: {
      en: "We engage Black immigrant communities in environmental education, sustainability programs, and climate advocacy, promoting clean, healthy environments for all.",
      fr: "Nous mobilisons les communautés d'immigrants noirs autour de l'éducation environnementale, des programmes de durabilité et de la défense climatique, en faisant la promotion d'environnements propres et sains pour tous.",
    },
    detail: {
      en: "We recognize the intersection between environmental justice and racial equity. BICF engages Black immigrant communities in local sustainability efforts, environmental education, green job training, and climate advocacy. We promote clean, healthy environments for all and empower our community to take part in shaping a sustainable future.",
      fr: "Nous reconnaissons le lien entre la justice environnementale et l'équité raciale. La BICF mobilise les communautés d'immigrants noirs autour des efforts locaux de durabilité, de l'éducation environnementale, de la formation aux emplois verts et de la défense climatique. Nous faisons la promotion d'environnements propres et sains pour tous et outillons notre communauté à participer à la construction d'un avenir durable.",
    },
    tags: [
      { en: "Education", fr: "Éducation" },
      { en: "Green Jobs", fr: "Emplois verts" },
      { en: "Climate", fr: "Climat" },
    ],
  },
  {
    num: "13",
    group: "community",
    title: {
      en: "Networking and Collaboration",
      fr: "Réseautage et collaboration",
    },
    body: {
      en: "Through partnerships, coalitions, and networking events, BICF connects individuals and organizations committed to equity and inclusion, strengthening collective impact.",
      fr: "Par des partenariats, des coalitions et des événements de réseautage, la BICF met en relation des personnes et des organisations engagées envers l'équité et l'inclusion, renforçant l'impact collectif.",
    },
    detail: {
      en: "We facilitate connections between individuals, organizations, and sectors that share a vision for equity and inclusion. Through strategic partnerships, networking events, and coalition building, BICF strengthens the ecosystem of support around Black immigrants and amplifies collective impact.",
      fr: "Nous facilitons les liens entre les personnes, les organisations et les secteurs qui partagent une vision d'équité et d'inclusion. Par des partenariats stratégiques, des événements de réseautage et la création de coalitions, la BICF renforce l'écosystème de soutien autour des immigrants noirs et amplifie l'impact collectif.",
    },
    tags: [
      { en: "Partnerships", fr: "Partenariats" },
      { en: "Coalitions", fr: "Coalitions" },
      { en: "Network", fr: "Réseau" },
    ],
  },
];

type GroupMeta = {
  id: "first" | "work" | "community";
  label: Bi;
  title: Bi;
  body: Bi;
};

const groupMeta: GroupMeta[] = [
  {
    id: "first",
    label: { en: "First Steps", fr: "Premiers pas" },
    title: { en: "Settling in.", fr: "S'installer." },
    body: {
      en: "The programs that help families land safely, build stability, and feel at home from day one.",
      fr: "Les programmes qui aident les familles à arriver en sécurité, à bâtir leur stabilité et à se sentir chez elles dès le premier jour.",
    },
  },
  {
    id: "work",
    label: { en: "Learning & Work", fr: "Apprentissage et travail" },
    title: { en: "Building futures.", fr: "Bâtir l'avenir." },
    body: {
      en: "Skills, training, and economic supports that turn ambition into stable income and lifelong opportunity.",
      fr: "Compétences, formation et soutiens économiques qui transforment l'ambition en revenu stable et en possibilités pour la vie.",
    },
  },
  {
    id: "community",
    label: { en: "Community & Wellbeing", fr: "Communauté et bien-être" },
    title: { en: "Thriving together.", fr: "S'épanouir ensemble." },
    body: {
      en: "Health, family, advocacy, and connection. The programs that nurture whole people and whole communities.",
      fr: "Santé, famille, défense des droits et liens. Les programmes qui nourrissent des personnes entières et des communautés entières.",
    },
  },
];

const steps: { num: string; title: Bi; body: Bi }[] = [
  {
    num: "01",
    title: { en: "Reach out", fr: "Prenez contact" },
    body: {
      en: "Send a message, give us a call, or walk into our Ajax office. Every conversation is confidential and starts with listening.",
      fr: "Envoyez un message, appelez-nous ou passez à notre bureau d'Ajax. Chaque conversation est confidentielle et commence par l'écoute.",
    },
  },
  {
    num: "02",
    title: { en: "Build a plan", fr: "Bâtissez un plan" },
    body: {
      en: "We map your situation to the right programs and pair you with a coordinator who knows the systems and the people inside them.",
      fr: "Nous associons votre situation aux bons programmes et vous jumelons à un coordonnateur qui connaît les systèmes et les personnes qui les composent.",
    },
  },
  {
    num: "03",
    title: { en: "Move forward", fr: "Avancez" },
    body: {
      en: "You're never on your own. We follow through, adjust as life changes, and connect you to wider partners when you need more than we offer.",
      fr: "Vous n'êtes jamais seul. Nous assurons le suivi, nous ajustons au fil de la vie et nous vous mettons en lien avec un plus vaste réseau de partenaires lorsque vos besoins dépassent ce que nous offrons.",
    },
  },
];

const audiences: Bi[] = [
  { en: "Newcomers", fr: "Nouveaux arrivants" },
  { en: "Established residents", fr: "Résidents établis" },
  { en: "Youth & students", fr: "Jeunes et étudiants" },
  { en: "Families", fr: "Familles" },
  { en: "Individuals", fr: "Personnes seules" },
  { en: "Any status", fr: "Tout statut" },
  { en: "Any language", fr: "Toute langue" },
  { en: "Anyone navigating a barrier", fr: "Toute personne face à un obstacle" },
];

type ServicesProps = {
  pageTitle?: string;
  autoplayDelay?: number;
};

export default function Services({
  pageTitle = "Services | Black Immigrants Community Foundation",
  autoplayDelay = 8000,
}: ServicesProps) {
  const { t, lang } = useLanguage();
  const [activeSlide, setActiveSlide] = useState(0);
  const [expanded, setExpanded] = useState<string | null>(null);
  const toggleExpanded = (n: string) =>
    setExpanded((cur) => (cur === n ? null : n));
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    document.title =
      lang === "fr"
        ? "Services | Black Immigrants Community Foundation"
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
    <main className="services">
      <section
        className="services__hero"
        aria-labelledby="services-hero-title"
      >
        <div className="services__hero-media" aria-hidden="true">
          {heroSlides.map((_, i) => (
            <div
              key={i}
              className={`services__hero-pattern services__hero-pattern--p${i}${
                i === activeSlide ? " services__hero-pattern--active" : ""
              }`}
            />
          ))}
          <div className="services__hero-veil" />
        </div>

        <div className="services__hero-panel">
          <div className="services__hero-panel-inner">
            <div className="services__hero-stage">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                  key={activeSlide}
                  id={`services-hero-panel-${activeSlide}`}
                  role="tabpanel"
                  aria-labelledby={`services-hero-tab-${activeSlide}`}
                  className="services__hero-slide"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.55, ease: EASE }}
                >
                  <span className="services__hero-label">
                    {t(heroSlides[activeSlide].label)}
                  </span>
                  <h1
                    id="services-hero-title"
                    className="services__hero-title"
                  >
                    {t(heroSlides[activeSlide].title).map((line, i) => (
                      <span key={i} className="services__hero-line">
                        {line}
                      </span>
                    ))}
                  </h1>
                  <p className="services__hero-body">
                    {t(heroSlides[activeSlide].body)}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="services__hero-controls">
              <button
                type="button"
                className="services__hero-nav"
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
                className="services__hero-bars"
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
                    id={`services-hero-tab-${i}`}
                    aria-controls={`services-hero-panel-${i}`}
                    aria-selected={i === activeSlide}
                    tabIndex={i === activeSlide ? 0 : -1}
                    aria-label={t({
                      en: `Go to slide ${i + 1}`,
                      fr: `Aller à la diapositive ${i + 1}`,
                    })}
                    className={`services__hero-bar ${i === activeSlide ? "services__hero-bar--active" : ""}`}
                    onClick={() => setActiveSlide(i)}
                  />
                ))}
              </div>

              <button
                type="button"
                className="services__hero-nav"
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

            <div className="services__hero-meta">
              <span>{t({ en: "13 Programs", fr: "13 programmes" })}</span>
              <span aria-hidden="true">·</span>
              <span>{t({ en: "No cost", fr: "Sans frais" })}</span>
              <span aria-hidden="true">·</span>
              <span>
                {t({ en: "Culturally relevant", fr: "Adapté à la culture" })}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section
        className="services__solutions"
        id="solutions"
        aria-labelledby="services-solutions-title"
      >
        <div className="services__container">
          <header className="services__solutions-head">
            <motion.span
              className="services__kicker"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-12%" }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              {t({ en: "Our Services", fr: "Nos services" })}
            </motion.span>
            <motion.h2
              id="services-solutions-title"
              className="services__solutions-title"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-12%" }}
              transition={{ duration: 0.85, ease: EASE, delay: 0.08 }}
            >
              {lang === "fr" ? (
                <>
                  <span>Nos</span>
                  <span>solutions</span>
                  <span>complètes.</span>
                </>
              ) : (
                <>
                  <span>Our</span>
                  <span>comprehensive</span>
                  <span>solutions.</span>
                </>
              )}
            </motion.h2>
            <motion.p
              className="services__solutions-lede"
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-12%" }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.16 }}
            >
              {t({
                en: "At BICF, we provide comprehensive, culturally relevant programs that empower Black immigrants to overcome barriers, build stability, and thrive.",
                fr: "À la BICF, nous offrons des programmes complets et adaptés à la culture qui outillent les immigrants noirs à surmonter les obstacles, à bâtir leur stabilité et à s'épanouir.",
              })}
            </motion.p>
          </header>
        </div>
      </section>

      {groupMeta.map((group, gi) => {
        const items = solutions.filter((s) => s.group === group.id);
        return (
          <section
            key={group.id}
            className={`services__group services__group--${group.id}`}
            aria-labelledby={`services-group-${group.id}-title`}
          >
            <div className="services__container">
              <header className="services__group-head">
                <motion.span
                  className="services__group-step"
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-12%" }}
                  transition={{ duration: 0.5, ease: EASE }}
                >
                  {String(gi + 1).padStart(2, "0")} / {String(groupMeta.length).padStart(2, "0")}
                </motion.span>
                <motion.span
                  className="services__kicker"
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-12%" }}
                  transition={{ duration: 0.55, ease: EASE, delay: 0.06 }}
                >
                  {t(group.label)}
                </motion.span>
                <motion.h2
                  id={`services-group-${group.id}-title`}
                  className="services__group-title"
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-12%" }}
                  transition={{ duration: 0.85, ease: EASE, delay: 0.1 }}
                >
                  {t(group.title)}
                </motion.h2>
                <motion.p
                  className="services__group-body"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-12%" }}
                  transition={{ duration: 0.7, ease: EASE, delay: 0.16 }}
                >
                  {t(group.body)}
                </motion.p>
              </header>

              <ol className="services__rows">
                {items.map((s, i) => {
                  const isOpen = expanded === s.num;
                  return (
                    <motion.li
                      key={s.num}
                      className={`services__row ${isOpen ? "services__row--open" : ""}`}
                      initial={{ opacity: 0, y: 18 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-6%" }}
                      transition={{
                        duration: 0.55,
                        ease: EASE,
                        delay: Math.min(i * 0.04, 0.18),
                      }}
                    >
                      <span className="services__row-num" aria-hidden="true">
                        {s.num}
                      </span>
                      <div className="services__row-main">
                        <h3 className="services__row-title">{t(s.title)}</h3>
                        <p className="services__row-body">{t(s.body)}</p>
                      </div>
                      <ul
                        className="services__row-tags"
                        aria-label={t({
                          en: "Focus areas",
                          fr: "Domaines d'intervention",
                        })}
                      >
                        {s.tags.map((tag) => (
                          <li key={tag.en} className="services__row-tag">
                            {t(tag)}
                          </li>
                        ))}
                      </ul>
                      <button
                        type="button"
                        className="services__row-toggle"
                        onClick={() => toggleExpanded(s.num)}
                        aria-expanded={isOpen}
                        aria-controls={`services-detail-${s.num}`}
                        aria-label={
                          isOpen
                            ? t({
                                en: `Collapse ${t(s.title)}`,
                                fr: `Réduire ${t(s.title)}`,
                              })
                            : t({
                                en: `Expand ${t(s.title)}`,
                                fr: `Développer ${t(s.title)}`,
                              })
                        }
                      >
                        <motion.span
                          className="services__row-toggle-icon"
                          animate={{ rotate: isOpen ? 45 : 0 }}
                          transition={{ duration: 0.35, ease: EASE }}
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
                            id={`services-detail-${s.num}`}
                            className="services__row-detail"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.42, ease: EASE }}
                          >
                            <p className="services__row-detail-text">
                              {t(s.detail)}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.li>
                  );
                })}
              </ol>
            </div>
          </section>
        );
      })}

      <section className="services__how" aria-labelledby="services-how-title">
        <div className="services__container">
          <header className="services__section-head services__section-head--center">
            <motion.span
              className="services__kicker"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-12%" }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              {t({ en: "How It Works", fr: "Comment ça fonctionne" })}
            </motion.span>
            <motion.h2
              id="services-how-title"
              className="services__section-title"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-12%" }}
              transition={{ duration: 0.85, ease: EASE, delay: 0.08 }}
            >
              {t({
                en: "From reaching out to walking forward.",
                fr: "De la prise de contact à l'avancée.",
              })}
            </motion.h2>
          </header>

          <ol className="services__steps">
            {steps.map((s, i) => (
              <motion.li
                key={s.num}
                className="services__step"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.75, ease: EASE, delay: i * 0.1 }}
              >
                <span className="services__step-num">{s.num}</span>
                <h3 className="services__step-title">{t(s.title)}</h3>
                <p className="services__step-body">{t(s.body)}</p>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>

      <section className="services__open" aria-labelledby="services-open-title">
        <div className="services__open-aurora" aria-hidden="true" />
        <div className="services__container">
          <header className="services__open-head">
            <motion.span
              className="services__kicker"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-12%" }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              {t({ en: "Open To All", fr: "Ouvert à tous" })}
            </motion.span>
            <motion.h2
              id="services-open-title"
              className="services__open-title"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-12%" }}
              transition={{ duration: 0.85, ease: EASE, delay: 0.08 }}
            >
              {t({
                en: "For every story that needs support.",
                fr: "Pour chaque histoire qui a besoin de soutien.",
              })}
            </motion.h2>
            <motion.p
              className="services__open-body"
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-12%" }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.16 }}
            >
              {t({
                en: "Our programs are open to Black immigrants at any stage of the journey. Newcomers and longtime residents, families and individuals, documented or otherwise. If you're navigating a barrier, you're welcome here.",
                fr: "Nos programmes sont ouverts aux immigrants noirs à toute étape de leur parcours. Nouveaux arrivants et résidents de longue date, familles et personnes seules, avec ou sans papiers. Si vous faites face à un obstacle, vous êtes le bienvenu ici.",
              })}
            </motion.p>
          </header>

          <motion.ul
            className="services__open-tags"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-12%" }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.24 }}
          >
            {audiences.map((a) => (
              <li key={a.en} className="services__open-tag">
                {t(a)}
              </li>
            ))}
          </motion.ul>
        </div>
      </section>
    </main>
  );
}
