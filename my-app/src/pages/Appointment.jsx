import { useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, Check, Mail, Phone, Plus, Sparkles, User, X, AtSign } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

import { useBooking } from "../context/BookingContext";

/* ------------------------------------------------------------------ */
/* Settings                                                            */
/* ------------------------------------------------------------------ */

const SALON_NAME = "ArcAsa Unisex Salon";
const SALON_WHATSAPP = "918093077919"; // used for the "send on WhatsApp" backup link
// Empty while developing (Vite forwards /api to the Python server).
// On the live site set VITE_API_URL in my-app/.env.production, for example https://api.example.com
const API_URL = import.meta.env.VITE_API_URL ?? "";

const emptyForm = {
  name: "",
  phone: "",
  email: "",
  sameAsPhone: true,
  whatsapp: "",
  collab: false,
  instagram: "",
};

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const I = ({ icon: Icon, size = 18, className }) => (
  <Icon size={size} strokeWidth={1.8} className={className} aria-hidden="true" />
);

const onlyDigits = (v) => v.replace(/\D/g, "").slice(0, 10);

const phoneOk = (v) => /^[6-9]\d{9}$/.test(v);
const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
const handleOk = (v) => /^@?[A-Za-z0-9._]{1,30}$/.test(v);

const fieldOrder = ["name", "phone", "email", "whatsapp", "instagram"];

const validate = (f) => {
  const e = {};
  if (f.name.trim().length < 2) e.name = "Enter your full name.";
  if (!phoneOk(f.phone)) e.phone = "Enter a valid 10-digit mobile number.";
  if (!emailOk(f.email.trim())) e.email = "Enter a valid email address.";
  if (!f.sameAsPhone && !phoneOk(f.whatsapp)) e.whatsapp = "Enter a valid 10-digit WhatsApp number.";
  if (f.collab && !handleOk(f.instagram.trim())) e.instagram = "Enter your Instagram username, for example @yourname.";
  return e;
};

const scopeLabel = (s) => [s.scope?.replace("-", " · "), s.group].filter(Boolean).join(" · ");

const buildMessage = (f, services, total, unpriced) => {
  const whatsapp = f.sameAsPhone ? f.phone : f.whatsapp;
  const handle = f.instagram.trim().replace(/^@/, "");
  return [
    `Hello ${SALON_NAME}, I would like to book an appointment.`,
    "",
    "Services:",
    ...services.map((s, i) => `${i + 1}. ${s.name} (${scopeLabel(s)}) - ${s.priceLabel || "price at billing"}`),
    "",
    `Estimated total: ₹${total}${unpriced > 0 ? ` + ${unpriced} service(s) priced at billing` : ""}`,
    "",
    `Name: ${f.name.trim()}`,
    `Mobile: +91 ${f.phone}`,
    `Email: ${f.email.trim()}`,
    `WhatsApp: +91 ${whatsapp}`,
    `Instagram collab: ${f.collab ? `Yes (@${handle})` : "No"}`,
  ].join("\n");
};

/* A label, an input box with an icon, and an error line */
const Field = ({ id, label, icon, error, hint, children }) => (
  <div>
    <label htmlFor={id} className="mb-1.5 block text-sm font-semibold">
      {label}
    </label>
    <div
      className={`flex items-center gap-2 rounded-xl border bg-white px-3 transition-shadow focus-within:ring-2 ${
        error
          ? "border-[#9F2343] focus-within:ring-[#9F2343]/30"
          : "border-[#F0E7E1] focus-within:ring-[#9F2343]/20"
      }`}
    >
      <span className="shrink-0 text-[#9F2343]">
        <I icon={icon} />
      </span>
      {children}
    </div>
    {hint && !error && <p className="mt-1 text-xs text-[#71717D]">{hint}</p>}
    {error && (
      <p id={`${id}-error`} className="mt-1 text-xs font-medium text-[#9F2343]">
        {error}
      </p>
    )}
  </div>
);

const inputClass =
  "w-full bg-transparent py-3 text-sm text-[#171923] outline-none placeholder:text-[#71717D]/70";

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

