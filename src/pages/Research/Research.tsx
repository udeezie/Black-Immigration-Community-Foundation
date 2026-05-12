import { useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import "./Research.scss";

const IMAGES = [
  "/r1.png",
  "/r2.png",
  "/r3.png",
  "/r4.png",
  "/r5.png",
  "/r6.png",
];

function splitWords(el: HTMLElement) {
  const text = el.dataset.scrollText || el.textContent || "";
  el.innerHTML = "";
  const words = text.split(" ");
  words.forEach((word, i, arr) => {
    const span = document.createElement("span");
    span.className = "r__w";
    span.style.setProperty("--wi", String(i));
    span.textContent = word;
    el.appendChild(span);
    if (i < arr.length - 1) el.appendChild(document.createTextNode(" "));
  });
  el.dataset.wordCount = String(words.length);
}

export default function Research() {
  const mainRef = useRef<HTMLElement>(null);
  const rafRef = useRef(0);
  const mobileRef = useRef(window.innerWidth < 900);

  useEffect(() => {
    document.title = "Research | Black Immigrants Community Foundation";
    const desc =
      "BICF research uses intersectional and C Factor frameworks to study, support, and advocate for Black immigrants.";
    let meta = document.querySelector<HTMLMetaElement>(
      'meta[name="description"]',
    );
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", desc);
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  const setupWords = useCallback(() => {
    const root = mainRef.current;
    if (!root) return;
    root.querySelectorAll<HTMLElement>("[data-scroll-text]").forEach((el) => {
      if (!el.dataset.wordCount) splitWords(el);
    });
  }, []);

  useEffect(() => {
    setupWords();

    const onResize = () => {
      mobileRef.current = window.innerWidth < 900;
    };
    window.addEventListener("resize", onResize);

    const onScroll = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const root = mainRef.current;
        if (!root) return;
        const vh = window.innerHeight;
        const mobile = mobileRef.current;

        root
          .querySelectorAll<HTMLElement>("[data-scroll-text]")
          .forEach((el) => {
            const rect = el.getBoundingClientRect();
            const count = parseInt(el.dataset.wordCount || "0", 10);
            if (count === 0) return;
            if (rect.bottom < -100 || rect.top > vh + 100) return;

            const scrollRange = vh * 0.85;
            const progress = Math.max(
              0,
              Math.min(1, (vh - rect.top) / scrollRange),
            );
            const activeIndex = progress * count;

            el.querySelectorAll<HTMLElement>(".r__w").forEach((w, i) => {
              const dist = activeIndex - i;
              let opacity: number;
              if (dist < 0) {
                opacity = 0.08;
              } else if (dist < 1) {
                opacity = 0.08 + dist * 0.92;
              } else {
                opacity = 1;
              }
              w.style.opacity = String(opacity);
            });
          });

        if (!mobile) {
          root
            .querySelectorAll<HTMLElement>("[data-img-section]")
            .forEach((section) => {
              const imgs =
                section.querySelectorAll<HTMLElement>("[data-img-reveal]");
              const sRect = section.getBoundingClientRect();
              const rawProgress = (vh - sRect.top) / (vh * 0.8);
              const progress = Math.max(0, Math.min(1, rawProgress));

              imgs.forEach((img) => {
                const dir = img.dataset.imgReveal;
                const tx =
                  dir === "left" ? (1 - progress) * -100 : (1 - progress) * 100;
                const ry =
                  dir === "left" ? (1 - progress) * 5 : (1 - progress) * -5;
                const s = 0.94 + progress * 0.06;
                img.style.transform = `perspective(1200px) translate3d(${tx}%, 0, 0) rotateY(${ry}deg) scale(${s})`;
              });
            });
        }
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(rafRef.current);
    };
  }, [setupWords]);

  return (
    <main className="r" ref={mainRef}>
      <div className="r__bg" aria-hidden="true">
        <div className="r__bg-grid" />
        <div className="r__bg-orb r__bg-orb--1" />
        <div className="r__bg-orb r__bg-orb--2" />
        <div className="r__bg-orb r__bg-orb--3" />
        <div className="r__bg-orb r__bg-orb--4" />
        <div className="r__bg-orb r__bg-orb--5" />
        <div className="r__bg-dots" />
        <div className="r__bg-dots r__bg-dots--2" />
        <div className="r__bg-ring r__bg-ring--1" />
        <div className="r__bg-ring r__bg-ring--2" />
        <div className="r__bg-ring r__bg-ring--3" />
        <div className="r__bg-line r__bg-line--h1" />
        <div className="r__bg-line r__bg-line--h2" />
        <div className="r__bg-line r__bg-line--v1" />
      </div>

      <h1 className="r__sr-only">
        Research at the Black Immigrants Community Foundation
      </h1>

      <section className="r__opening">
        <div className="r__opening-inner">
          <div className="r__research-label">RESEARCH / FINDINGS</div>
          <h2
            className="r__opening-title"
            data-scroll-text="Our Research Approach"
          >
            Our Research Approach
          </h2>
          <p
            className="r__opening-sub"
            data-scroll-text="Evidence based insights driving meaningful change for Black immigrants across communities"
          >
            Evidence based insights driving meaningful change for Black
            immigrants across communities
          </p>
        </div>
      </section>

      <section className="r__narrative">
        <div className="r__narrative-inner">
          <p
            className="r__narrative-block"
            data-scroll-text="At the Black Immigrants Community Foundation, research plays a vital role in how we understand, support, and advocate for Black immigrants. Our studies help shape programs, influence policies, and amplify the lived experiences of the communities we serve."
          >
            At the Black Immigrants Community Foundation, research plays a vital
            role in how we understand, support, and advocate for Black
            immigrants. Our studies help shape programs, influence policies, and
            amplify the lived experiences of the communities we serve.
          </p>
          <p
            className="r__narrative-block"
            data-scroll-text="We are committed to producing research that is community centered, culturally grounded, and actionable. Every study we undertake is designed to create real, measurable impact for Black immigrant communities."
          >
            We are committed to producing research that is community centered,
            culturally grounded, and actionable. Every study we undertake is
            designed to create real, measurable impact for Black immigrant
            communities.
          </p>
          <p
            className="r__narrative-block"
            data-scroll-text="Our work bridges the gap between academic research and community needs, ensuring that the voices and experiences of Black immigrants are not just documented but actively drive the conversation forward."
          >
            Our work bridges the gap between academic research and community
            needs, ensuring that the voices and experiences of Black immigrants
            are not just documented but actively drive the conversation forward.
          </p>
        </div>
      </section>

      <section
        className="r__panel"
        data-img-section
        aria-labelledby="r-intersect"
      >
        <div className="r__panel-media">
          <div className="r__panel-img" data-img-reveal="left">
            <img src={IMAGES[0]} alt="" loading="lazy" />
          </div>
        </div>
        <div className="r__panel-body">
          <span className="r__panel-num">01</span>
          <h2
            className="r__panel-title"
            id="r-intersect"
            data-scroll-text="Centering Intersectionality"
          >
            Centering Intersectionality
          </h2>
          <p
            className="r__panel-text"
            data-scroll-text="Our research is guided by an intersectional framework that recognizes how multiple aspects of identity, including race, gender, class, and immigration status, intersect to shape people's experiences."
          >
            Our research is guided by an intersectional framework that
            recognizes how multiple aspects of identity, including race, gender,
            class, and immigration status, intersect to shape people's
            experiences.
          </p>
          <p
            className="r__panel-text"
            data-scroll-text="Black immigrants face unique and overlapping challenges that cannot be examined through a single lens. BICF ensures our findings reflect the realities of those most affected by systemic inequality."
          >
            Black immigrants face unique and overlapping challenges that cannot
            be examined through a single lens. BICF ensures our findings reflect
            the realities of those most affected by systemic inequality.
          </p>
        </div>
      </section>

      <section
        className="r__panel r__panel--right"
        data-img-section
        aria-labelledby="r-cfactor"
      >
        <div className="r__panel-body">
          <span className="r__panel-num">02</span>
          <h2
            className="r__panel-title"
            id="r-cfactor"
            data-scroll-text='The "C Factor" Framework'
          >
            The "C Factor" Framework
          </h2>
          <p
            className="r__panel-text"
            data-scroll-text="We apply the C Factor, an approach that recognizes race as a constant factor influencing all other aspects of identity. Even when other variables remain the same, race continues to impact access, opportunity, and outcomes."
          >
            We apply the C Factor, an approach that recognizes race as a
            constant factor influencing all other aspects of identity. Even when
            other variables remain the same, race continues to impact access,
            opportunity, and outcomes.
          </p>
          <p
            className="r__panel-text"
            data-scroll-text="This framework helps us uncover how racial bias intensifies inequality and shapes the daily lives of Black immigrants across communities."
          >
            This framework helps us uncover how racial bias intensifies
            inequality and shapes the daily lives of Black immigrants across
            communities.
          </p>
        </div>
        <div className="r__panel-media">
          <div className="r__panel-img" data-img-reveal="right">
            <img src={IMAGES[1]} alt="" loading="lazy" />
          </div>
        </div>
      </section>

      <section className="r__statement">
        <div className="r__statement-inner">
          <h2
            className="r__statement-text"
            data-scroll-text="Race Remains Constant"
          >
            Race Remains Constant
          </h2>
          <p
            className="r__statement-sub"
            data-scroll-text="Even when all other variables remain the same, race continues to shape access, opportunity, and outcomes for Black immigrants."
          >
            Even when all other variables remain the same, race continues to
            shape access, opportunity, and outcomes for Black immigrants.
          </p>
        </div>
      </section>

      <section
        className="r__converge"
        data-img-section
        aria-labelledby="r-drives"
      >
        <div className="r__converge-media">
          <div className="r__converge-img" data-img-reveal="left">
            <img src={IMAGES[2]} alt="" loading="lazy" />
          </div>
          <div className="r__converge-img" data-img-reveal="right">
            <img src={IMAGES[3]} alt="" loading="lazy" />
          </div>
        </div>
        <div className="r__converge-body">
          <h2
            className="r__converge-title"
            id="r-drives"
            data-scroll-text="Research That Drives Change"
          >
            Research That Drives Change
          </h2>
          <p
            className="r__converge-text"
            data-scroll-text="Every study we publish is designed to translate into action, shaping programs, informing policy, and centering the voices of Black immigrant communities in the decisions that affect them."
          >
            Every study we publish is designed to translate into action, shaping
            programs, informing policy, and centering the voices of Black
            immigrant communities in the decisions that affect them.
          </p>
        </div>
      </section>

      <section className="r__goals" aria-labelledby="r-goals">
        <div className="r__goals-header">
          <h2
            className="r__goals-title"
            id="r-goals"
            data-scroll-text="Our Research Goals"
          >
            Our Research Goals
          </h2>
          <p
            className="r__goals-sub"
            data-scroll-text="Through our intersectional and C Factor frameworks, BICF's research aims to:"
          >
            Through our intersectional and C Factor frameworks, BICF's research
            aims to:
          </p>
        </div>
        <div className="r__goals-grid">
          {[
            {
              n: "01",
              title: "Reveal Systemic Inequality",
              body: "Uncover the layered effects of systemic inequality on Black immigrants through comprehensive data analysis and community driven research.",
            },
            {
              n: "02",
              title: "Design Responsive Programs",
              body: "Create programs that are culturally and contextually responsive to the unique needs and lived realities of Black immigrants.",
            },
            {
              n: "03",
              title: "Advocate for Policy Change",
              body: "Push for policies that address root causes, not just surface level issues affecting Black immigrant communities across the country.",
            },
            {
              n: "04",
              title: "Elevate Lived Experiences",
              body: "Amplify community knowledge and lived experiences as valid, essential, and transformative evidence for lasting change.",
            },
          ].map((goal) => (
            <article className="r__goal" key={goal.n}>
              <span className="r__goal-num">{goal.n}</span>
              <h3 className="r__goal-card-title" data-scroll-text={goal.title}>
                {goal.title}
              </h3>
              <p className="r__goal-body" data-scroll-text={goal.body}>
                {goal.body}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="r__closing" data-img-section>
        <div className="r__closing-media">
          <img src={IMAGES[4]} alt="" loading="lazy" />
        </div>
        <div className="r__closing-content">
          <article className="r__closing-block">
            <h2
              className="r__closing-heading"
              data-scroll-text="Our Commitment"
            >
              Our Commitment
            </h2>
            <p
              className="r__closing-text"
              data-scroll-text="We commit to research grounded in community knowledge, driven by the realities of Black immigrants and accountable to the communities we serve."
            >
              We commit to research grounded in community knowledge, driven by
              the realities of Black immigrants and accountable to the
              communities we serve.
            </p>
            <div className="r__closing-actions">
              <Link to="/partner" className="r__btn">
                Partner With Us
              </Link>
            </div>
          </article>
          <article className="r__closing-block">
            <h2
              className="r__closing-heading"
              data-scroll-text="Join Our Research Initiatives"
            >
              Join Our Research Initiatives
            </h2>
            <p
              className="r__closing-text"
              data-scroll-text="Whether you are a researcher, partner organization, or community member with a story to share, your participation strengthens our work and amplifies impact."
            >
              Whether you are a researcher, partner organization, or community
              member with a story to share, your participation strengthens our
              work and amplifies impact.
            </p>
            <div className="r__closing-actions">
              <Link to="/research/current" className="r__btn">
                Current Studies
              </Link>
              <Link to="/research/studies" className="r__btn r__btn--ghost">
                Read Our Studies
              </Link>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
