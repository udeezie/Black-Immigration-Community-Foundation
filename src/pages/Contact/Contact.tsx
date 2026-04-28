import {
  useEffect,
  useState,
  type ChangeEvent,
  type FocusEvent,
  type FormEvent,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import "./Contact.scss";

const ease = [0.25, 0.46, 0.45, 0.94] as const;

type Field = "name" | "email" | "phone" | "subject" | "inquiry" | "message";
type FormState = Record<Field, string>;
type FormErrors = Partial<Record<Field, string>>;

const initial: FormState = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  inquiry: "",
  message: "",
};

const inquiryOptions = [
  "General Inquiry",
  "Volunteer",
  "Partnership",
  "Media",
  "Donation",
  "Other",
];

const faqs = [
  {
    q: "Who is eligible to access BICF's programs?",
    a: "Our work is for Black immigrants and their families navigating life in Canada. Whether you arrived last week, last decade, or were raised here as part of the second generation, you are welcome to reach out. We do not require proof of status to begin a conversation.",
  },
  {
    q: "Are your services free of charge?",
    a: "Yes. Every program at BICF, from legal counsel and immigration support to mental health referrals, education, and employment pathways, is offered at no cost to the people we serve. Our work is funded by grants, individual donors, and community partnerships.",
  },
  {
    q: "How quickly will I hear back after I get in touch?",
    a: "For non urgent enquiries, you will hear from us within one business day. For matters tied to a court date, an immigration deadline, or an immediate safety concern, please call us directly at (905) 931 3776 so we can route you to the right person without delay.",
  },
  {
    q: "Do you offer support remotely, or only in person?",
    a: "Both. Our Ajax office is open for in person consultations, and we offer phone, video, and email support for clients across the GTA and beyond. We will match the format to whatever makes the process feel less heavy.",
  },
  {
    q: "What languages can you support clients in?",
    a: "Our staff and partner network can support clients in English, French, and several West African and Caribbean languages. Where we do not have a fluent speaker on the team, we work with vetted community interpreters at no cost to you.",
  },
  {
    q: "How can I get involved as a volunteer?",
    a: "We bring on volunteers across our legal, education, mental health, and community engagement programs. Send us a note through this form selecting Volunteer as the inquiry type, and our programs team will follow up with an intake call and current openings.",
  },
  {
    q: "Are donations to BICF tax deductible?",
    a: "Yes. BICF is a registered Canadian non profit, and donations made through our official channels are eligible for a charitable tax receipt. Receipts are issued by email at the start of each new tax year.",
  },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateField(field: Field, value: string): string | undefined {
  const v = value.trim();
  switch (field) {
    case "name":
      if (!v) return "Please enter your name";
      if (v.length < 2) return "Name is too short";
      return;
    case "email":
      if (!v) return "Please enter your email";
      if (!EMAIL_RE.test(v)) return "Please enter a valid email";
      return;
    case "phone": {
      if (!v) return "Please enter your phone";
      const digits = v.replace(/\D/g, "");
      if (digits.length < 7) return "Please enter a valid phone number";
      return;
    }
    case "subject":
      if (!v) return "Please enter a subject";
      if (v.length < 2) return "Subject is too short";
      return;
    case "message":
      if (!v) return "Please leave a message";
      if (v.length < 10) return "Message must be at least 10 characters";
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
  const [values, setValues] = useState<FormState>(initial);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [success, setSuccess] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    document.title = "Contact — Black Immigrants Community Foundation";
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

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

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitAttempted(true);
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

    setSuccess(true);
    setValues(initial);
    setTouched({});
    setSubmitAttempted(false);
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
              Let&apos;s connect!
              <br />
              Reach out anytime!
            </h1>

            <div className="contact__channels">
              <div className="contact__channel">
                <span className="contact__channel-label">Email</span>
                <a
                  className="contact__channel-value"
                  href="mailto:info@blackimmigrantscommunityfoundation.com"
                >
                  info@blackimmigrantscommunityfoundation.com
                </a>
              </div>

              <div className="contact__channel">
                <span className="contact__channel-label">Phone</span>
                <a className="contact__channel-value" href="tel:+19059313776">
                  (905) 931 3776
                </a>
              </div>
            </div>

            <div className="contact__location">
              <span className="contact__channel-label contact__channel-label--neutral">
                Location
              </span>
              <address className="contact__address">
                190 Harwood Avenue South,
                <br />
                Ajax, Ontario L1S 2H6
              </address>
            </div>

            <div className="contact__separator" aria-hidden="true" />

            <div className="contact__socials">
              {[
                {
                  label: "Facebook",
                  href: "https://facebook.com",
                },
                {
                  label: "Linkedin",
                  href: "https://linkedin.com",
                },
                {
                  label: "Instagram",
                  href: "https://instagram.com",
                },
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
              aria-label="Contact form"
            >
              <Field
                name="name"
                label="Enter your name"
                starred
                value={values.name}
                error={errors.name}
                onChange={handleChange}
                onBlur={handleBlur}
              />

              <div className="contact__row">
                <Field
                  name="email"
                  type="email"
                  label="Enter your email"
                  starred
                  value={values.email}
                  error={errors.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete="email"
                  inputMode="email"
                />
                <Field
                  name="phone"
                  type="tel"
                  label="Enter your phone"
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
                <Field
                  name="subject"
                  label="Subject"
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
                    Inquiry type
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
                      <option value="">Select one</option>
                      {inquiryOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
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

              <Field
                name="message"
                label="Enter your message"
                starred
                multiline
                value={values.message}
                error={errors.message}
                onChange={handleChange}
                onBlur={handleBlur}
              />

              <div className="contact__submit-row">
                <button type="submit" className="footer__btn contact__submit">
                  Submit now
                </button>
                {success && (
                  <p className="contact__success" role="status">
                    Thank you! Your message has been received. We&apos;ll get
                    back to you shortly.
                  </p>
                )}
              </div>
            </form>
          </motion.div>
        </div>

        <section
          className="contact__faqs"
          aria-labelledby="contact-faqs-title"
        >
          <motion.header
            className="contact__faqs-head"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 0.85, ease }}
          >
            <h2 id="contact-faqs-title" className="contact__faqs-title">
              FAQ
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
                    <span className="contact__faq-q">{item.q}</span>
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
                        <p className="contact__faq-a">{item.a}</p>
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
  error?: string;
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

function Field({
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
          {error}
        </span>
      )}
    </div>
  );
}
