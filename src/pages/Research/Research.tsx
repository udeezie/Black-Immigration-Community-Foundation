/* Research page.

   The source material is a long argument, so it is deliberately broken into
   pieces a reader can enter at any point: a pulled quote, three short notes,
   two framework panels, a full-bleed statement, then a board of goals. */

import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useLanguage, type Lang } from "../../context/LanguageContext";
import Reveal from "../../components/Reveal/Reveal";
import "./Research.scss";

type Bi = Record<Lang, string>;

/* Both photographs are tall portraits dropped into a landscape card, so a
   centred crop cuts the subject's head. `focus` is the object-position that
   keeps each face in frame; set it per image if the photography changes. */
const FRAMEWORKS: {
  n: string;
  label: Bi;
  title: Bi;
  body: Bi;
  image: string;
  focus: string;
}[] = [
  {
    n: "01",
    label: { en: "Framework", fr: "Cadre" },
    title: {
      en: "Centering Intersectionality",
      fr: "Au cœur de l'intersectionnalité",
    },
    body: {
      en: "Our research is guided by an intersectional framework that recognizes how multiple aspects of identity such as race, gender, class, and immigration status intersect to shape people's experiences. We understand that Black immigrants face unique and overlapping challenges that cannot be examined through a single lens. By using this approach, BICF ensures that our findings and programs truly reflect the realities of those most affected by systemic inequality.",
      fr: "Nos recherches s'appuient sur un cadre intersectionnel qui reconnaît comment de multiples aspects de l'identité, comme la race, le genre, la classe sociale et le statut d'immigration, se croisent pour façonner les expériences des personnes. Les immigrants noirs font face à des défis uniques et imbriqués qui ne peuvent être examinés sous un seul angle. Par cette approche, la BICF veille à ce que ses constats et ses programmes reflètent véritablement les réalités des personnes les plus touchées par les inégalités systémiques.",
    },
    image: "/r1.webp",
    focus: "50% 16%",
  },
  {
    n: "02",
    label: { en: "Framework", fr: "Cadre" },
    title: {
      en: "The C Factor Framework",
      fr: "Le cadre du Facteur C",
    },
    body: {
      en: "At BICF, we apply the C Factor, an approach that recognizes race as a constant factor influencing all other aspects of identity. Even when other variables remain the same, race continues to impact access, opportunity, and outcomes. This framework helps us uncover how racial bias intensifies inequality and shapes the daily lives of Black immigrants.",
      fr: "À la BICF, nous appliquons le Facteur C, une approche qui reconnaît la race comme un facteur constant influençant tous les autres aspects de l'identité. Même lorsque les autres variables demeurent identiques, la race continue d'influer sur l'accès, les possibilités et les résultats. Ce cadre nous aide à mettre au jour comment les préjugés raciaux amplifient les inégalités et façonnent la vie quotidienne des immigrants noirs.",
    },
    image: "/r2.webp",
    focus: "50% 28%",
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
      en: "Uncover the layered effects of systemic inequality on Black immigrants through comprehensive data analysis.",
      fr: "Mettre au jour les effets multiples des inégalités systémiques sur les immigrants noirs grâce à une analyse approfondie des données.",
    },
  },
  {
    n: "02",
    title: {
      en: "Design Responsive Programs",
      fr: "Concevoir des programmes adaptés",
    },
    body: {
      en: "Create programs that are culturally and contextually responsive to the unique needs of Black immigrants.",
      fr: "Créer des programmes adaptés sur le plan culturel et contextuel aux besoins uniques des immigrants noirs.",
    },
  },
  {
    n: "03",
    title: {
      en: "Advocate for Policy Change",
      fr: "Plaider pour des changements de politiques",
    },
    body: {
      en: "Push for policies that address root causes, not just surface level issues affecting Black immigrants.",
      fr: "Promouvoir des politiques qui s'attaquent aux causes profondes, et pas seulement aux problèmes de surface touchant les immigrants noirs.",
    },
  },
  {
    n: "04",
    title: {
      en: "Elevate Lived Experiences",
      fr: "Valoriser les expériences vécues",
    },
    body: {
      en: "Amplify community knowledge and lived experiences as valid and essential evidence for change.",
      fr: "Amplifier les savoirs communautaires et les expériences vécues en tant que données valables et essentielles pour le changement.",
    },
  },
];

/* These three paragraphs used to sit stacked in the JSX. Held as data so
   they can be laid out as columns rather than a run of prose. */
