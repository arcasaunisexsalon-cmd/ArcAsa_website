import { useState } from "react";
import { Link } from "react-router-dom";
import { Briefcase, Clock, Mail, MapPin, Navigation, Phone, ArrowRight } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

/* ------------------------------------------------------------------ */
/* Content: edit these, no need to touch the markup below             */
/* ------------------------------------------------------------------ */

const SALON_NAME = "ArcAsa Unisex Salon";
const EMAIL = "arcasaunisexsalon@gmail.com";

/*
  Where the "Careers" button goes. Any one of these works:
    "/careers"                              a page inside this site (you need to add that route)
    "https://forms.gle/your-form"           a Google Form or any website (opens in a new tab)
    "mailto:you@example.com?subject=..."    an email
  It starts as an email so the button works straight away.
*/
const CAREERS_LINK = `mailto:${EMAIL}?subject=${encodeURIComponent("Career enquiry")}`;

/*
  Add one object per unit. The map and the buttons follow the selected unit.
  `mapQuery` is the text Google Maps searches for.
  For an exact pin, open your business on Google Maps, choose Share, then Embed a map,
  and paste the link from src="..." into `embedUrl`.
*/
const units = [
  {
    id: "chandrasekharpur",
    name: "District Center, Chandrasekharpur",
    address: "316, District Center, Chandrasekharpur, Bhubaneswar, Odisha",
    hours: "Monday to Sunday, 9 am to 10 pm",
    mapQuery: "ArcAsa Unisex Salon, 316 District Center, Chandrasekharpur, Bhubaneswar",
    embedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3741.3826505985294!2d85.8183919!3d20.325805000000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a1909d20cf17ba7%3A0x119b6ea8f633bca0!2sArcAsa%20Unisex%20Salon!5e0!3m2!1sen!2sin!4v1793267990718!5m2!1sen!2sin",
    phones: [
      { label: "Reception", number: "8093077919", whatsapp: true },
      { label: "Alternative", number: "9938490049", whatsapp: false },
    ],
  },
];

const comingSoon = ["Bengaluru", "Pune", "Hyderabad", "Kolkata"];

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const I = ({ icon: Icon, size = 20, className }) => (
  <Icon size={size} strokeWidth={1.8} className={className} aria-hidden="true" />
);

const formatPhone = (n) => `+91 ${n.slice(0, 5)} ${n.slice(5)}`;

// Internal pages use <Link>. Websites open in a new tab. mailto: and tel: stay as they are.
const ActionLink = ({ href, className, children }) => {
  if (href.startsWith("/")) {
    return (
      <Link to={href} className={className}>
        {children}
      </Link>
    );
  }
  const external = /^https?:/.test(href);
  return (
    <a
      href={href}
      className={className}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </a>
  );
};

const card = "rounded-2xl border border-[#F0E7E1] bg-white p-5 shadow-sm";
const goldButton =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#FFD166] px-5 py-2.5 text-sm font-semibold text-[#171923] transition-colors hover:bg-[#FFC53D]";
const softButton =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#F0E7E1] bg-white px-5 py-2.5 text-sm font-semibold text-[#171923] transition-colors hover:bg-[#FBE7EA]";

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

