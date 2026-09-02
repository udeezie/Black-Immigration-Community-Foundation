/* Home page.

   Content lives in the arrays at the top of the file (services, testimonials,
   sponsors...) so copy edits never touch layout. The page body is only
   composition. */

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useLanguage, type Lang } from "../../context/LanguageContext";
import Reveal from "../../components/Reveal/Reveal";
import "./Home.scss";

type Bi = Record<Lang, string>;

const EASE = [0.22, 1, 0.36, 1] as const;

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
    label: { en: "Educational Support", fr: "Soutien éducatif" },
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
    label: { en: "Community & Advocacy", fr: "Communauté et défense des droits" },
    tag: { en: "Voices amplified", fr: "Des voix amplifiées" },
    body: {
      en: "Empowering Black immigrants through community, leadership, and advocacy.",
      fr: "Outiller les immigrants noirs par la communauté, le leadership et la défense des droits.",
    },
    image: "/h9.webp",
  },
];

const testimonials: { quote: Bi; name: string }[] = [
  {
    quote: {
      en: "BICF's educational programs made it easier for me to understand and navigate the Canadian education system. From school applications to scholarships, their guidance gave me hope and direction.",
      fr: "Les programmes éducatifs de la BICF m'ont permis de mieux comprendre le système d'éducation canadien et de m'y orienter. Des demandes d'admission aux bourses, leur accompagnement m'a donné espoir et direction.",
    },
    name: "Amina",
  },
  {
    quote: {
      en: "After facing discrimination at work, BICF stood by me and helped me find my voice. Their advocacy gave me courage and reminded me that my rights matter.",
      fr: "Après avoir subi de la discrimination au travail, la BICF m'a soutenu et m'a aidé à faire entendre ma voix. Leur défense m'a donné du courage et m'a rappelé que mes droits comptent.",
    },
    name: "Samuel",
  },
  {
    quote: {
      en: "Moving to a new country was lonely, but BICF's community programs helped me connect with others and find belonging. I finally feel accepted and supported.",
      fr: "Arriver dans un nouveau pays était solitaire, mais les programmes communautaires de la BICF m'ont aidée à rencontrer d'autres personnes et à trouver ma place. Je me sens enfin acceptée et soutenue.",
    },
    name: "Nadiae",
  },
  {
    quote: {
      en: "The counseling and wellness programs at BICF helped me manage the stress of immigration. Their culturally sensitive approach gave me healing and strength.",
      fr: "Les programmes de counseling et de mieux-être de la BICF m'ont aidée à gérer le stress de l'immigration. Leur approche sensible à la culture m'a apporté guérison et force.",
    },
    name: "Anim",
  },
  {
    quote: {
      en: "As a parent, I appreciate BICF's youth and family programs. They help my children grow confidently while staying proud of their heritage.",
      fr: "En tant que parent, j'apprécie les programmes jeunesse et famille de la BICF. Ils aident mes enfants à grandir avec confiance tout en restant fiers de leur héritage.",
    },
    name: "Chinyera",
  },
  {
    quote: {
      en: "BICF's financial literacy workshops taught me how to manage my money wisely. I now feel confident budgeting, saving, and planning for the future.",
      fr: "Les ateliers de littératie financière de la BICF m'ont appris à gérer mon argent judicieusement. Je me sens maintenant à l'aise pour budgéter, épargner et planifier l'avenir.",
    },
    name: "James",
  },
];