const WHY_NOTES: Bi[] = [
  {
    en: "Our studies help shape programs, influence policies, and amplify the lived experiences of the communities we serve.",
    fr: "Nos études contribuent à façonner les programmes, à influencer les politiques et à amplifier les expériences vécues des communautés que nous servons.",
  },
  {
    en: "Every study we undertake is designed to create real, measurable impact for Black immigrant communities.",
    fr: "Chaque étude que nous menons est conçue pour générer un impact réel et mesurable pour les communautés d'immigrants noirs.",
  },
  {
    en: "Our work bridges the gap between academic research and community needs, ensuring that the voices and experiences of Black immigrants are not just documented but actively drive the conversation forward.",
    fr: "Notre travail jette un pont entre la recherche universitaire et les besoins de la communauté, en veillant à ce que les voix et les expériences des immigrants noirs soient non seulement documentées, mais qu'elles fassent activement avancer la conversation.",
  },
];

export default function Research() {
  const { t, lang } = useLanguage();

  useEffect(() => {
    document.title =
      lang === "fr"
        ? "Recherche | Black Immigrants Community Foundation"
        : "Research | Black Immigrants Community Foundation";

    const desc = t({
      en: "BICF research uses intersectional and C Factor frameworks to study, support, and advocate for Black immigrants.",
      fr: "La recherche de la BICF utilise les cadres intersectionnel et du Facteur C pour étudier, soutenir et défendre les immigrants noirs.",
    });
    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", desc);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  return (
    <main className="research" id="main">
      {/* Hero */}
      <section className="page-hero surface surface--dark" aria-labelledby="res-title">
        <div className="page-hero__glow" aria-hidden="true" />
        <div className="container page-hero__inner">
          <Reveal as="span" className="kicker" y={12}>
            {t({ en: "Our Research Approach", fr: "Notre approche de recherche" })}
          </Reveal>
          <Reveal
            as="h1"
            id="res-title"
            className="h-display page-hero__title"
            delay={0.05}
          >
            {t({
              en: "Evidence based insights driving ",
              fr: "Des constats probants qui génèrent ",
            })}
            <span className="accent-word">
              {t({
                en: "meaningful change for Black immigrants",
                fr: "un changement réel pour les immigrants noirs",
              })}
            </span>
          </Reveal>
          <Reveal as="p" className="lead page-hero__lead" delay={0.1}>
            {t({
              en: "Research that helps us understand, support, and advocate for Black immigrants.",
              fr: "Une recherche qui nous aide à comprendre, à soutenir et à défendre les immigrants noirs.",
            })}
          </Reveal>
        </div>
      </section>

      {/* Why research */}
      <section className="why surface surface--light sheet" aria-labelledby="why-title">
        <div className="container">
          <div className="why__top">
            <div className="why__copy">
              <Reveal as="span" className="kicker">
                {t({ en: "Why Research", fr: "Pourquoi la recherche" })}
              </Reveal>
              <Reveal as="h2" id="why-title" className="h2" delay={0.05}>
                {t({
                  en: "Informing Action Through Research.",
                  fr: "Éclairer l'action par la recherche.",
                })}
              </Reveal>
              <Reveal as="p" className="lead why__lead" delay={0.1}>
                {t({
                  en: "At the Black Immigrants Community Foundation, research plays a vital role in how we understand, support, and advocate for Black immigrants.",
                  fr: "À la Black Immigrants Community Foundation, la recherche joue un rôle essentiel dans notre façon de comprendre, de soutenir et de défendre les immigrants noirs.",
                })}
              </Reveal>
            </div>

            <Reveal as="figure" className="why__media" delay={0.12} y={26}>
              <img
                src="/r3.webp"
                alt=""
                width={900}
                height={1100}
                loading="lazy"
                decoding="async"
              />
            </Reveal>
          </div>

          <Reveal as="blockquote" className="why__quote" delay={0.06}>
            {t({
              en: "We are committed to producing research that is community centered, culturally grounded, and actionable.",
              fr: "Nous nous engageons à produire une recherche centrée sur la communauté, ancrée dans la culture et porteuse d'action.",
            })}
          </Reveal>

          <ul className="why__notes">
            {WHY_NOTES.map((note, i) => (
              <Reveal as="li" className="note" key={note.en} delay={i * 0.07}>
                <p className="note__text">{t(note)}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Frameworks */}
      <section className="fws surface surface--tint" aria-labelledby="fw-title">
        <div className="container">
          <header className="section-head">
            <div>
              <Reveal as="span" className="kicker">
                {t({ en: "Methodology", fr: "Méthodologie" })}
              </Reveal>
              <Reveal as="h2" id="fw-title" className="h2" delay={0.05}>
                {t({ en: "How we study.", fr: "Notre façon d'étudier." })}
              </Reveal>
            </div>
            <Reveal as="div" className="section-head__aside" delay={0.1}>
              <p className="body">
                {t({
                  en: "Two frameworks shape every study we publish, making sure the people most affected are the ones we hear most clearly.",
                  fr: "Deux cadres façonnent chaque étude que nous publions, afin que les personnes les plus touchées soient celles que nous entendons le plus clairement.",
                })}
              </p>
            </Reveal>
          </header>

          <div className="fws__stack">
            {FRAMEWORKS.map((f, i) => (
              <Reveal
                as="article"
                className="fw"
                key={f.n}
                data-flip={i % 2 === 1 ? "true" : "false"}
                y={26}
              >
                <figure className="fw__media">
                  <img
                    src={f.image}
                    alt=""
                    width={1200}
                    height={1400}
                    loading="lazy"
                    decoding="async"
                    style={{ objectPosition: f.focus }}
                  />
                  <figcaption className="fw__badge">
                    <span className="fw__badge-label">{t(f.label)}</span>
                  </figcaption>
                </figure>

                <div className="fw__body">
                  <h3 className="h2 fw__title">{t(f.title)}</h3>
                  <p className="fw__text">{t(f.body)}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Statement */}
      <section className="stmt surface surface--dark" aria-labelledby="stmt-title">
        <div className="stmt__bg" aria-hidden="true">
          <img
            src="/r4.webp"
            alt=""
            width={1600}
            height={900}
            loading="lazy"
            decoding="async"
          />
          <span className="stmt__scrim" />
        </div>
        <div className="container container--narrow">
          <Reveal as="div" className="stmt__inner">
            <h2 id="stmt-title" className="h-display stmt__text">
              {t({ en: "Race Remains Constant", fr: "La race demeure constante" })}
            </h2>
            <p className="lead stmt__sub">
              {t({
                en: "Even when other variables remain the same, race continues to impact access, opportunity, and outcomes.",
                fr: "Même lorsque les autres variables demeurent identiques, la race continue d'influer sur l'accès, les possibilités et les résultats.",
              })}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Goals */}
      <section className="goals surface surface--light sheet" aria-labelledby="goals-title">
        <div className="container">
          <header className="section-head">
            <div>
              <Reveal as="span" className="kicker">
                {t({ en: "Our Goals", fr: "Nos objectifs" })}
              </Reveal>
              <Reveal as="h2" id="goals-title" className="h2" delay={0.05}>
                {t({
                  en: "What we're building toward.",
                  fr: "Ce que nous bâtissons.",
                })}
              </Reveal>
            </div>
            <Reveal as="div" className="section-head__aside" delay={0.1}>
              <p className="body">
                {t({
                  en: "Through our intersectional and C Factor frameworks, BICF's research aims to:",
                  fr: "À travers nos cadres intersectionnel et du Facteur C, la recherche de la BICF vise à :",
                })}
              </p>
            </Reveal>
          </header>

          <ol className="goals__grid">
            {GOALS.map((g, i) => (
              <Reveal as="li" className="goal" key={g.n} delay={i * 0.06} y={18}>
                <h3 className="goal__title">{t(g.title)}</h3>
                <p className="goal__text">{t(g.body)}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Commitment */}
      <section className="commitment surface surface--dark" aria-labelledby="commit-title">
        <div className="container">
          <div className="commitment__grid">
            <Reveal as="figure" className="commitment__media" y={26}>
              <img
                src="/r5.webp"
                alt=""
                width={1200}
                height={1400}
                loading="lazy"
                decoding="async"
              />
            </Reveal>

            <div className="commitment__copy">
              <Reveal as="span" className="kicker">
                {t({ en: "What's Next", fr: "La suite" })}
              </Reveal>
              <Reveal as="h2" id="commit-title" className="h2" delay={0.05}>
                {t({
                  en: "Join Our Research Initiatives.",
                  fr: "Participez à nos initiatives de recherche.",
                })}
              </Reveal>
              <Reveal as="p" className="lead" delay={0.1}>
                {t({
                  en: "BICF's commitment to intersectional research strengthens our mission to build a just, inclusive society where Black immigrants are fully seen, supported, and empowered to thrive.",
                  fr: "L'engagement de la BICF envers la recherche intersectionnelle renforce notre mission de bâtir une société juste et inclusive où les immigrants noirs sont pleinement vus, soutenus et outillés pour s'épanouir.",
                })}
              </Reveal>
              <Reveal as="p" className="body" delay={0.14}>
                {t({
                  en: "Help us build better understanding and create meaningful change through evidence based research.",
                  fr: "Aidez-nous à bâtir une meilleure compréhension et à créer un changement réel grâce à une recherche fondée sur des données probantes.",
                })}
              </Reveal>
              <Reveal as="div" className="commitment__cta" delay={0.18}>
                <Link to="/contact" className="btn btn--primary">
                  {t({ en: "Get In Touch", fr: "Nous Contacter" })}
                </Link>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
