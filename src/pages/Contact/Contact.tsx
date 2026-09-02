/* Contact page.
   
      A fully controlled, client-validated form that posts to /api/contact.
      Fields validate on blur and again on submit; the honeypot field is invisible
      to people and catches naive bots. On success the form is replaced by a
      confirmation that takes focus, so screen reader users are told it worked. */

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FocusEvent,
  type FormEvent,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLanguage, type Lang } from "../../context/LanguageContext";
import Reveal from "../../components/Reveal/Reveal";
import "./Contact.scss";

const EASE = [0.22, 1, 0.36, 1] as const;
const MESSAGE_MAX = 1500;

type Bi = Record<Lang, string>;

type Field =
  | "firstName"
  | "lastName"
  | "email"
  | "phone"
  | "subject"
  | "inquiry"
  | "message"
  | "preferredContact";
type FormState = Record<Field, string>;
type FormErrors = Partial<Record<Field, Bi>>;

const initial: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  subject: "",
  inquiry: "",
  message: "",
  preferredContact: "either",
};

const inquiryOptions: { value: string; label: Bi }[] = [
  { value: "General Inquiry", label: { en: "General Inquiry", fr: "Demande générale" } },
  { value: "Volunteer", label: { en: "Volunteer", fr: "Bénévolat" } },
  { value: "Partnership", label: { en: "Partnership", fr: "Partenariat" } },
  { value: "Media", label: { en: "Media", fr: "Médias" } },
  { value: "Donation", label: { en: "Donation", fr: "Don" } },
  { value: "Other", label: { en: "Other", fr: "Autre" } },
];

const contactPrefs: { value: string; label: Bi }[] = [
  { value: "email", label: { en: "Email", fr: "Courriel" } },
  { value: "phone", label: { en: "Phone", fr: "Téléphone" } },
  { value: "either", label: { en: "Either", fr: "L'un ou l'autre" } },
];

const consentLabel: Bi = {
  en: "I consent to BICF contacting me about my message.",
  fr: "Je consens à ce que la BICF me contacte au sujet de mon message.",
};

const consentErrorMsg: Bi = {
  en: "Please confirm you consent to being contacted",
  fr: "Veuillez confirmer votre consentement à être contacté",
};

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
    q: { en: "Are your services free of charge?", fr: "Vos services sont-ils gratuits?" },
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

