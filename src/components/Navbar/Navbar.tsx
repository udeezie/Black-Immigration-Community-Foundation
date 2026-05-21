import { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import styles from "./Navbar.module.scss";

const RADIUS = 24;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const mainLinks = [
  { label: { en: "Home", fr: "Accueil" }, to: "/", end: true },
  { label: { en: "About", fr: "À Propos" }, to: "/about", end: false },
  { label: { en: "Services", fr: "Services" }, to: "/services", end: false },
  { label: { en: "Research", fr: "Recherche" }, to: "/research", end: false },
  { label: { en: "Contact", fr: "Contact" }, to: "/contact", end: false },
];

const quickLinks = [
  { label: { en: "Volunteer", fr: "Bénévolat" }, to: "/volunteer" },
  { label: { en: "Careers", fr: "Carrières" }, to: "/careers" },
];

const socialLinks = [
  {
    name: "Instagram",
    href: "#",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        width="16"
        height="16"
      >
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    name: "Facebook",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    name: "X",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
];

export default function Navbar() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;

      setScrolled(currentY > 50);
      setScrollProgress(docHeight > 0 ? (currentY / docHeight) * 100 : 0);

      if (currentY > lastScrollY.current && currentY > 80) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      lastScrollY.current = currentY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const close = () => setOpen(false);
  const toggleMenu = () => setOpen((v) => !v);

  return (
    <>
      <header
        className={[
          styles.header,
          scrolled ? styles.headerScrolled : "",
          hidden && !open ? styles.headerHidden : "",
        ].join(" ")}
      >
        <div className={styles.headerInner}>
          <NavLink to="/" className={styles.logo} onClick={close} aria-label="Black Immigrants Community Foundation, Home">
            <svg
              className={styles.logoMark}
              viewBox="0 0 32 32"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M5 25 L12 25 L12 18 L19 18 L19 11 L26 11"
                stroke="currentColor"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="26" cy="11" r="3" fill="currentColor" />
            </svg>
            <span className={styles.logoWords}>
              <span className={styles.logoMain}>BICF</span>
              <span className={styles.logoSub}>
                Black Immigrants Community Foundation
              </span>
            </span>
          </NavLink>

          <label
            className={styles.hamburger}
            aria-label={
              open
                ? t({ en: "Close menu", fr: "Fermer le menu" })
                : t({ en: "Open menu", fr: "Ouvrir le menu" })
            }
          >
            <input type="checkbox" checked={open} onChange={toggleMenu} />
            <svg viewBox="0 0 32 32">
              <path
                className={styles.lineTopBottom}
                d="M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22"
              />
              <path className={styles.line} d="M7 16 27 16" />
            </svg>
          </label>
        </div>
      </header>

      <div
        className={`${styles.overlay} ${open ? styles.overlayOpen : ""}`}
        aria-hidden={!open}
      >
        {open && (
          <div className={styles.overlayGrid}>
            <div className={styles.cell}>
              <span className={styles.label}>{t({ en: "Main", fr: "Menu" })}</span>
              <nav className={styles.mainNav}>
                {mainLinks.map((link, i) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.end}
                    className={({ isActive }) =>
                      `${styles.mainLink} ${isActive ? styles.mainLinkActive : ""}`
                    }
                    onClick={close}
                    style={{ animationDelay: `${i * 70}ms` }}
                  >
                    {t(link.label)}
                  </NavLink>
                ))}
              </nav>
            </div>

            <div className={styles.cell}>
              <span className={styles.label}>
                {t({ en: "Quick Links", fr: "Liens Rapides" })}
              </span>
              <nav className={styles.quickNav}>
                {quickLinks.map((link, i) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) =>
                      `${styles.quickLink} ${isActive ? styles.quickLinkActive : ""}`
                    }
                    onClick={close}
                    style={{
                      animationDelay: `${(mainLinks.length + i) * 70}ms`,
                    }}
                  >
                    {t(link.label)}
                  </NavLink>
                ))}
              </nav>
            </div>

            <div className={styles.cell}>
              <span className={styles.label}>
                {t({ en: "Get In Touch", fr: "Nous Joindre" })}
              </span>
              <div className={styles.ctaGroup}>
                <NavLink
                  to="/contact"
                  className={styles.ctaFilled}
                  onClick={close}
                >
                  {t({ en: "Contact Us", fr: "Nous Contacter" })}
                </NavLink>
              </div>
            </div>

            <div className={`${styles.cell} ${styles.cellBottom}`}>
              <span className={styles.label}>
                {t({ en: "Follow Us", fr: "Suivez-nous" })}
              </span>
              <div className={styles.socialRow}>
                {socialLinks.map((s) => (
                  <a
                    key={s.name}
                    href={s.href}
                    aria-label={s.name}
                    className={styles.socialIcon}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            <div className={`${styles.cell} ${styles.cellBottom}`}>
              <span className={styles.label}>
                {t({ en: "Visit Us", fr: "Nous Visiter" })}
              </span>
              <address className={styles.address}>
                190 Harwood Avenue South,
                <br />
                Ajax Ontario L1S 2H6
              </address>
            </div>

            <div
              className={`${styles.cell} ${styles.cellBottom} ${styles.cellDecor}`}
            >
              <span className={styles.decorText}>BICF</span>
            </div>
          </div>
        )}
      </div>

      <button
        className={`${styles.backToTop} ${scrolled && !open ? styles.backToTopVisible : ""}`}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label={t({ en: "Back to top", fr: "Retour en haut" })}
      >
        <svg
          width="56"
          height="56"
          viewBox="0 0 56 56"
          className={styles.progressRing}
          aria-hidden="true"
        >
          <circle
            cx="28"
            cy="28"
            r={RADIUS}
            fill="none"
            stroke="rgba(13,13,13,0.1)"
            strokeWidth="1.5"
          />
          <circle
            cx="28"
            cy="28"
            r={RADIUS}
            fill="none"
            stroke="#0d0d0d"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={CIRCUMFERENCE * (1 - scrollProgress / 100)}
            transform="rotate(-90 28 28)"
            style={{ transition: "stroke-dashoffset 0.15s linear" }}
          />
        </svg>
        <svg
          className={styles.backToTopArrow}
          width="11"
          height="14"
          viewBox="0 0 11 14"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M5.5 13V1M1 5.5 5.5 1 10 5.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </>
  );
}
