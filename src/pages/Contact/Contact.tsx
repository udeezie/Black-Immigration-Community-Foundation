import {
  useEffect,
  useState,
  type ChangeEvent,
  type FocusEvent,
  type FormEvent,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLanguage, type Lang } from "../../context/LanguageContext";
import "./Contact.scss";

const ease = [0.25, 0.46, 0.45, 0.94] as const;

type Bi = Record<Lang, string>;

type Field = "name" | "email" | "phone" | "subject" | "inquiry" | "message";
type FormState = Record<Field, string>;
type FormErrors = Partial<Record<Field, Bi>>;

const initial: FormState = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  inquiry: "",
  message: "",
};

const inquiryOptions: { value: string; label: Bi }[] = [
  { value: "General Inquiry", label: { en: "General Inquiry", fr: "Demande générale" } },
  { value: "Volunteer", label: { en: "Volunteer", fr: "Bénévolat" } },
  { value: "Partnership", label: { en: "Partnership", fr: "Partenariat" } },
  { value: "Media", label: { en: "Media", fr: "Médias" } },
  { value: "Donation", label: { en: "Donation", fr: "Don" } },
  { value: "Other", label: { en: "Other", fr: "Autre" } },
];

const faqs: { q: Bi; a: Bi }[] = [
  {
    q: {
      en: "Who is eligible to access BICF's programs?",
      fr: "Qui peut accéder aux programmes de la BICF?",
    },
    a: {
      en: "Our work is for Black immigrants and their families navigating life in Canada. Whether you arrived last week, last decade, or were raised here as part of the second generation, you are welcome to reach out. We do not require proof of status to begin a conversation.",
      fr: "Notre travail s'adresse aux immigrants noirs et à leurs familles qui bâtissent leur vie au Canada. Que vous soyez arrivé la semaine dernière, il y a dix ans, ou que vous ayez grandi ici dans la deuxième génération, vous êtes les bienvenus. Aucune preuve de statut n'est exigée pour entamer une conversation.",
    },
  },
  {
    q: {
      en: "Are your services free of charge?",
      fr: "Vos services sont-ils gratuits?",
    },
    a: {
      en: "Yes. Every program at BICF, from legal counsel and immigration support to mental health referrals, education, and employment pathways, is offered at no cost to the people we serve. Our work is funded by grants, individual donors, and community partnerships.",
      fr: "Oui. Chaque programme de la BICF, du conseil juridique et du soutien en immigration aux références en santé mentale, à l'éducation et aux parcours d'emploi, est offert sans frais aux personnes que nous accompagnons. Notre travail est financé par des subventions, des donateurs individuels et des partenariats communautaires.",
    },
  },
  {
    q: {
      en: "How quickly will I hear back after I get in touch?",
      fr: "Dans quel délai recevrai-je une réponse?",
    },
    a: {
      en: "For non urgent enquiries, you will hear from us within one business day. For matters tied to a court date, an immigration deadline, or an immediate safety concern, please call us directly at (905) 931 3776 so we can route you to the right person without delay.",
      fr: "Pour les demandes non urgentes, vous aurez de nos nouvelles en un jour ouvrable. Pour toute question liée à une date d'audience, à une échéance d'immigration ou à une préoccupation de sécurité immédiate, veuillez nous appeler directement au (905) 931 3776 afin que nous puissions vous orienter sans délai.",
    },
  },
  {
    q: {
      en: "Do you offer support remotely, or only in person?",
      fr: "Offrez-vous du soutien à distance ou seulement en personne?",
    },
    a: {
      en: "Both. Our Ajax office is open for in person consultations, and we offer phone, video, and email support for clients across the GTA and beyond. We will match the format to whatever makes the process feel less heavy.",
      fr: "Les deux. Notre bureau d'Ajax est ouvert pour les consultations en personne, et nous offrons du soutien par téléphone, vidéo et courriel aux clients de la grande région de Toronto et au-delà. Nous adaptons le format à ce qui rend la démarche plus légère pour vous.",
    },
  },
  {
    q: {
      en: "What languages can you support clients in?",
      fr: "Dans quelles langues pouvez-vous accompagner les clients?",
    },
    a: {
      en: "Our staff and partner network can support clients in English, French, and several West African and Caribbean languages. Where we do not have a fluent speaker on the team, we work with vetted community interpreters at no cost to you.",
      fr: "Notre équipe et notre réseau de partenaires peuvent accompagner les clients en anglais, en français et dans plusieurs langues ouest-africaines et caribéennes. Lorsque nous n'avons pas de personne maîtrisant la langue, nous faisons appel à des interprètes communautaires accrédités, sans frais pour vous.",
    },
  },
  {
    q: {
      en: "How can I get involved as a volunteer?",
      fr: "Comment puis-je m'impliquer comme bénévole?",
    },
    a: {
      en: "We bring on volunteers across our legal, education, mental health, and community engagement programs. Send us a note through this form selecting Volunteer as the inquiry type, and our programs team will follow up with an intake call and current openings.",
      fr: "Nous accueillons des bénévoles dans nos programmes juridiques, éducatifs, de santé mentale et d'engagement communautaire. Envoyez-nous un message via ce formulaire en choisissant Bénévolat comme type de demande, et notre équipe des programmes vous recontactera avec un appel d'accueil et les postes disponibles.",
    },
  },
  {
    q: {
      en: "Are donations to BICF tax deductible?",
      fr: "Les dons à la BICF sont-ils déductibles d'impôt?",
    },
    a: {
      en: "Yes. BICF is a registered Canadian non profit, and donations made through our official channels are eligible for a charitable tax receipt. Receipts are issued by email at the start of each new tax year.",
      fr: "Oui. La BICF est un organisme canadien à but non lucratif enregistré, et les dons effectués par nos canaux officiels donnent droit à un reçu fiscal pour don de bienfaisance. Les reçus sont envoyés par courriel au début de chaque nouvelle année fiscale.",
    },
  },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateField(field: Field, value: string): Bi | undefined {
  const v = value.trim();
  switch (field) {
    case "name":
      if (!v) return { en: "Please enter your name", fr: "Veuillez entrer votre nom" };
      if (v.length < 2) return { en: "Name is too short", fr: "Le nom est trop court" };
      return;
    case "email":
      if (!v) return { en: "Please enter your email", fr: "Veuillez entrer votre courriel" };
      if (!EMAIL_RE.test(v))
        return { en: "Please enter a valid email", fr: "Veuillez entrer un courriel valide" };
      return;
    case "phone": {
      if (!v) return { en: "Please enter your phone", fr: "Veuillez entrer votre téléphone" };
      const digits = v.replace(/\D/g, "");
      if (digits.length < 7)
        return {
          en: "Please enter a valid phone number",
          fr: "Veuillez entrer un numéro de téléphone valide",
        };
      return;
    }
    case "subject":
      if (!v) return { en: "Please enter a subject", fr: "Veuillez entrer un sujet" };
      if (v.length < 2)
        return { en: "Subject is too short", fr: "Le sujet est trop court" };
      return;
    case "message":
      if (!v) return { en: "Please leave a message", fr: "Veuillez laisser un message" };
      if (v.length < 10)
        return {
          en: "Message must be at least 10 characters",
          fr: "Le message doit contenir au moins 10 caractères",
        };
      return;
    case "inquiry":
      return;
  }
}

function validateAll(values: FormState): FormErrors {
  const next: FormErrors = {};
  (Object.keys(values) as Field[]).forEach((f) => {
    const err = validateField(f, values[f]);
    if (err) next[f] = err;
  });
  return next;
}

export default function Contact() {
  const { t, lang } = useLanguage();
  const [values, setValues] = useState<FormState>(initial);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<Bi | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    document.title = t({
      en: "Contact | Black Immigrants Community Foundation",
      fr: "Contact | Black Immigrants Community Foundation",
    });
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [t, lang]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    const field = name as Field;
    setValues((prev) => ({ ...prev, [field]: value }));

    if (submitAttempted || touched[field]) {
      const err = validateField(field, value);
      setErrors((prev) => ({ ...prev, [field]: err }));
    }
  };

  const handleBlur = (
    e: FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    const field = name as Field;
    setTouched((prev) => ({ ...prev, [field]: true }));
    const err = validateField(field, value);
    setErrors((prev) => ({ ...prev, [field]: err }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitAttempted(true);
    setSubmitError(null);
    const allErrors = validateAll(values);
    setErrors(allErrors);

    if (Object.keys(allErrors).length > 0) {
      const order: Field[] = [
        "name",
        "email",
        "phone",
        "subject",
        "inquiry",
        "message",
      ];
      const firstBad = order.find((f) => allErrors[f]);
      if (firstBad) {
        const el = document.querySelector<HTMLElement>(`[name="${firstBad}"]`);
        el?.focus();
      }
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, website: honeypot }),
      });

      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
      }

      setSuccess(true);
      setValues(initial);
      setHoneypot("");
      setTouched({});
      setSubmitAttempted(false);
    } catch {
      setSubmitError({
        en: "Sorry, we couldn't send your message. Please try again, or email us directly at info@blackimmigrantscommunityfoundation.com.",
        fr: "Désolé, nous n'avons pas pu envoyer votre message. Veuillez réessayer ou nous écrire directement à info@blackimmigrantscommunityfoundation.com.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="contact">
      <div className="contact__container">
        <div className="contact__grid">
          <motion.div
            className="contact__info"
            initial={{ x: -80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease }}
          >
            <h1 className="contact__heading">
              {t({
                en: (
                  <>
                    Let&apos;s connect!
                    <br />
                    Reach out anytime!
                  </>
                ),
                fr: (
                  <>
                    Connectons-nous!
                    <br />
                    Écrivez-nous à tout moment!
                  </>
                ),
              })}
            </h1>

            <div className="contact__channels">
              <div className="contact__channel">
                <span className="contact__channel-label">
                  {t({ en: "Email", fr: "Courriel" })}
                </span>
                <a
                  className="contact__channel-value"
                  href="mailto:info@blackimmigrantscommunityfoundation.com"
                >
                  info@blackimmigrantscommunityfoundation.com
                </a>
              </div>

              <div className="contact__channel">
                <span className="contact__channel-label">
                  {t({ en: "Phone", fr: "Téléphone" })}
                </span>
                <a className="contact__channel-value" href="tel:+19059313776">
                  (905) 931 3776
                </a>
              </div>
            </div>

            <div className="contact__location">
              <span className="contact__channel-label contact__channel-label--neutral">
                {t({ en: "Location", fr: "Emplacement" })}
              </span>
              <address className="contact__address">
                190 Harwood Avenue South,
                <br />
                Ajax, Ontario L1S 2H6
              </address>
            </div>

            <div className="contact__socials">
              {[
                { label: "Facebook", href: "https://facebook.com" },
                { label: "Linkedin", href: "https://linkedin.com" },
                { label: "Instagram", href: "https://instagram.com" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact__social"
                >
                  <span>{s.label}</span>
                  <svg
                    width="11"
                    height="11"
                    viewBox="0 0 11 11"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M2 9L9 2M9 2H3M9 2V8"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="contact__form-wrap"
            initial={{ x: 80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease }}
          >
            <form
              className="contact__form"
              onSubmit={handleSubmit}
              noValidate
              aria-label={t({ en: "Contact form", fr: "Formulaire de contact" })}
            >
              <FormField
                name="name"
                label={t({ en: "Enter your name", fr: "Entrez votre nom" })}
                starred
                value={values.name}
                error={errors.name}
                onChange={handleChange}
                onBlur={handleBlur}
              />

              <div className="contact__row">
                <FormField
                  name="email"
                  type="email"
                  label={t({ en: "Enter your email", fr: "Entrez votre courriel" })}
                  starred
                  value={values.email}
                  error={errors.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete="email"
                  inputMode="email"
                />
                <FormField
                  name="phone"
                  type="tel"
                  label={t({ en: "Enter your phone", fr: "Entrez votre téléphone" })}
                  starred
                  value={values.phone}
                  error={errors.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete="tel"
                  inputMode="tel"
                />
              </div>

              <div className="contact__row">
                <FormField
                  name="subject"
                  label={t({ en: "Subject", fr: "Sujet" })}
                  starred
                  value={values.subject}
                  error={errors.subject}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />

                <div
                  className={`contact__field ${
                    errors.inquiry ? "contact__field--error" : ""
                  }`}
                >
                  <label className="contact__label" htmlFor="inquiry">
                    {t({ en: "Inquiry type", fr: "Type de demande" })}
                  </label>
                  <div className="contact__select-wrapper">
                    <select
                      id="inquiry"
                      name="inquiry"
                      className="contact__input contact__input--select"
                      value={values.inquiry}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      <option value="">
                        {t({ en: "Select one", fr: "Sélectionnez" })}
                      </option>
                      {inquiryOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {t(opt.label)}
                        </option>
                      ))}
                    </select>
                    <span className="contact__select-arrow" aria-hidden="true">
                      <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                        <path
                          d="M1 1.5L6 6.5L11 1.5"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>

              <FormField
                name="message"
                label={t({ en: "Enter your message", fr: "Entrez votre message" })}
                starred
                multiline
                value={values.message}
                error={errors.message}
                onChange={handleChange}
                onBlur={handleBlur}
              />

              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  left: "-9999px",
                  width: 1,
                  height: 1,
                  overflow: "hidden",
                }}
              >
                <label htmlFor="contact-website">
                  Leave this field empty
                </label>
                <input
                  id="contact-website"
                  name="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </div>

              <div className="contact__submit-row">
                <button
                  type="submit"
                  className="footer__btn contact__submit"
                  disabled={submitting}
                  aria-busy={submitting}
                >
                  {submitting
                    ? t({ en: "Sending…", fr: "Envoi…" })
                    : t({ en: "Submit now", fr: "Envoyer" })}
                </button>
                {success && !submitError && (
                  <p className="contact__success" role="status">
                    {t({
                      en: "Thank you! Your message has been received. We'll get back to you shortly.",
                      fr: "Merci! Votre message a bien été reçu. Nous vous répondrons sous peu.",
                    })}
                  </p>
                )}
                {submitError && (
                  <p className="contact__error" role="alert">
                    {t(submitError)}
                  </p>
                )}
              </div>
            </form>
          </motion.div>
        </div>

        <section className="contact__faqs" aria-labelledby="contact-faqs-title">
          <motion.header
            className="contact__faqs-head"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 0.85, ease }}
          >
            <h2 id="contact-faqs-title" className="contact__faqs-title">
              {t({ en: "FAQ", fr: "FAQ" })}
            </h2>
          </motion.header>

          <ul className="contact__faqs-list">
            {faqs.map((item, i) => {
              const isOpen = openFaq === i;
              const num = String(i + 1).padStart(2, "0");
              return (
                <motion.li
                  key={i}
                  className={`contact__faq ${
                    isOpen ? "contact__faq--open" : ""
                  }`}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{ duration: 0.65, ease, delay: i * 0.04 }}
                >
                  <button
                    type="button"
                    className="contact__faq-trigger"
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${i}`}
                    id={`faq-button-${i}`}
                  >
                    <span className="contact__faq-num">{num}</span>
                    <span className="contact__faq-q">{t(item.q)}</span>
                    <motion.span
                      className="contact__faq-icon"
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.35, ease }}
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
                        className="contact__faq-panel"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease }}
                      >
                        <p className="contact__faq-a">{t(item.a)}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.li>
              );
            })}
          </ul>
        </section>
      </div>
    </main>
  );
}

type FieldProps = {
  name: Field;
  label: string;
  type?: string;
  value: string;
  error?: Bi;
  starred?: boolean;
  multiline?: boolean;
  autoComplete?: string;
  inputMode?: "text" | "email" | "tel" | "numeric" | "decimal" | "search";
  onChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => void;
  onBlur: (
    e: FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => void;
};

function FormField({
  name,
  label,
  type = "text",
  value,
  error,
  starred,
  multiline,
  autoComplete,
  inputMode,
  onChange,
  onBlur,
}: FieldProps) {
  const { t } = useLanguage();
  const id = `contact-${name}`;
  const labelText = starred ? `${label}*` : label;

  return (
    <div
      className={`contact__field ${
        multiline ? "contact__field--multiline" : ""
      } ${error ? "contact__field--error" : ""}`}
    >
      <label className="contact__label" htmlFor={id}>
        {labelText}
      </label>
      {multiline ? (
        <textarea
          id={id}
          name={name}
          className="contact__input contact__input--textarea"
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          rows={4}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          className="contact__input"
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          autoComplete={autoComplete}
          inputMode={inputMode}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
        />
      )}
      {error && (
        <span id={`${id}-error`} className="contact__error" role="alert">
          {t(error)}
        </span>
      )}
    </div>
  );
}
