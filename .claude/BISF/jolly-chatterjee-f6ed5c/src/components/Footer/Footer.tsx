import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail } from 'lucide-react'
import './Footer.scss'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">

      <div className="footer__body">
        <div className="footer__body-inner">

          <div className="footer__left">
            <div className="footer__cta">
              <span className="footer__label">Contact</span>
              <h2 className="footer__headline">
                Let's Make<br />a Difference
              </h2>
              <div className="footer__actions">
                <Link to="/volunteer" className="footer__btn">Volunteer With Us</Link>
                <Link to="/donate" className="footer__btn footer__btn--ghost">Donate</Link>
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
              <span className="footer__label">Follow Us</span>
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
          </div>

          <nav className="footer__nav" aria-label="Footer navigation">
            <div className="footer__nav-col">
              <span className="footer__label">Main</span>
              <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/services">Services</Link></li>
                <li><Link to="/research">Research</Link></li>
                <li><Link to="/careers">Careers</Link></li>
                <li><Link to="/contact">Contact</Link></li>
              </ul>
            </div>

            <div className="footer__nav-col">
              <span className="footer__label">Programs</span>
              <ul>
                <li><Link to="/services">Legal Aid</Link></li>
                <li><Link to="/services">Education</Link></li>
                <li><Link to="/services">Employment</Link></li>
                <li><Link to="/services">Mental Health</Link></li>
                <li><Link to="/services">Youth and Family</Link></li>
                <li><Link to="/services">Financial Aid</Link></li>
                <li><Link to="/services">Crisis Support</Link></li>
              </ul>
            </div>
          </nav>

        </div>
      </div>

      <div className="footer__bar">
        <div className="footer__bar-inner">
          <p>&copy; {year}. Black Immigrants Community Foundation. All Rights Reserved.</p>
          <nav className="footer__legal" aria-label="Legal links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Use</a>
            <a href="#">Accessibility</a>
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