const Contact = () => {
  const [unitId, setUnitId] = useState(units[0].id);
  const unit = units.find((u) => u.id === unitId) ?? units[0];

  const query = encodeURIComponent(unit.mapQuery);
  const embedSrc = unit.embedUrl || `https://www.google.com/maps?q=${query}&output=embed`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${query}`;
  const openUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;

  return (
    <main className="min-h-screen bg-[#FFFCF9] font-sans text-[#171923]">
      <div className="mx-auto max-w-[1200px] p-4 lg:p-6">
        <header className="mb-6">
          <h1 className="font-display text-3xl font-bold sm:text-4xl">
            Contact{" "}
            <span className="font-['Great_Vibes',cursive] text-5xl font-normal text-[#9F2343]">us</span>
          </h1>
          <p className="mt-2 text-sm text-[#71717D]">
            Visit us, call us or message us. We are happy to help you pick the right service.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[380px_minmax(0,1fr)]">
          {/* ---------- Unit location ---------- */}
          <section className={`${card} lg:col-start-1 lg:row-start-1`} aria-labelledby="unit-heading">
            <h2 id="unit-heading" className="font-display text-xl font-semibold text-[#79172F]">
              Our unit
            </h2>

            {units.length > 1 && (
              <div className="mt-3 flex flex-wrap gap-1 rounded-full bg-[#F5F4F5] p-1">
                {units.map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    aria-pressed={u.id === unit.id}
                    onClick={() => setUnitId(u.id)}
                    className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
                      u.id === unit.id
                        ? "bg-[#FFD166] font-semibold"
                        : "text-[#71717D] hover:bg-[#FBE7EA]"
                    }`}
                  >
                    {u.name}
                  </button>
                ))}
              </div>
            )}

            <p className="mt-4 font-semibold">{SALON_NAME}</p>

            <ul className="mt-3 space-y-3 text-sm">
              <li className="flex gap-3">
                <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#FBE7EA] text-[#9F2343]">
                  <I icon={MapPin} />
                </span>
                <span>
                  <span className="block font-semibold">Address</span>
                  <address className="not-italic text-[#71717D]">{unit.address}</address>
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#FBE7EA] text-[#9F2343]">
                  <I icon={Clock} />
                </span>
                <span>
                  <span className="block font-semibold">Opening hours</span>
                  <span className="text-[#71717D]">{unit.hours}</span>
                </span>
              </li>
            </ul>

            <div className="mt-5 flex flex-wrap gap-3">
              <ActionLink href={directionsUrl} className={goldButton}>
                <I icon={Navigation} size={18} /> Get directions
              </ActionLink>
              <ActionLink href={openUrl} className={softButton}>
                Open in Google Maps
              </ActionLink>
            </div>

            <p className="mt-4 text-xs text-[#71717D]">More units coming soon: {comingSoon.join(", ")}.</p>
          </section>

          {/* ---------- Google Map ---------- */}
          <section
            className="relative min-h-[320px] overflow-hidden rounded-2xl border border-[#F0E7E1] bg-[#FBE7EA] shadow-sm sm:min-h-[420px] lg:col-start-2 lg:row-span-3 lg:row-start-1 lg:min-h-[560px]"
            aria-label={`Map showing ${SALON_NAME}`}
          >
            <iframe
              key={unit.id}
              title={`Map of ${SALON_NAME}, ${unit.name}`}
              src={embedSrc}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 h-full w-full border-0"
            />
          </section>

          {/* ---------- Mobile contact ---------- */}
          <section className={`${card} lg:col-start-1 lg:row-start-2`} aria-labelledby="phone-heading">
            <h2 id="phone-heading" className="font-display text-xl font-semibold text-[#79172F]">
              Call or message us
            </h2>

            <ul className="mt-4 space-y-4">
              {unit.phones.map((p) => (
                <li key={p.number}>
                  <p className="text-xs font-medium uppercase tracking-wide text-[#71717D]">{p.label}</p>
                  <p className="text-lg font-bold">{formatPhone(p.number)}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <a href={`tel:+91${p.number}`} className={goldButton}>
                      <I icon={Phone} size={18} /> Call
                    </a>
                    {p.whatsapp && (
                      <a
                        href={`https://wa.me/91${p.number}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={softButton}
                      >
                        <FaWhatsapp size={18} className="text-[#25D366]" aria-hidden="true" /> WhatsApp
                      </a>
                    )}
                  </div>
                </li>
              ))}
            </ul>

            <a
              href={`mailto:${EMAIL}`}
              className="mt-5 flex items-center gap-3 border-t border-[#F0E7E1] pt-4 text-sm hover:underline"
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#FBE7EA] text-[#9F2343]">
                <I icon={Mail} />
              </span>
              <span className="min-w-0 break-words">{EMAIL}</span>
            </a>
          </section>

          {/* ---------- Careers ---------- */}
          <section
            className="rounded-2xl bg-gradient-to-b from-[#FBE7EA] to-[#F9D9E0] p-5 lg:col-start-1 lg:row-start-3"
            aria-labelledby="careers-heading"
          >
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/70 text-[#9F2343]">
              <I icon={Briefcase} />
            </span>
            <h2 id="careers-heading" className="mt-3 font-display text-xl font-semibold text-[#79172F]">
              Careers
            </h2>
            <p className="mt-1 text-sm text-[#71717D]">
              Love hair, skin or makeup? Join the {SALON_NAME} team and grow with us.
            </p>
            <ActionLink href={CAREERS_LINK} className={`${goldButton} mt-4`}>
              View careers <I icon={ArrowRight} size={16} />
            </ActionLink>
          </section>
        </div>
      </div>
    </main>
  );
};

export default Contact;