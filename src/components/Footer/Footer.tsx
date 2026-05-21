import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'
import './Footer.scss'

export default function Footer() {
  const year = new Date().getFullYear()
  const { lang, setLang, t } = useLanguage()

  return (
    <footer className="footer">

      <div className="footer__body">
        <div className="footer__body-inner">

          <div className="footer__left">
            <div className="footer__cta">
              <span className="footer__label">{t({ en: 'Contact', fr: 'Contact' })}</span>
              <h2 className="footer__headline">
                {t({
                  en: <>Let's Make<br />a Difference</>,
                  fr: <>Faisons une<br />Différence</>,
                })}
              </h2>
              <div className="footer__actions">
                <Link to="/volunteer" className="footer__btn">
                  {t({ en: 'Volunteer With Us', fr: 'Devenez Bénévole' })}
                </Link>
                <Link to="/contact" className="footer__btn footer__btn--ghost">
                  {t({ en: 'Get In Touch', fr: 'Nous Contacter' })}
                </Link>
              </div>
            </div>

            <address className="footer__address">
              <a
                href="https://maps.google.com/?q=190+Harwood+Avenue+South+Ajax+Ontario"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MapPin size={13} strokeWidth={1.5} />
                190 Harwood Avenue South, Ajax, Ontario L1S 2H6
              </a>
              <a href="tel:+19059313776">
                <Phone size={13} strokeWidth={1.5} />
                905 931 3776
              </a>
              <a href="mailto:info@blackimmigrantscommunityfoundation.com">
                <Mail size={13} strokeWidth={1.5} />
                info@blackimmigrantscommunityfoundation.com
              </a>
            </address>

            <div className="footer__social-section">
              <span className="footer__label">{t({ en: 'Follow Us', fr: 'Suivez-nous' })}</span>
              <ul className="footer__social-list">
                <li className="footer__social-item">
                  <a href="#" aria-label="Instagram" data-social="instagram" target="_blank" rel="noopener noreferrer">
                    <div className="footer__social-fill" />
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="17" height="17">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                      <circle cx="12" cy="12" r="4" />
                      <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
                    </svg>
                  </a>
                  <div className="footer__social-tooltip">Instagram</div>
                </li>
                <li className="footer__social-item">
                  <a href="#" aria-label="Facebook" data-social="facebook" target="_blank" rel="noopener noreferrer">
                    <div className="footer__social-fill" />
                    <svg viewBox="0 0 24 24" fill="currentColor" width="17" height="17">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                    </svg>
                  </a>
                  <div className="footer__social-tooltip">Facebook</div>
                </li>
                <li className="footer__social-item">
                  <a href="#" aria-label="X" data-social="x" target="_blank" rel="noopener noreferrer">
                    <div className="footer__social-fill" />
                    <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>
                  <div className="footer__social-tooltip">X</div>
                </li>
                <li className="footer__social-item">
                  <a href="#" aria-label="LinkedIn" data-social="linkedin" target="_blank" rel="noopener noreferrer">
                    <div className="footer__social-fill" />
                    <svg viewBox="0 0 24 24" fill="currentColor" width="17" height="17">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
                      <rect x="2" y="9" width="4" height="12" />
                      <circle cx="4" cy="4" r="2" />
                    </svg>
                  </a>
                  <div className="footer__social-tooltip">LinkedIn</div>
                </li>
              </ul>
            </div>

            <div className="footer__lang">
              <span className="footer__label">{t({ en: 'Language', fr: 'Langue' })}</span>
              <div
                className="footer__lang-switch"
                role="group"
                aria-label={t({ en: 'Select language', fr: 'Choisir la langue' })}
              >
                <button
                  type="button"
                  className={`footer__lang-btn ${lang === 'en' ? 'footer__lang-btn--active' : ''}`}
                  onClick={() => setLang('en')}
                  aria-pressed={lang === 'en'}
                >
                  <GlobeIcon />
                  English
                </button>
                <span className="footer__lang-divider" aria-hidden="true" />
                <button
                  type="button"
                  className={`footer__lang-btn ${lang === 'fr' ? 'footer__lang-btn--active' : ''}`}
                  onClick={() => setLang('fr')}
                  aria-pressed={lang === 'fr'}
                >
                  Français
                </button>
              </div>
            </div>
          </div>

          <nav className="footer__nav" aria-label={t({ en: 'Footer navigation', fr: 'Navigation du pied de page' })}>
            <div className="footer__nav-col">
              <span className="footer__label">{t({ en: 'Main', fr: 'Menu' })}</span>
              <ul>
                <li><Link to="/">{t({ en: 'Home', fr: 'Accueil' })}</Link></li>
                <li><Link to="/about">{t({ en: 'About Us', fr: 'À Propos' })}</Link></li>
                <li><Link to="/services">{t({ en: 'Services', fr: 'Services' })}</Link></li>
                <li><Link to="/research">{t({ en: 'Research', fr: 'Recherche' })}</Link></li>
                <li><Link to="/careers">{t({ en: 'Careers', fr: 'Carrières' })}</Link></li>
                <li><Link to="/contact">{t({ en: 'Contact', fr: 'Contact' })}</Link></li>
              </ul>
            </div>

            <div className="footer__nav-col">
              <span className="footer__label">{t({ en: 'Programs', fr: 'Programmes' })}</span>
              <ul>
                <li><Link to="/services">{t({ en: 'Legal Aid', fr: 'Aide Juridique' })}</Link></li>
                <li><Link to="/services">{t({ en: 'Education', fr: 'Éducation' })}</Link></li>
                <li><Link to="/services">{t({ en: 'Employment', fr: 'Emploi' })}</Link></li>
                <li><Link to="/services">{t({ en: 'Mental Health', fr: 'Santé Mentale' })}</Link></li>
                <li><Link to="/services">{t({ en: 'Youth and Family', fr: 'Jeunesse et Famille' })}</Link></li>
                <li><Link to="/services">{t({ en: 'Financial Aid', fr: 'Aide Financière' })}</Link></li>
                <li><Link to="/services">{t({ en: 'Crisis Support', fr: 'Aide d\'Urgence' })}</Link></li>
              </ul>
            </div>
          </nav>

        </div>
      </div>

      <div className="footer__bar">
        <div className="footer__bar-inner">
          <p>
            {t({
              en: `© ${year}. Black Immigrants Community Foundation. All Rights Reserved.`,
              fr: `© ${year}. Black Immigrants Community Foundation. Tous Droits Réservés.`,
            })}
          </p>
          <nav className="footer__legal" aria-label={t({ en: 'Legal links', fr: 'Liens juridiques' })}>
            <a href="#">{t({ en: 'Privacy Policy', fr: 'Confidentialité' })}</a>
            <a href="#">{t({ en: 'Terms of Use', fr: 'Conditions d\'Utilisation' })}</a>
            <a href="#">{t({ en: 'Accessibility', fr: 'Accessibilité' })}</a>
          </nav>
        </div>
      </div>

      <div className="footer__mega">
        <div className="footer__mega-wrap">
          <span className="footer__mega-text">BICF</span>
          <span className="footer__mega-reg">®</span>
        </div>
      </div>

    </footer>
  )
}

function GlobeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9.5" />
      <path d="M2.5 12h19M12 2.5c2.6 2.6 4 6 4 9.5s-1.4 6.9-4 9.5c-2.6-2.6-4-6-4-9.5s1.4-6.9 4-9.5z" />
    </svg>
  )
}