const Appointment = () => {
  const { services, count, total, removeService, clearServices } = useBooking();

  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [waUrl, setWaUrl] = useState(""); // ready-made WhatsApp message, used as a backup

  const unpriced = services.filter((s) => typeof s.price !== "number").length;

  const set = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const submit = async (e) => {
    e.preventDefault();
    if (sending) return; // ignore a second click while the first is still sending

    const found = validate(form);
    setErrors(found);

    const first = fieldOrder.find((k) => found[k]);
    if (first) {
      document.getElementById(`field-${first}`)?.focus();
      return;
    }

    // Prepared now so the visitor can still send it on WhatsApp if saving fails
    const message = buildMessage(form, services, total, unpriced);
    setWaUrl(`https://wa.me/${SALON_WHATSAPP}?text=${encodeURIComponent(message)}`);

    setSubmitError("");
    setSending(true);
    try {
      const res = await fetch(`${API_URL}/api/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          phone: form.phone,
          email: form.email.trim(),
          whatsapp: form.sameAsPhone ? form.phone : form.whatsapp,
          collab: form.collab,
          instagram: form.collab ? ("@"+form.instagram.trim()) : "",
          services: services.map(({ name, scope, group, priceLabel, price }) => ({
            name,
            scope,
            group,
            priceLabel,
            price,
          })),
        }),
        signal: AbortSignal.timeout(15000), // give up after 15 seconds
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        setSubmitError(
          typeof body?.detail === "string"
            ? body.detail
            : "Some details were not accepted. Please check the form and try again."
        );
        return;
      }

      setSent(true);
      clearServices(); // saved, so the list is not sent twice
    } catch {
      setSubmitError("We could not reach the server. Please check your connection and try again.");
    } finally {
      setSending(false);
    }
  };

  const startOver = () => {
    clearServices();
    setForm(emptyForm);
    setErrors({});
    setSent(false);
    setSubmitError("");
    setWaUrl("");
  };

  const aria = (key) => ({
    "aria-invalid": Boolean(errors[key]),
    "aria-describedby": errors[key] ? `field-${key}-error` : undefined,
  });

  return (
    <main className="min-h-screen bg-[#FFFCF9] font-sans text-[#171923]">
      <div className="mx-auto max-w-[1100px] p-4 lg:p-6">
        <header className="mb-6">
          <h1 className="font-display text-3xl font-bold sm:text-4xl">
            Book your{" "}
            <span className="font-['Great_Vibes',cursive] text-5xl font-normal text-[#9F2343]">
              appointment
            </span>
          </h1>
          <p className="mt-2 text-sm text-[#71717D]">
            Check your services, tell us how to reach you, and we will confirm your slot.
          </p>
        </header>

        {/* ---------- Sent ---------- */}
        {sent ? (
          <section className="rounded-2xl border border-[#F0E7E1] bg-white p-8 text-center shadow-sm">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#FBE7EA] text-[#9F2343]">
              <I icon={Check} size={28} />
            </span>
            <h2 className="mt-4 font-display text-2xl font-semibold">
              Thank you, {form.name.trim().split(" ")[0]}
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-[#71717D]">
              We have received your request. We will contact you on WhatsApp or by phone to confirm your
              slot.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#FFD166] px-5 py-2.5 text-sm font-semibold"
              >
                <FaWhatsapp size={18} /> Message us on WhatsApp
              </a>
              <button
                type="button"
                onClick={startOver}
                className="rounded-full border border-[#F0E7E1] bg-white px-5 py-2.5 text-sm font-semibold hover:bg-[#FBE7EA]"
              >
                Start a new booking
              </button>
            </div>
          </section>
        ) : count === 0 ? (
          /* ---------- Nothing selected ---------- */
          <section className="rounded-2xl border border-[#F0E7E1] bg-white p-10 text-center shadow-sm">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#FBE7EA] text-[#9F2343]">
              <I icon={Sparkles} size={28} />
            </span>
            <h2 className="mt-4 font-display text-2xl font-semibold">No services selected yet</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-[#71717D]">
              Pick the services you want with the <b>+</b> button on the Services page. They will appear here.
            </p>
            <Link
              to="/services"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#FFD166] px-5 py-2.5 text-sm font-semibold"
            >
              Browse services
            </Link>
          </section>
        ) : (
          /* ---------- Services + details ---------- */
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
            <div className="space-y-6">
              {/* Selected services */}
              <section className="rounded-2xl border border-[#F0E7E1] bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="font-display text-xl font-semibold">Your services ({count})</h2>
                  <button
                    type="button"
                    onClick={clearServices}
                    className="text-sm font-medium text-[#9F2343] hover:underline"
                  >
                    Clear all
                  </button>
                </div>

                <ul className="mt-4 space-y-2">
                  {services.map((s) => (
                    <li
                      key={s.id}
                      className="flex items-center gap-3 rounded-xl border border-[#F0E7E1] px-4 py-3"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold">{s.name}</p>
                        <p className="truncate text-xs text-[#71717D]">{scopeLabel(s)}</p>
                      </div>
                      <p className="shrink-0 font-bold text-[#C96A00]">{s.priceLabel || "At billing"}</p>
                      <button
                        type="button"
                        onClick={() => removeService(s.id)}
                        aria-label={`Remove ${s.name}`}
                        className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#FFF3DE] text-[#A96100] hover:bg-[#FFE7BD]"
                      >
                        <I icon={X} size={16} />
                      </button>
                    </li>
                  ))}
                </ul>

                <Link
                  to="/services"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#79172F] hover:underline"
                >
                  <I icon={Plus} size={16} /> Add more services
                </Link>
              </section>

              {/* Details */}
              <form
                id="appointment-form"
                onSubmit={submit}
                noValidate
                className="rounded-2xl border border-[#F0E7E1] bg-white p-5 shadow-sm"
              >
                <h2 className="font-display text-xl font-semibold">Your details</h2>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <Field id="field-name" label="Full name" icon={User} error={errors.name}>
                      <input
                        id="field-name"
                        type="text"
                        autoComplete="name"
                        value={form.name}
                        onChange={(e) => set("name", e.target.value)}
                        placeholder="Your full name"
                        className={inputClass}
                        {...aria("name")}
                      />
                    </Field>
                  </div>

                  <Field id="field-phone" label="Mobile number" icon={Phone} error={errors.phone}>
                    <span className="shrink-0 border-r border-[#F0E7E1] pr-2 text-sm text-[#71717D]">+91</span>
                    <input
                      id="field-phone"
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel-national"
                      value={form.phone}
                      onChange={(e) => set("phone", onlyDigits(e.target.value))}
                      placeholder="10-digit number"
                      className={inputClass}
                      {...aria("phone")}
                    />
                  </Field>

                  <Field id="field-email" label="Email" icon={Mail} error={errors.email}>
                    <input
                      id="field-email"
                      type="email"
                      autoComplete="email"
                      value={form.email}
                      onChange={(e) => set("email", e.target.value)}
                      placeholder="you@example.com"
                      className={inputClass}
                      {...aria("email")}
                    />
                  </Field>

                  {/* WhatsApp */}
                  <div className="sm:col-span-2">
                    <label className="flex cursor-pointer items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={form.sameAsPhone}
                        onChange={(e) => set("sameAsPhone", e.target.checked)}
                        className="h-4 w-4 accent-[#9F2343]"
                      />
                      My WhatsApp number is the same as my mobile number
                    </label>
                  </div>

                  {!form.sameAsPhone && (
                    <div className="sm:col-span-2 sm:max-w-[calc(50%-0.5rem)]">
                      <Field id="field-whatsapp" label="WhatsApp number" icon={FaWhatsapp} error={errors.whatsapp}>
                        <span className="shrink-0 border-r border-[#F0E7E1] pr-2 text-sm text-[#71717D]">+91</span>
                        <input
                          id="field-whatsapp"
                          type="tel"
                          inputMode="numeric"
                          value={form.whatsapp}
                          onChange={(e) => set("whatsapp", onlyDigits(e.target.value))}
                          placeholder="10-digit number"
                          className={inputClass}
                          {...aria("whatsapp")}
                        />
                      </Field>
                    </div>
                  )}

                  {/* Instagram collab */}
                  <div className="rounded-xl bg-[#FBE7EA] p-4 sm:col-span-2">
                    <label className="flex cursor-pointer items-start gap-3">
                      <input
                        type="checkbox"
                        checked={form.collab}
                        onChange={(e) => set("collab", e.target.checked)}
                        className="mt-1 h-4 w-4 accent-[#9F2343]"
                      />
                      <span>
                        <span className="block text-sm font-semibold">I am interested in an Instagram collab</span>
                        <span className="block text-xs text-[#71717D]">
                          Share your look on Instagram with us. Our team will contact you about the collab.
                        </span>
                      </span>
                    </label>

                    {form.collab && (
                      <div className="mt-3 sm:max-w-sm">
                        <Field
                          id="field-instagram"
                          label="Instagram username"
                          icon={AtSign}
                          error={errors.instagram}
                        >
                          <input
                            id="field-instagram"
                            type="text"
                            autoComplete="off"
                            autoCapitalize="none"
                            value={form.instagram}
                            onChange={(e) => set("instagram", e.target.value)}
                            placeholder="@yourname"
                            className={inputClass}
                            {...aria("instagram")}
                          />
                        </Field>
                      </div>
                    )}
                  </div>
                </div>
              </form>
            </div>

            {/* Summary */}
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-2xl border border-[#F0E7E1] bg-white p-5 shadow-sm">
                <h2 className="font-display text-xl font-semibold text-[#79172F]">Summary</h2>

                <dl className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-[#71717D]">Services</dt>
                    <dd className="font-semibold">{count}</dd>
                  </div>
                  <div className="flex items-baseline justify-between border-t border-[#F0E7E1] pt-3">
                    <dt className="text-[#71717D]">Estimated total</dt>
                    <dd className="text-2xl font-bold text-[#C96A00]">₹{total}</dd>
                  </div>
                </dl>

                {unpriced > 0 && (
                  <p className="mt-2 text-xs text-[#71717D]">
                    {unpriced} service{unpriced > 1 ? "s are" : " is"} priced at billing and not included in
                    the total.
                  </p>
                )}

                {submitError && (
                  <div role="alert" className="mt-4 rounded-xl bg-[#FBE7EA] p-3 text-sm text-[#79172F]">
                    <p>{submitError}</p>
                    {waUrl && (
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex items-center gap-2 font-semibold underline"
                      >
                        <FaWhatsapp size={16} /> Send on WhatsApp instead
                      </a>
                    )}
                  </div>
                )}

                <button
                  type="submit"
                  form="appointment-form"
                  disabled={sending}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#171923] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#79172F] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <I icon={CalendarDays} className="text-[#FFD166]" />
                  {sending ? "Sending..." : "Request appointment"}
                </button>

                <p className="mt-3 text-xs text-[#71717D]">
                  We use these details only to arrange and confirm your appointment.
                </p>
              </div>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
};

export default Appointment;