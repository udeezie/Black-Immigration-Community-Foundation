/* Programs page.

   Thirteen programs presented as a filterable catalogue rather than one long
   list: the chips narrow the grid to a single area of focus, and each card
   keeps its long detail folded away until asked for. */

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useLanguage, type Lang } from "../../context/LanguageContext";
import Reveal from "../../components/Reveal/Reveal";
import "./Services.scss";

type Bi = Record<Lang, string>;

const EASE = [0.22, 1, 0.36, 1] as const;

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
    title: { en: "Mental Health and Wellness", fr: "Santé mentale et mieux-être" },
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
    title: { en: "Youth and Family Programs", fr: "Programmes jeunesse et famille" },
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
    title: { en: "Networking and Collaboration", fr: "Réseautage et collaboration" },
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

const groupMeta: {
  id: "first" | "work" | "community";
  label: Bi;
  title: Bi;
  body: Bi;
  image: string;
}[] = [
  {
    id: "first",
    label: { en: "First Steps", fr: "Premiers pas" },
    title: { en: "Settling in.", fr: "S'installer." },
    body: {
      en: "The programs that help families land safely, build stability, and feel at home from day one.",
      fr: "Les programmes qui aident les familles à arriver en sécurité, à bâtir leur stabilité et à se sentir chez elles dès le premier jour.",
    },
    image: "/h5.webp",
  },
  {
    id: "work",
    label: { en: "Learning & Work", fr: "Apprentissage et travail" },
    title: { en: "Building futures.", fr: "Bâtir l'avenir." },
    body: {
      en: "Skills, training, and economic supports that turn ambition into stable income and lifelong opportunity.",
      fr: "Compétences, formation et soutiens économiques qui transforment l'ambition en revenu stable et en possibilités pour la vie.",
    },
    image: "/h7.webp",
  },
  {
    id: "community",
    label: { en: "Community & Wellbeing", fr: "Communauté et bien-être" },
    title: { en: "Thriving together.", fr: "S'épanouir ensemble." },
    body: {
      en: "Health, family, advocacy, and connection. The programs that nurture whole people and whole communities.",
      fr: "Santé, famille, défense des droits et liens. Les programmes qui nourrissent des personnes entières et des communautés entières.",
    },
    image: "/h9.webp",
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

type FilterId = "all" | Solution["group"];

/* "All" plus one entry per group, so the chip row stays in step with
   groupMeta without a second list to maintain. */
const filters: { id: FilterId; label: Bi }[] = [
  { id: "all", label: { en: "All programs", fr: "Tous les programmes" } },
  ...groupMeta.map((g) => ({ id: g.id as FilterId, label: g.label })),
];

export default function Services({
  pageTitle = "Programs | Black Immigrants Community Foundation",
}: {
  pageTitle?: string;
}) {
  const { t, lang } = useLanguage();
  const [open, setOpen] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterId>("all");

  useEffect(() => {
    document.title =
      lang === "fr"
        ? "Programmes | Black Immigrants Community Foundation"
        : pageTitle;
  }, [pageTitle, lang]);

  const visible =
    filter === "all" ? solutions : solutions.filter((s) => s.group === filter);
  const activeGroup = groupMeta.find((g) => g.id === filter) ?? null;

  const toggle = (n: string) => setOpen((cur) => (cur === n ? null : n));
  const pick = (id: FilterId) => {
    setFilter(id);
    setOpen(null);
  };

  const countFor = (id: FilterId) =>
    id === "all"
      ? solutions.length
      : solutions.filter((s) => s.group === id).length;

  return (
    <main className="services" id="main">
      {/* Hero */}
      <section className="page-hero surface surface--dark" aria-labelledby="svc-title">
        <div className="page-hero__glow" aria-hidden="true" />
        <div className="container page-hero__inner">
          <Reveal as="span" className="kicker" y={12}>
            {t({ en: "Our Services", fr: "Nos services" })}
          </Reveal>
          <Reveal
            as="h1"
            id="svc-title"
            className="h-display page-hero__title"
            delay={0.05}
          >
            {t({
              en: "Comprehensive support for Black immigrants to ",
              fr: "Un soutien complet pour aider les immigrants noirs à ",
            })}
            <span className="accent-word">
              {t({
                en: "overcome barriers and thrive",
                fr: "surmonter les obstacles et s'épanouir",
              })}
            </span>
          </Reveal>
          <Reveal as="p" className="lead page-hero__lead" delay={0.1}>
            {t({
              en: "At BICF, we provide comprehensive, culturally relevant programs that empower Black immigrants to overcome barriers, build stability, and thrive.",
              fr: "À la BICF, nous offrons des programmes complets et adaptés à la culture qui permettent aux immigrants noirs de surmonter les obstacles, de bâtir leur stabilité et de s'épanouir.",
            })}
          </Reveal>
          <Reveal as="div" className="page-hero__actions" delay={0.16}>
            <Link to="/contact" className="btn btn--primary">
              {t({ en: "Request Support", fr: "Demander du soutien" })}
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Who we serve */}
      <section className="who surface surface--light sheet" aria-labelledby="who-title">
        <div className="container">
          <div className="who__grid">
            <div className="who__copy">
              <Reveal as="span" className="kicker">
                {t({ en: "Supporting Our Community", fr: "Soutenir notre communauté" })}
              </Reveal>
              <Reveal as="h2" id="who-title" className="h2" delay={0.05}>
                {t({
                  en: "Our work spans education, advocacy, social support, and community development.",
                  fr: "Notre travail couvre l'éducation, la défense des droits, le soutien social et le développement communautaire.",
                })}
              </Reveal>
              <Reveal as="p" className="body" delay={0.1}>
                {t({
                  en: "Ensuring every individual and family receives the help they need to succeed.",
                  fr: "Afin que chaque personne et chaque famille reçoive l'aide dont elle a besoin pour réussir.",
                })}
              </Reveal>
            </div>

            <Reveal as="ul" className="who__tags" delay={0.14}>
              {audiences.map((a) => (
                <li key={a.en}>{t(a)}</li>
              ))}
            </Reveal>
          </div>
        </div>
      </section>

      {/* Catalog */}
      <section
        className="catalog surface surface--tint"
        id="programs"
        aria-labelledby="catalog-title"
      >
        <div className="container">
          <header className="section-head">
            <div>
              <Reveal as="span" className="kicker">
                {t({ en: "Our Programs", fr: "Nos programmes" })}
              </Reveal>
              <Reveal as="h2" id="catalog-title" className="h2" delay={0.05}>
                {t({
                  en: "Thirteen programs, three areas of focus.",
                  fr: "Treize programmes, trois domaines d'intervention.",
                })}
              </Reveal>
            </div>
            <Reveal as="div" className="section-head__aside" delay={0.1}>
              <p className="body">
                {t({
                  en: "Choose an area to narrow the list, or browse everything. Open any program for the full detail.",
                  fr: "Choisissez un domaine pour filtrer la liste, ou parcourez l'ensemble. Ouvrez un programme pour tous les détails.",
                })}
              </p>
            </Reveal>
          </header>

          <div
            className="catalog__filters"
            role="tablist"
            aria-label={t({
              en: "Filter programs by area",
              fr: "Filtrer les programmes par domaine",
            })}
          >
            {filters.map((f) => {
              const on = filter === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  aria-controls="catalog-grid"
                  className={`chip ${on ? "chip--on" : ""}`}
                  onClick={() => pick(f.id)}
                >
                  <span>{t(f.label)}</span>
                  <span className="chip__count">
                    {String(countFor(f.id)).padStart(2, "0")}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Keys are namespaced because this banner and the grid below are
              siblings that would otherwise both be keyed "first". */}
          {activeGroup && (
            <div className="catalog__banner" key={`banner-${activeGroup.id}`}>
              <figure className="catalog__banner-media">
                <img
                  src={activeGroup.image}
                  alt=""
                  width={800}
                  height={600}
                  loading="lazy"
                  decoding="async"
                />
              </figure>
              <div className="catalog__banner-copy">
                <h3 className="h3">{t(activeGroup.title)}</h3>
                <p className="body">{t(activeGroup.body)}</p>
              </div>
            </div>
          )}

          <ul className="catalog__grid" id="catalog-grid" key={`grid-${filter}`}>
            {visible.map((sn, i) => {
              const isOpen = open === sn.num;
              return (
                <li
                  className={`pcard ${isOpen ? "pcard--open" : ""}`}
                  key={sn.num}
                  style={{ animationDelay: `${Math.min(i, 8) * 40}ms` }}
                >
                  <h3 className="pcard__title">{t(sn.title)}</h3>
                  <p className="pcard__body">{t(sn.body)}</p>

                  <ul className="pcard__tags">
                    {sn.tags.map((tag) => (
                      <li key={tag.en}>{t(tag)}</li>
                    ))}
                  </ul>

                  <button
                    type="button"
                    className="pcard__more"
                    onClick={() => toggle(sn.num)}
                    aria-expanded={isOpen}
                    aria-controls={`p-${sn.num}`}
                  >
                    <span>
                      {isOpen
                        ? t({ en: "Show less", fr: "Voir moins" })
                        : t({ en: "Full detail", fr: "Tous les détails" })}
                    </span>
                    <span className="pcard__plus" aria-hidden="true">
                      <svg width="13" height="13" viewBox="0 0 15 15" fill="none">
                        <path
                          d="M7.5 1.5V13.5M1.5 7.5H13.5"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          strokeLinecap="round"
                        />
                      </svg>
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="d"
                        id={`p-${sn.num}`}
                        className="pcard__detail"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.36, ease: EASE }}
                      >
                        <p className="pcard__detail-text">{t(sn.detail)}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* How it works */}
      <section
        className="steps surface surface--dark sheet"
        aria-labelledby="steps-title"
      >
        <div className="container">
          <header className="section-head">
            <div>
              <Reveal as="span" className="kicker">
                {t({ en: "How it works", fr: "Comment ça marche" })}
              </Reveal>
              <Reveal as="h2" id="steps-title" className="h2" delay={0.05}>
                {t({
                  en: "Get the Support You Need.",
                  fr: "Obtenez le soutien dont vous avez besoin.",
                })}
              </Reveal>
            </div>
            <Reveal as="div" className="section-head__aside" delay={0.1}>
              <p className="body">
                {t({
                  en: "No cost. No proof of status required. Every conversation is confidential.",
                  fr: "Sans frais. Aucune preuve de statut exigée. Chaque conversation est confidentielle.",
                })}
              </p>
            </Reveal>
          </header>

          <ol className="steps__track">
            {steps.map((st, i) => (
              <Reveal as="li" className="step" key={st.num} delay={i * 0.08}>
                <span className="step__marker" aria-hidden="true">
                  {st.num}
                </span>
                <h3 className="h3 step__title">{t(st.title)}</h3>
                <p className="step__body">{t(st.body)}</p>
              </Reveal>
            ))}
          </ol>

          <Reveal as="div" className="steps__cta" delay={0.2}>
            <Link to="/contact" className="btn btn--primary">
              {t({ en: "Start the conversation", fr: "Entamer la conversation" })}
            </Link>
            <a href="tel:+19059313776" className="btn btn--outline">
              {t({ en: "Call (905) 931 3776", fr: "Appeler (905) 931 3776" })}
            </a>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