const sponsors: {
  name: Bi;
  short: Bi;
  src: string;
  href: string;
  /* `dark` flags a logo file drawn in white, which needs its own tile to
     stay legible on the light funder strip. */
  dark?: boolean;
}[] = [
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
    dark: true,
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

const involvement: { title: Bi; body: Bi }[] = [
  {
    title: { en: "Volunteer", fr: "Bénévolat" },
    body: {
      en: "We welcome volunteers in legal intake, communications, event coordination, youth mentorship, and administrative roles.",
      fr: "Nous accueillons des bénévoles pour l'accueil juridique, les communications, la coordination d'événements, le mentorat jeunesse et les tâches administratives.",
    },
  },
  {
    title: { en: "Partner With Us", fr: "Devenir partenaire" },
    body: {
      en: "BICF values partnerships with other organizations, community groups, and stakeholders who share our vision of a just and inclusive society.",
      fr: "La BICF valorise les partenariats avec d'autres organisations, groupes communautaires et parties prenantes qui partagent notre vision d'une société juste et inclusive.",
    },
  },
  {
    title: { en: "Share Our Story", fr: "Partagez notre histoire" },
    body: {
      en: "Every share widens the circle of people who know that support exists, and helps more families find us.",
      fr: "Chaque partage élargit le cercle de ceux qui savent que du soutien existe et aide plus de familles à nous trouver.",
    },
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

export default function Home({
  pageTitle = "Black Immigrants Community Foundation | BICF",
}: {
  pageTitle?: string;
}) {
  const { t, lang } = useLanguage();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    document.title =
      lang === "fr"
        ? "Accueil | Black Immigrants Community Foundation"
        : pageTitle;
  }, [pageTitle, lang]);

  return (
    <main className="home" id="main">
      {/* Hero */}
      <section className="hero surface surface--dark" aria-labelledby="hero-title">
        <div className="hero__bg" aria-hidden="true">
          <img
            src="/hh1.webp"
            alt=""
            width={1600}
            height={1100}
            fetchPriority="high"
            decoding="async"
          />
          <span className="hero__scrim" />
        </div>

        <div className="container hero__inner">
          <div className="hero__copy">
            <Reveal as="span" className="kicker hero__kicker" y={12}>
              {t({ en: "Welcome to BICF", fr: "Bienvenue à la BICF" })}
            </Reveal>
            <Reveal
              as="h1"
              id="hero-title"
              className="h-display hero__title"
              delay={0.06}
            >
              {t({
                en: "Empowering Black Immigrants to ",
                fr: "Outiller les immigrants noirs pour ",
              })}
              <span className="accent-word">
                {t({
                  en: "Thrive and Lead",
                  fr: "qu'ils s'épanouissent et dirigent",
                })}
              </span>
            </Reveal>
            <Reveal as="p" className="lead hero__lead" delay={0.12}>
              {t({
                en: "Creating opportunities, promoting justice, and building community for Black immigrants everywhere.",
                fr: "Créer des possibilités, promouvoir la justice et bâtir une communauté pour les immigrants noirs partout.",
              })}
            </Reveal>
            <Reveal as="div" className="hero__actions" delay={0.18}>
              <Link to="/contact" className="btn btn--primary">
                {t({ en: "Get Support", fr: "Obtenir du soutien" })}
              </Link>
              <Link to="/about" className="btn btn--outline">
                {t({ en: "Learn More", fr: "En savoir plus" })}
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Story + foundations */}
      <section
        className="story surface surface--light sheet"
        aria-labelledby="story-title"
      >
        <div className="container">
          <div className="story__grid">
            <div className="story__copy">
              <Reveal as="span" className="kicker">
                {t({ en: "About BICF", fr: "À propos de la BICF" })}
              </Reveal>
              <Reveal
                as="h2"
                id="story-title"
                className="h1 story__title"
                delay={0.05}
              >
                {t({
                  en: "One community. Endless hope.",
                  fr: "Une communauté. Espoir infini.",
                })}
              </Reveal>
              <Reveal as="p" className="lead" delay={0.1}>
                {t({
                  en: "The Black Immigrants Community Foundation (BICF) is a nonprofit organization dedicated to supporting and empowering Black immigrants through advocacy, resources, and community building initiatives.",
                  fr: "La Black Immigrants Community Foundation (BICF) est un organisme sans but lucratif voué au soutien et à l'autonomisation des immigrants noirs par la défense des droits, les ressources et des initiatives de renforcement communautaire.",
                })}
              </Reveal>
              <Reveal as="p" className="body story__body" delay={0.14}>
                {t({
                  en: "We walk alongside families building new lives through advocacy, opportunity, and unwavering support.",
                  fr: "Nous accompagnons les familles qui bâtissent une nouvelle vie par la défense des droits, les possibilités et un soutien indéfectible.",
                })}
              </Reveal>
              <Reveal as="div" delay={0.2}>
                <Link to="/about" className="btn btn--solid">
                  {t({ en: "Learn More About Us", fr: "En savoir plus sur nous" })}
                </Link>
              </Reveal>
            </div>

            <Reveal as="figure" className="story__media" delay={0.12} y={30}>
              <img
                src="/h4.webp"
                alt={t({
                  en: "A Black immigrant family supported by BICF",
                  fr: "Une famille d'immigrants noirs accompagnée par la BICF",
                })}
                width={720}
                height={960}
                loading="lazy"
                decoding="async"
              />
            </Reveal>
          </div>

          <ul className="story__pillars">
            {principles.map((pr, i) => (
              <Reveal
                as="li"
                className="pillar"
                key={pr.eyebrow.en}
                delay={i * 0.08}
              >
                <h3 className="h3 pillar__label">{t(pr.eyebrow)}</h3>
                <p className="lead pillar__body">{t(pr.body)}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Funders */}
      <section
        className="backing surface surface--tint"
        aria-labelledby="backing-title"
      >
        <div className="container">
          <Reveal as="header" className="backing__head">
            <span className="kicker">
              {t({ en: "Supported By", fr: "Soutenu par" })}
            </span>
            <h2 id="backing-title" className="h2 backing__title">
              {t({
                en: "Proudly funded by leading organizations.",
                fr: "Fièrement financé par des organisations de premier plan.",
              })}
            </h2>
          </Reveal>

          <Reveal as="ul" className="backing__strip" delay={0.08}>
            {sponsors.map((sp) => (
              <li className="backer" key={sp.name.en}>
                <a
                  href={sp.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t(sp.name)}
                >
                  <span
                    className={`backer__frame${
                      sp.dark ? " backer__frame--tile" : ""
                    }`}
                  >
                    <img
                      src={sp.src}
                      alt=""
                      loading="lazy"
                      decoding="async"
                    />
                  </span>
                  <span className="backer__name">{t(sp.short)}</span>
                </a>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Programs */}
      <section
        className="programs surface surface--dark"
        id="programs"
        aria-labelledby="programs-title"
      >
        <div className="container">
          <header className="section-head">
            <div>
              <Reveal as="span" className="kicker">
                {t({ en: "Our Services", fr: "Nos services" })}
              </Reveal>
              <Reveal as="h2" id="programs-title" className="h2" delay={0.05}>
                {t({
                  en: "Comprehensive support for the Black immigrant community.",
                  fr: "Un soutien complet pour la communauté immigrante noire.",
                })}
              </Reveal>
            </div>
            <Reveal as="div" className="section-head__aside" delay={0.1}>
              <p className="body">
                {t({
                  en: "Legal guidance, educational pathways, wellness, and employment support. Every service is built so Black immigrants don't just survive, they thrive.",
                  fr: "Accompagnement juridique, parcours éducatifs, mieux-être et soutien à l'emploi. Chaque service est conçu pour que les immigrants noirs ne se contentent pas de survivre, mais s'épanouissent.",
                })}
              </p>
              <Link to="/services" className="link-arrow">
                {t({ en: "View All Services", fr: "Voir tous les services" })}
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path
                    d="M3 8h10M9 4l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </Reveal>
          </header>

          <ul className="programs__grid">
            {services.map((s, i) => (
              <Reveal as="li" key={s.label.en} delay={(i % 3) * 0.07}>
                <Link to="/services" className="program">
                  <div className="program__media">
                    <img
                      src={s.image}
                      alt=""
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="program__body">
                    <span className="program__tag">{t(s.tag)}</span>
                    <h3 className="h3 program__title">{t(s.label)}</h3>
                    <p className="body program__text">{t(s.body)}</p>
                    <span className="link-arrow program__link">
                      {t({ en: "Learn more", fr: "En savoir plus" })}
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                        <path
                          d="M3 8h10M9 4l4 4-4 4"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Feature rows */}
      <section
        className="feature surface surface--light sheet"
        aria-labelledby="feature-title"
      >
        <div className="container">
          <div className="feature__row">
            <Reveal as="figure" className="feature__media" y={30}>
              <img
                src="/hh2.webp"
                alt=""
                width={1200}
                height={900}
                loading="lazy"
                decoding="async"
              />
            </Reveal>
            <div className="feature__copy">
              <Reveal as="span" className="kicker">
                {t({ en: "For every arrival", fr: "Pour chaque arrivée" })}
              </Reveal>
              <Reveal as="h2" id="feature-title" className="h2" delay={0.05}>
                {t({
                  en: "Advocacy that meets the moment.",
                  fr: "Une défense à la hauteur du moment.",
                })}
              </Reveal>
              <Reveal as="p" className="lead" delay={0.1}>
                {t({
                  en: "BICF amplifies the voices of Black immigrants through grassroots organizing, public education, and policy reform. The people most affected shape the decisions that affect them.",
                  fr: "La BICF amplifie la voix des immigrants noirs par la mobilisation citoyenne, l'éducation du public et la réforme des politiques. Les personnes les plus touchées façonnent les décisions qui les concernent.",
                })}
              </Reveal>
              <Reveal as="div" delay={0.15}>
                <Link to="/research" className="btn btn--solid">
                  {t({ en: "See our research", fr: "Voir notre recherche" })}
                </Link>
              </Reveal>
            </div>
          </div>

          <div className="feature__row feature__row--reverse">
            <Reveal as="figure" className="feature__media" y={30}>
              <img
                src="/hh3.webp"
                alt=""
                width={1200}
                height={900}
                loading="lazy"
                decoding="async"
              />
            </Reveal>
            <div className="feature__copy">
              <Reveal as="span" className="kicker">
                {t({ en: "Built together", fr: "Bâti ensemble" })}
              </Reveal>
              <Reveal as="h2" className="h2" delay={0.05}>
                {t({
                  en: "Resources that build a steady home.",
                  fr: "Des ressources qui bâtissent un foyer stable.",
                })}
              </Reveal>
              <Reveal as="p" className="lead" delay={0.1}>
                {t({
                  en: "The programs that help families land safely, build stability, and feel at home from day one. Housing, healthcare, financial literacy, and digital access.",
                  fr: "Les programmes qui aident les familles à arriver en sécurité, à bâtir leur stabilité et à se sentir chez elles dès le premier jour. Logement, santé, littératie financière et accès numérique.",
                })}
              </Reveal>
              <Reveal as="div" delay={0.15}>
                <Link to="/services" className="btn btn--solid">
                  {t({ en: "Browse programs", fr: "Parcourir les programmes" })}
                </Link>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Voices */}
      <section
        className="voices surface surface--tint"
        aria-labelledby="voices-title"
      >
        <div className="container">
          <header className="section-head section-head--center">
            <div>
              <Reveal as="span" className="kicker">
                {t({ en: "Community Voices", fr: "Voix de la communauté" })}
              </Reveal>
              <Reveal as="h2" id="voices-title" className="h2" delay={0.05}>
                {t({
                  en: "Hear from those we've supported.",
                  fr: "Écoutez celles et ceux que nous avons accompagnés.",
                })}
              </Reveal>
            </div>
          </header>

          <ul className="voices__grid">
            {testimonials.map((v, i) => (
              <Reveal
                as="li"
                className="voice"
                key={v.name}
                delay={(i % 3) * 0.07}
              >
                <svg className="voice__mark" viewBox="0 0 32 24" fill="none" aria-hidden="true">
                  <path
                    d="M0 24V14.4C0 10.4 0.8 7.2 2.4 4.8C4 2.4 6.4 0.8 9.6 0L11.2 3.2C9.6 4 8.4 4.8 7.6 5.6C6.8 6.4 6.4 7.6 6.4 9.2H12V24H0ZM20 24V14.4C20 10.4 20.8 7.2 22.4 4.8C24 2.4 26.4 0.8 29.6 0L31.2 3.2C29.6 4 28.4 4.8 27.6 5.6C26.8 6.4 26.4 7.6 26.4 9.2H32V24H20Z"
                    fill="currentColor"
                  />
                </svg>
                <blockquote className="voice__quote">{t(v.quote)}</blockquote>
                <div className="voice__meta">
                  <span className="voice__initial" aria-hidden="true">
                    {v.name.charAt(0)}
                  </span>
                  <span className="voice__name">{v.name}</span>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Get involved */}
      <section
        className="involve surface surface--dark"
        id="get-involved"
        aria-labelledby="involve-title"
      >
        <div className="container">
          <div className="involve__grid">
            <div className="involve__intro">
              <Reveal as="span" className="kicker">
                {t({ en: "Get Involved", fr: "Participer" })}
              </Reveal>
              <Reveal as="h2" id="involve-title" className="h2" delay={0.05}>
                {t({ en: "Join the Movement.", fr: "Joignez-vous au mouvement." })}
              </Reveal>
              <Reveal as="p" className="lead involve__lead" delay={0.1}>
                {t({
                  en: "Together, we can create lasting change for Black immigrants in our communities.",
                  fr: "Ensemble, nous pouvons créer un changement durable pour les immigrants noirs de nos communautés.",
                })}
              </Reveal>
              <Reveal as="div" delay={0.16}>
                <Link to="/contact" className="btn btn--primary">
                  {t({ en: "Get In Touch", fr: "Nous Contacter" })}
                </Link>
              </Reveal>
            </div>

            <ul className="involve__list">
              {involvement.map((it, i) => (
                <Reveal
                  as="li"
                  className="involve__item"
                  key={it.title.en}
                  delay={i * 0.07}
                >
                  <div>
                    <h3 className="h3 involve__title">{t(it.title)}</h3>
                    <p className="body involve__body">{t(it.body)}</p>
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section
        className="faq surface surface--light sheet"
        aria-labelledby="faq-title"
      >
        <div className="container">
          <div className="faq__grid">
            <div className="faq__aside">
              <Reveal as="span" className="kicker">
                {t({ en: "Questions", fr: "Questions" })}
              </Reveal>
              <Reveal as="h2" id="faq-title" className="h2" delay={0.05}>
                {t({
                  en: "Frequently asked questions",
                  fr: "Questions fréquentes",
                })}
              </Reveal>
              <Reveal as="p" className="body faq__aside-text" delay={0.1}>
                {t({
                  en: "Can't find what you're looking for? Our team is one message away.",
                  fr: "Vous ne trouvez pas ce que vous cherchez? Notre équipe est à un message d'ici.",
                })}
              </Reveal>
              <Reveal as="div" delay={0.14}>
                <Link to="/contact" className="btn btn--solid">
                  {t({ en: "Contact us", fr: "Nous contacter" })}
                </Link>
              </Reveal>
            </div>

            <ul className="faq__list">
              {homeFaqs.map((item, i) => {
                const isOpen = openFaq === i;
                return (
                  <li
                    className={`faq__item ${isOpen ? "faq__item--open" : ""}`}
                    key={item.q.en}
                  >
                    <h3>
                      <button
                        type="button"
                        className="faq__trigger"
                        onClick={() => setOpenFaq(isOpen ? null : i)}
                        aria-expanded={isOpen}
                        aria-controls={`faq-panel-${i}`}
                        id={`faq-button-${i}`}
                      >
                        <span className="faq__q">{t(item.q)}</span>
                        <span className="faq__icon" aria-hidden="true">
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path
                              d="M7 1V13M1 7H13"
                              stroke="currentColor"
                              strokeWidth="1.7"
                              strokeLinecap="round"
                            />
                          </svg>
                        </span>
                      </button>
                    </h3>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          key="panel"
                          id={`faq-panel-${i}`}
                          role="region"
                          aria-labelledby={`faq-button-${i}`}
                          className="faq__panel"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.34, ease: EASE }}
                        >
                          <p className="faq__a">{t(item.a)}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
