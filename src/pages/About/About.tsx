/* About page. Content arrays first, composition below. */

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useLanguage, type Lang } from "../../context/LanguageContext";
import Reveal from "../../components/Reveal/Reveal";
import "./About.scss";

type Bi = Record<Lang, string>;

const EASE = [0.22, 1, 0.36, 1] as const;

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
    title: { en: "Integrity & Transparency", fr: "Intégrité et transparence" },
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
    title: { en: "Mental Health and Wellness", fr: "Santé mentale et mieux-être" },
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

export default function About({
  pageTitle = "About | Black Immigrants Community Foundation",
}: {
  pageTitle?: string;
}) {
  const { t, lang } = useLanguage();
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    document.title =
      lang === "fr"
        ? "À propos | Black Immigrants Community Foundation"
        : pageTitle;
  }, [pageTitle, lang]);

  return (
    <main className="about" id="main">
      {/* ====================================================== HERO dark */}
      <section className="page-hero surface surface--dark" aria-labelledby="about-title">
        <div className="page-hero__glow" aria-hidden="true" />
        <div className="container page-hero__inner">
          <Reveal as="span" className="kicker" y={12}>
            {t({ en: "About / The Foundation", fr: "À propos / La Fondation" })}
          </Reveal>
          <Reveal
            as="h1"
            id="about-title"
            className="h-display page-hero__title"
            delay={0.05}
          >
            {t({ en: "Growth powered by ", fr: "La croissance portée par " })}
            <span className="accent-word">
              {t({ en: "Black immigrants.", fr: "les immigrants noirs." })}
            </span>
          </Reveal>
          <Reveal as="p" className="lead page-hero__lead" delay={0.1}>
            {t({
              en: "The Black Immigrants Community Foundation is a nonprofit organization committed to supporting and empowering Black immigrants through advocacy, resources, and community building.",
              fr: "La Black Immigrants Community Foundation est un organisme sans but lucratif voué au soutien et à l'autonomisation des immigrants noirs par la défense des droits, les ressources et le renforcement communautaire.",
            })}
          </Reveal>
          <Reveal as="div" className="page-hero__actions" delay={0.16}>
            <Link to="/services" className="btn btn--primary">
              {t({ en: "Our Programs", fr: "Nos programmes" })}
            </Link>
            <Link to="/contact" className="btn btn--outline">
              {t({ en: "Contact Us", fr: "Nous contacter" })}
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ===================================================== STORY light */}
      <section className="story surface surface--light sheet" aria-labelledby="story-title">
        <div className="container">
          <header className="section-head">
            <div>
              <Reveal as="span" className="kicker">
                {t({ en: "About Us", fr: "À propos" })}
              </Reveal>
              <Reveal as="h2" id="story-title" className="h2" delay={0.05}>
                {t({
                  en: "A foundation built around the realities of Black immigrant life.",
                  fr: "Une fondation conçue autour des réalités de la vie des immigrants noirs.",
                })}
              </Reveal>
            </div>
            <Reveal as="div" className="section-head__aside" delay={0.1}>
              <p className="body">
                {t({
                  en: "Practical resources. Real advocacy. A community that holds.",
                  fr: "Des ressources concrètes. Une défense réelle. Une communauté solide.",
                })}
              </p>
            </Reveal>
          </header>

          <div className="story__body">
            <Reveal as="p" className="story__lead">
              {t({
                en: "The Black Immigrants Community Foundation (BICF) is a nonprofit organization committed to empowering Black immigrants through advocacy, resources, and community building. We understand the intersecting challenges Black immigrants face from racial discrimination and cultural alienation to systemic barriers that hinder integration and success.",
                fr: "La Black Immigrants Community Foundation (BICF) est un organisme sans but lucratif voué à l'autonomisation des immigrants noirs par la défense des droits, les ressources et le renforcement communautaire. Nous comprenons les défis imbriqués auxquels les immigrants noirs font face, de la discrimination raciale et de l'aliénation culturelle aux barrières systémiques qui freinent l'intégration et la réussite.",
              })}
            </Reveal>

            <AnimatePresence initial={false}>
              {expanded && (
                <motion.div
                  key="more"
                  className="story__more"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.45, ease: EASE }}
                >
                  <p className="body">
                    {t({
                      en: "At BICF, we provide culturally responsive programs and support to ensure Black immigrants not only survive but thrive in their new communities. Our work is rooted in dignity, equity, and the belief that collective growth comes when everyone has the opportunity to succeed.",
                      fr: "À la BICF, nous offrons des programmes et un soutien adaptés à la culture pour que les immigrants noirs ne se contentent pas de survivre, mais s'épanouissent dans leurs nouvelles communautés. Notre travail est ancré dans la dignité, l'équité et la conviction que la croissance collective survient lorsque chacun a la possibilité de réussir.",
                    })}
                  </p>
                  {fullStory.map((para, i) => (
                    <p className="body" key={i}>
                      {t(para)}
                    </p>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="button"
              className="btn btn--outline story__toggle"
              aria-expanded={expanded}
              onClick={() => setExpanded((v) => !v)}
            >
              {expanded
                ? t({ en: "Show Less", fr: "Afficher moins" })
                : t({ en: "Read Our Full Story", fr: "Lire notre histoire complète" })}
            </button>
          </div>
        </div>
      </section>

      {/* ==================================================== PILLARS dark */}
      <section className="pillars surface surface--dark" aria-labelledby="pillars-title">
        <div className="container">
          <header className="section-head">
            <div>
              <Reveal as="span" className="kicker">
                {t({ en: "The Frame", fr: "Le cadre" })}
              </Reveal>
              <Reveal as="h2" id="pillars-title" className="h2" delay={0.05}>
                {t({
                  en: "Purpose, mission, and vision.",
                  fr: "Raison d'être, mission et vision.",
                })}
              </Reveal>
            </div>
          </header>

          <div className="pillars__stack">
            {pillars.map((p, i) => (
              <Reveal
                as="article"
                className="pillar"
                key={p.label.en}
                data-align={i % 2 === 0 ? "left" : "right"}
                delay={0.04}
                y={30}
              >
                <figure className="pillar__media">
                  <img
                    src={p.image}
                    alt={`${t(p.label)}, ${t(p.tag)}`}
                    width={1200}
                    height={900}
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="pillar__badge">
                    <span className="pillar__badge-text">{t(p.tag)}</span>
                  </span>
                </figure>

                <div className="pillar__content">
                  <span className="kicker">
                    {t({ en: "BICF Foundation", fr: "Fondation BICF" })}
                  </span>
                  <h3 className="h2 pillar__label">{t(p.label)}</h3>
                  <p className="lead pillar__body">{t(p.body)}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ==================================================== VALUES light */}
      <section className="values surface surface--light sheet" aria-labelledby="values-title">
        <div className="container">
          <header className="section-head">
            <div>
              <Reveal as="span" className="kicker">
                {t({ en: "Core Values", fr: "Valeurs fondamentales" })}
              </Reveal>
              <Reveal as="h2" id="values-title" className="h2" delay={0.05}>
                {t({
                  en: "Eight commitments that shape our work.",
                  fr: "Huit engagements qui façonnent notre travail.",
                })}
              </Reveal>
            </div>
          </header>

          <ul className="values__grid">
            {values.map((v, i) => (
              <Reveal as="li" className="value" key={v.title.en} delay={(i % 2) * 0.06}>
                <h3 className="h3 value__title">{t(v.title)}</h3>
                <p className="value__body">{t(v.body)}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* ================================================== SERVICES tint */}
      <section className="what surface surface--tint" aria-labelledby="what-title">
        <div className="container">
          <header className="section-head">
            <div>
              <Reveal as="span" className="kicker">
                {t({ en: "What We Do", fr: "Ce que nous faisons" })}
              </Reveal>
              <Reveal as="h2" id="what-title" className="h2" delay={0.05}>
                {t({
                  en: "Programs and services for the diverse needs of Black immigrants.",
                  fr: "Des programmes et services pour les besoins variés des immigrants noirs.",
                })}
              </Reveal>
            </div>
            <Reveal as="div" className="section-head__aside" delay={0.1}>
              <p className="body">
                {t({
                  en: "Each service is tailored to promote empowerment, inclusion, and self sufficiency.",
                  fr: "Chaque service est conçu pour favoriser l'autonomisation, l'inclusion et l'autonomie.",
                })}
              </p>
              <Link to="/services" className="link-arrow">
                {t({ en: "See all 13 programs", fr: "Voir les 13 programmes" })}
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </Reveal>
          </header>

          <ol className="what__list">
            {services.map((s, i) => (
              <Reveal as="li" className="what__item" key={s.title.en} delay={(i % 3) * 0.05}>
                <div>
                  <h3 className="h3 what__title">{t(s.title)}</h3>
                  <p className="body what__body">{t(s.body)}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* =================================================== GALLERY dark */}
      <section className="gallery surface surface--dark" aria-labelledby="gallery-title">
        <div className="container">
          <header className="section-head">
            <div>
              <Reveal as="span" className="kicker">
                {t({ en: "Moments", fr: "Moments" })}
              </Reveal>
              <Reveal as="h2" id="gallery-title" className="h2" delay={0.05}>
                {t({ en: "In the community.", fr: "Dans la communauté." })}
              </Reveal>
            </div>
          </header>

          <ul className="gallery__grid">
            {gallery.map((item, i) => (
              <Reveal as="li" key={item.src} delay={(i % 3) * 0.07}>
                <figure className="shot">
                  <img
                    src={item.src}
                    alt={t(item.label)}
                    width={1200}
                    height={1500}
                    loading="lazy"
                    decoding="async"
                  />
                  <figcaption className="shot__cap">
                    <span className="shot__label">{t(item.label)}</span>
                    <span className="shot__text">{t(item.caption)}</span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

    </main>
  );
}