function validateField(field: Field, values: FormState): Bi | undefined {
  const v = (values[field] ?? "").trim();
  switch (field) {
    case "firstName":
      if (!v)
        return { en: "Please enter your first name", fr: "Veuillez entrer votre prénom" };
      if (v.length < 2)
        return { en: "First name is too short", fr: "Le prénom est trop court" };
      return;
    case "lastName":
      if (!v)
        return {
          en: "Please enter your last name",
          fr: "Veuillez entrer votre nom de famille",
        };
      if (v.length < 2)
        return { en: "Last name is too short", fr: "Le nom de famille est trop court" };
      return;
    case "email":
      if (!v)
        return { en: "Please enter your email", fr: "Veuillez entrer votre courriel" };
      if (!EMAIL_RE.test(v))
        return { en: "Please enter a valid email", fr: "Veuillez entrer un courriel valide" };
      return;
    case "phone": {
      const required = values.preferredContact === "phone";
      if (!v)
        return required
          ? {
              en: "A phone number is required when you prefer a call",
              fr: "Un numéro de téléphone est requis si vous préférez un appel",
            }
          : undefined;
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
    case "preferredContact":
      return;
  }
}

function validateAll(values: FormState): FormErrors {
  const next: FormErrors = {};
  (Object.keys(values) as Field[]).forEach((f) => {
    const err = validateField(f, values);
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
  const [consent, setConsent] = useState(false);
  const [consentError, setConsentError] = useState<Bi | null>(null);
  const [success, setSuccess] = useState(false);
  const [sent, setSent] = useState({ name: "", email: "" });
  const [submitError, setSubmitError] = useState<Bi | null>(null);
  const [submitting, setSubmitting] = useState(false);
  // Hidden from people, submitted as `website`. Anything non-empty is a bot.
  const [honeypot, setHoneypot] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const doneRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    document.title = t({
      en: "Contact | Black Immigrants Community Foundation",
      fr: "Contact | Black Immigrants Community Foundation",
    });
  }, [t, lang]);

  useEffect(() => {
    if (success) doneRef.current?.focus();
  }, [success]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    const field = name as Field;
    const next = { ...values, [field]: value };
    setValues(next);

    if (submitAttempted || touched[field]) {
      setErrors((prev) => ({ ...prev, [field]: validateField(field, next) }));
    }
    if (field === "preferredContact" && (submitAttempted || touched.phone)) {
      setErrors((prev) => ({ ...prev, phone: validateField("phone", next) }));
    }
  };

  const handleBlur = (
    e: FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const field = e.target.name as Field;
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors((prev) => ({ ...prev, [field]: validateField(field, values) }));
  };

  const handleConsent = (checked: boolean) => {
    setConsent(checked);
    if (submitAttempted) setConsentError(checked ? null : consentErrorMsg);
  };

  const resetForm = () => {
    setValues(initial);
    setConsent(false);
    setHoneypot("");
    setTouched({});
    setErrors({});
    setConsentError(null);
    setSubmitAttempted(false);
    setSubmitError(null);
    setSuccess(false);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitAttempted(true);
    setSubmitError(null);
    const allErrors = validateAll(values);
    setErrors(allErrors);
    const consentBad = !consent;
    setConsentError(consentBad ? consentErrorMsg : null);

    if (Object.keys(allErrors).length > 0 || consentBad) {
      const order: Field[] = [
        "firstName",
        "lastName",
        "email",
        "phone",
        "subject",
        "message",
      ];
      const firstBad = order.find((f) => allErrors[f]);
      const selector = firstBad ? `[name="${firstBad}"]` : "#contact-consent";
      document.querySelector<HTMLElement>(selector)?.focus();
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, consent, lang, website: honeypot }),
      });
      if (!res.ok) throw new Error(`Request failed with status ${res.status}`);

      setSent({ name: values.firstName, email: values.email });
      resetForm();
      setSuccess(true);
    } catch {
      setSubmitError({
        en: "Sorry, we couldn't send your message. Please try again, or email us directly at secretary@bicf.ca.",
        fr: "Désolé, nous n'avons pas pu envoyer votre message. Veuillez réessayer ou nous écrire directement à secretary@bicf.ca.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const phoneRequired = values.preferredContact === "phone";

  return (
    <main className="contact" id="main">
      {/* ====================================================== HERO dark */}
      <section className="page-hero surface surface--dark" aria-labelledby="con-title">
        <div className="page-hero__glow" aria-hidden="true" />
        <div className="container page-hero__inner">
          <Reveal as="span" className="kicker" y={12}>
            {t({ en: "Contact", fr: "Contact" })}
          </Reveal>
          <Reveal
            as="h1"
            id="con-title"
            className="h-display page-hero__title"
            delay={0.05}
          >
            {t({ en: "Get In ", fr: "Nous " })}
            <span className="accent-word">
              {t({ en: "Touch", fr: "joindre" })}
            </span>
          </Reveal>
          <Reveal as="p" className="lead page-hero__lead" delay={0.1}>
            {t({
              en: "We're here to help and support you. Reach out to us for assistance, partnerships, or any questions.",
              fr: "Nous sommes là pour vous aider et vous soutenir. Écrivez-nous pour de l'aide, des partenariats ou toute question.",
            })}
          </Reveal>
        </div>
      </section>

      {/* ====================================================== FORM light */}
      <section className="cform surface surface--light sheet" aria-labelledby="form-title">
        <div className="container">
          <div className="cform__grid">
            <aside className="cform__aside">
              <Reveal as="span" className="kicker">
                {t({ en: "Send Us a Message", fr: "Envoyez-nous un message" })}
              </Reveal>
              <Reveal as="h2" id="form-title" className="h2" delay={0.05}>
                {t({
                  en: "Fill out the form below and we'll get back to you as soon as possible.",
                  fr: "Remplissez le formulaire ci-dessous et nous vous répondrons dans les meilleurs délais.",
                })}
              </Reveal>
            </aside>

            <div className="cform__panel">
              <AnimatePresence mode="wait">
                {success ? (
                  <motion.div
                    key="done"
                    className="done"
                    role="status"
                    aria-live="polite"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.45, ease: EASE }}
                  >
                    <span className="done__icon" aria-hidden="true">
                      <svg viewBox="0 0 24 24" width="26" height="26" fill="none">
                        <path
                          d="M20 6L9 17l-5-5"
                          stroke="currentColor"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <h3 className="h2 done__title" tabIndex={-1} ref={doneRef}>
                      {t({ en: "Message sent!", fr: "Message envoyé!" })}
                    </h3>
                    <p className="body done__text">
                      {t({
                        en: `Thanks, ${sent.name || "there"}! We've received your message and will reply within one business day. A confirmation has been sent to ${sent.email}.`,
                        fr: `Merci, ${sent.name || ""}! Nous avons bien reçu votre message et vous répondrons dans un délai d'un jour ouvrable. Une confirmation a été envoyée à ${sent.email}.`,
                      })}
                    </p>
                    <button type="button" className="btn btn--solid" onClick={resetForm}>
                      {t({ en: "Send another message", fr: "Envoyer un autre message" })}
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    className="form"
                    onSubmit={handleSubmit}
                    noValidate
                    aria-label={t({ en: "Contact form", fr: "Formulaire de contact" })}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, ease: EASE }}
                  >
                    <div className="form__row">
                      <FormField
                        name="firstName"
                        label={t({ en: "First name", fr: "Prénom" })}
                        starred
                        value={values.firstName}
                        error={errors.firstName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        autoComplete="given-name"
                      />
                      <FormField
                        name="lastName"
                        label={t({ en: "Last name", fr: "Nom de famille" })}
                        starred
                        value={values.lastName}
                        error={errors.lastName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        autoComplete="family-name"
                      />
                    </div>

                    <div className="form__row">
                      <FormField
                        name="email"
                        type="email"
                        label={t({ en: "Email", fr: "Courriel" })}
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
                        label={t({ en: "Phone", fr: "Téléphone" })}
                        starred={phoneRequired}
                        optional={!phoneRequired}
                        optionalLabel={t({ en: "optional", fr: "facultatif" })}
                        value={values.phone}
                        error={errors.phone}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        autoComplete="tel"
                        inputMode="tel"
                      />
                    </div>

                    <div className="form__row">
                      <FormField
                        name="subject"
                        label={t({ en: "Subject", fr: "Sujet" })}
                        starred
                        value={values.subject}
                        error={errors.subject}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />

                      <div className="field">
                        <label className="field__label" htmlFor="inquiry">
                          {t({ en: "Inquiry type", fr: "Type de demande" })}
                        </label>
                        <div className="field__select">
                          <select
                            id="inquiry"
                            name="inquiry"
                            className="field__input"
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
                          <span className="field__arrow" aria-hidden="true">
                            <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                              <path
                                d="M1 1.5L6 6.5L11 1.5"
                                stroke="currentColor"
                                strokeWidth="1.7"
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
                      label={t({ en: "Message", fr: "Message" })}
                      starred
                      multiline
                      maxLength={MESSAGE_MAX}
                      value={values.message}
                      error={errors.message}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      footer={
                        <span className="field__counter" aria-hidden="true">
                          {values.message.length} / {MESSAGE_MAX}
                        </span>
                      }
                    />

                    <fieldset className="prefs">
                      <legend className="field__label">
                        {t({
                          en: "Preferred way to reach you",
                          fr: "Comment préférez-vous être contacté?",
                        })}
                      </legend>
                      <div
                        className="prefs__pills"
                        role="radiogroup"
                        aria-label={t({
                          en: "Preferred contact method",
                          fr: "Méthode de contact préférée",
                        })}
                      >
                        {contactPrefs.map((opt) => (
                          <label
                            key={opt.value}
                            className={`pill ${
                              values.preferredContact === opt.value ? "pill--on" : ""
                            }`}
                          >
                            <input
                              type="radio"
                              name="preferredContact"
                              value={opt.value}
                              checked={values.preferredContact === opt.value}
                              onChange={handleChange}
                            />
                            <span>{t(opt.label)}</span>
                          </label>
                        ))}
                      </div>
                    </fieldset>

                    <div className={`consent ${consentError ? "consent--error" : ""}`}>
                      <label className="consent__check">
                        <input
                          id="contact-consent"
                          type="checkbox"
                          checked={consent}
                          onChange={(e) => handleConsent(e.target.checked)}
                          aria-invalid={Boolean(consentError)}
                          aria-describedby={
                            consentError ? "contact-consent-error" : undefined
                          }
                        />
                        <span className="consent__box" aria-hidden="true">
                          <svg viewBox="0 0 12 12" width="12" height="12" fill="none">
                            <path
                              d="M2.5 6.2L5 8.5L9.5 3.5"
                              stroke="currentColor"
                              strokeWidth="1.9"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </span>
                        <span className="consent__text">{t(consentLabel)}</span>
                      </label>
                      {consentError && (
                        <span
                          id="contact-consent-error"
                          className="field__error"
                          role="alert"
                        >
                          {t(consentError)}
                        </span>
                      )}
                    </div>

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
                      <label htmlFor="contact-website">Leave this field empty</label>
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

                    <div className="form__submit">
                      <button
                        type="submit"
                        className="btn btn--primary form__btn"
                        disabled={submitting}
                        aria-busy={submitting}
                      >
                        {submitting
                          ? t({ en: "Sending…", fr: "Envoi…" })
                          : t({ en: "Send message", fr: "Envoyer le message" })}
                      </button>
                      <p className="small form__privacy">
                        {t({
                          en: "We only use your details to respond to your inquiry.",
                          fr: "Nous n'utilisons vos coordonnées que pour répondre à votre demande.",
                        })}
                      </p>
                      {submitError && (
                        <p className="field__error" role="alert">
                          {t(submitError)}
                        </p>
                      )}
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================== VISIT dark */}
      <section className="visit surface surface--dark" aria-labelledby="visit-title">
        <div className="container">
          <header className="section-head">
            <div>
              <Reveal as="span" className="kicker">
                {t({ en: "Visit Us", fr: "Nous visiter" })}
              </Reveal>
              <Reveal as="h2" id="visit-title" className="h2" delay={0.05}>
                {t({
                  en: "Come see us in Ajax.",
                  fr: "Venez nous voir à Ajax.",
                })}
              </Reveal>
            </div>
            <Reveal as="div" className="section-head__aside" delay={0.1}>
              <p className="body">
                {t({
                  en: "Our office is open for in person support, and we answer the phone and inbox for everyone else.",
                  fr: "Notre bureau est ouvert pour le soutien en personne, et nous répondons au téléphone et aux courriels pour tous les autres.",
                })}
              </p>
            </Reveal>
          </header>

          <div className="visit__grid">
            <Reveal as="ul" className="visit__details" y={18}>
              <li>
                <span className="visit__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </span>
                <address className="visit__value">
                  190 Harwood Avenue South,
                  <br />
                  Ajax, Ontario L1S 2H6
                </address>
              </li>
              <li>
                <span className="visit__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z" />
                  </svg>
                </span>
                <a className="visit__value" href="tel:+19059313776">
                  (905) 931 3776
                </a>
              </li>
              <li>
                <span className="visit__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m2 7 10 6 10-6" />
                  </svg>
                </span>
                <a className="visit__value" href="mailto:secretary@bicf.ca">
                  secretary@bicf.ca
                </a>
              </li>
              <li className="visit__action">
                <a
                  className="btn btn--outline btn--sm"
                  href="https://www.google.com/maps/dir/?api=1&destination=190+Harwood+Avenue+South%2C+Ajax%2C+Ontario+L1S+2H6"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t({ en: "Get directions", fr: "Obtenir l'itinéraire" })}
                </a>
              </li>
            </Reveal>

            <Reveal as="figure" className="visit__map" delay={0.1} y={24}>
              <iframe
                title={t({
                  en: "Map showing the BICF office at 190 Harwood Avenue South, Ajax, Ontario",
                  fr: "Carte montrant le bureau de la BICF au 190 Harwood Avenue South, Ajax, Ontario",
                })}
                src="https://www.google.com/maps?q=190+Harwood+Avenue+South%2C+Ajax%2C+Ontario+L1S+2H6&output=embed"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </Reveal>
          </div>
        </div>
      </section>
      {/* ======================================================= FAQ tint */}
      <section className="faq surface surface--tint sheet" aria-labelledby="cfaq-title">
        <div className="container">
          <div className="faq__grid">
            <div className="faq__aside">
              <Reveal as="span" className="kicker">
                {t({ en: "Questions", fr: "Questions" })}
              </Reveal>
              <Reveal as="h2" id="cfaq-title" className="h2" delay={0.05}>
                {t({ en: "Frequently asked questions", fr: "Questions fréquentes" })}
              </Reveal>
              <Reveal as="p" className="body faq__aside-text" delay={0.1}>
                {t({
                  en: "Everything people most often ask before reaching out for the first time.",
                  fr: "Tout ce que les gens demandent le plus souvent avant de nous contacter pour la première fois.",
                })}
              </Reveal>
            </div>

            <ul className="faq__list">
              {faqs.map((item, i) => {
                const isOpen = openFaq === i;
                return (
                  <li className={`faq__item ${isOpen ? "faq__item--open" : ""}`} key={i}>
                    <h3>
                      <button
                        type="button"
                        className="faq__trigger"
                        onClick={() => setOpenFaq(isOpen ? null : i)}
                        aria-expanded={isOpen}
                        aria-controls={`cfaq-panel-${i}`}
                        id={`cfaq-button-${i}`}
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
                          id={`cfaq-panel-${i}`}
                          role="region"
                          aria-labelledby={`cfaq-button-${i}`}
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

type FieldProps = {
  name: Field;
  label: string;
  type?: string;
  value: string;
  error?: Bi;
  starred?: boolean;
  optional?: boolean;
  optionalLabel?: string;
  multiline?: boolean;
  maxLength?: number;
  footer?: ReactNode;
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
  optional,
  optionalLabel,
  multiline,
  maxLength,
  footer,
  autoComplete,
  inputMode,
  onChange,
  onBlur,
}: FieldProps) {
  const { t } = useLanguage();
  const id = `contact-${name}`;

  return (
    <div className={`field ${multiline ? "field--area" : ""} ${error ? "field--bad" : ""}`}>
      <label className="field__label" htmlFor={id}>
        {label}
        {starred && <span className="field__req">*</span>}
        {optional && optionalLabel && (
          <span className="field__opt">({optionalLabel})</span>
        )}
      </label>
      {multiline ? (
        <textarea
          id={id}
          name={name}
          className="field__input field__input--area"
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          rows={5}
          maxLength={maxLength}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          className="field__input"
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          maxLength={maxLength}
          autoComplete={autoComplete}
          inputMode={inputMode}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
        />
      )}
      {(footer || error) && (
        <div className="field__foot">
          {error ? (
            <span id={`${id}-error`} className="field__error" role="alert">
              {t(error)}
            </span>
          ) : (
            <span />
          )}
          {footer}
        </div>
      )}
    </div>
  );
}
