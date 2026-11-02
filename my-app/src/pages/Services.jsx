import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { GiFingernail } from "react-icons/gi";
import {
  UserRound,
  UsersRound,
  Users,
  Baby,
  ChevronDown,
  ChevronRight,
  ArrowRight,
  Scissors,
  Leaf,
  Droplet,
  Heart,
  Sparkles,
  SmileIcon,
} from "lucide-react";

import ServiceList from "../components/services/ServiceList";
import AdSlider from "../components/services/AdSlider";

import { gentsHair } from "../constants/services/ghair";
import { gntBeard } from "../constants/services/gbeard";
import { ladiesHair } from "../constants/services/lhair";
import { lMakeup } from "../constants/services/makeup";
import { earP } from "../constants/services/earp";
import { gMakeup } from "../constants/services/gmakeup";
import { masSage } from "../constants/services/massage";
import { allSkin } from "../constants/services/alskin";
import { kidS } from "../constants/services/kidshair";
import { adsNpckg } from "../constants/services/adsnpckgs";
import { inQuire } from "../constants/services/inquire";
import { useBooking } from "../context/BookingContext";
import { nailP } from "../constants/services/nail";

/* ------------------------------------------------------------------ */
/* Content                                                             */
/* ------------------------------------------------------------------ */



const I = ({ icon: Icon, size = 20, className }) => (
  <Icon size={size} strokeWidth={1.8} className={className} aria-hidden="true" />
);

// An offer or package is shown only when its `active` field is "on"
const isOn = (item) =>
  item.active === true || String(item.active).trim().toLowerCase() === "on";

const categories = [
  { key: "gents", label: "Gents", icon: UserRound, items: ["Hair", "Beard", "Ear Piercing", "Skin", "Makeup", "Massage"] },
  { key: "ladies", label: "Ladies", icon: UserRound, items: ["Hair", "Skin", "Makeup", "Ear Piercing", "Massage", "Nails"] },
  { key: "kids", label: "Kids", icon: Baby, items: ["Hair", "Ear Piercing"] },
  { key: "elders", label: "Elders", icon: UsersRound, items: ["Hair", "Massage", "Skin"] },
  { key: "inquiry", label: "Inquiry", icon: UsersRound, items: ["Appointments"] }
];

// "Category-Item" -> the service list to show
const sections = {
  "Gents-Hair": { data: gentsHair },
  "Gents-Beard": { data: gntBeard },
  "Gents-Makeup": { data: gMakeup },
  "Ladies-Hair": { data: ladiesHair },
  "Ladies-Makeup": { data: lMakeup },
  "Kids-Hair": { data: kidS },
  "Elders-Hair": { data: kidS },
  "Inquiry-Appointments": { data: inQuire },
  "Ladies-Nails": { data: nailP, icon: GiFingernail },
};

// Same list for every category
const commonSections = {
  Massage: { data: masSage, icon: Sparkles },
  Skin: { data: allSkin, icon: SmileIcon },
  "Ear Piercing": { data: earP },
};

// Small feature chips shown in the hero banner
const heroChips = {
  Hair: [
    { label: "Trendy Styles", icon: Scissors },
    { label: "Premium Products", icon: Leaf },
    { label: "Healthy Hair", icon: Droplet },
    { label: "Personalised Care", icon: Heart },
  ],
};

// Package cards under the poster slider. Set active to "off" to hide one.
const packages = [
  { id: 1, title: "Premium Hair Spa", subtitle: "Smooth, shiny & healthy hair", price: 599, image: null, active: "on" },
  { id: 2, title: "Global Hair Colour", subtitle: "Trendy shades for a new you", price: 2499, image: null, active: "on" },
];

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

const Services = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isSelected, toggleService } = useBooking();
  const [openKey, setOpenKey] = useState("ladies");
  const [selected, setSelected] = useState({ category: "Ladies", item: "Hair" });

  // Coming from the search box: open the list that was picked
  useEffect(() => {
    const picked = location.state;
    if (picked?.category && picked?.item) {
      setSelected({ category: picked.category, item: picked.item });
      setOpenKey(picked.category.toLowerCase());
    }
  }, [location.state]);

  // Clicking a package adds it to the booking under Inquiry > Appointments > Others,
  // then opens the Appointment page. Clicking again never adds it twice.
  const bookPackage = ({ key, name, priceLabel = "" }) => {
    const id = `Inquiry-Appointments::${key}::${name}`;
    if (!isSelected(id)) {
      toggleService({
        id,
        sid: key,
        name,
        price: null, // not an exact price, so it is not added to the total
        priceLabel,
        scope: "Inquiry-Appointments",
        group: "Others",
      });
    }
    navigate("/appointments");
  };

  const entry = selected
    ? commonSections[selected.item] ?? sections[`${selected.category}-${selected.item}`]
    : null;
  const chips = selected ? heroChips[selected.item] : null;
  const panelKey = selected ? `${selected.category}-${selected.item}` : "none";

  // Only the "on" items (and ads that really have an image)
  const activeAds = adsNpckg.filter((ad) => isOn(ad) && ad.image);
  const activePackages = packages.filter(isOn);
  const showOffers = activeAds.length > 0 || activePackages.length > 0;

  return (
    <main className="min-h-screen bg-[#FFFCF9] font-sans text-[#171923]">
      <div
        className={`mx-auto grid max-w-[1400px] gap-6 p-4 lg:p-6 ${
          showOffers
            ? "lg:grid-cols-[240px_minmax(0,1fr)_340px]"
            : "lg:grid-cols-[240px_minmax(0,1fr)]"
        }`}
      >
        {/* ---------------- Left sidebar ---------------- */}
        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <nav aria-label="Service categories" className="space-y-3">
            {categories.map((c) => {
              const open = openKey === c.key;
              return (
                <div
                  key={c.key}
                  className="rounded-2xl border border-[#F0E7E1] bg-white p-1.5 shadow-sm"
                >
                  <button
                    type="button"
                    onClick={() => setOpenKey(open ? null : c.key)}
                    aria-expanded={open}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left font-semibold transition-colors ${
                      open ? "bg-[#9F2343] text-white" : "hover:bg-[#FBE7EA]"
                    }`}
                  >
                    <span
                      className={`grid h-9 w-9 place-items-center rounded-xl ${
                        open ? "bg-white/20 text-white" : "bg-[#FBE7EA] text-[#9F2343]"
                      }`}
                    >
                      <I icon={c.icon} size={20} />
                    </span>
                    {c.label}
                    <I
                      icon={ChevronDown}
                      size={18}
                      className={`ml-auto transition-transform duration-300 ${open ? "rotate-180" : ""}`}
                    />
                  </button>

                  <div
                    className={`grid transition-all duration-300 ${
                      open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                  >
                    <ul className="overflow-hidden">
                      {c.items.map((item) => {
                        const active =
                          selected?.category === c.label && selected?.item === item;
                        return (
                          <li key={item} className="px-2 first:pt-1.5 last:pb-1.5">
                            <button
                              type="button"
                              onClick={() => setSelected({ category: c.label, item })}
                              aria-current={active}
                              className={`w-full rounded-xl px-4 py-2 text-left text-sm transition-colors ${
                                active
                                  ? "bg-[#FBE7EA] font-semibold text-[#9F2343]"
                                  : "text-[#171923] hover:bg-[#F9D9E0]"
                              }`}
                            >
                              {item}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              );
            })}
          </nav>

          {/* Promo card */}
          <div className="rounded-2xl bg-gradient-to-b from-[#FBE7EA] to-[#F9D9E0] p-5">
            <p className="font-display text-2xl leading-tight text-[#171923]">
              Transform
              <br />
              Your Hair
            </p>
            <p className="font-['Great_Vibes',cursive] text-4xl text-[#9F2343]">Today</p>
            <button
              type="button"
              onClick={() => bookPackage({ key: "PROMO", name: "General Appointment" })}
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#FFD166] px-4 py-2 text-sm font-semibold text-[#171923]"
            >
              Book Appointment <I icon={ArrowRight} size={16} />
            </button>
          </div>
        </aside>

        {/* ---------------- Center ---------------- */}
        <div className="min-w-0 space-y-6">
          {/* Hero banner */}
          <section className="relative overflow-hidden rounded-2xl bg-[#FBE7EA] p-6 sm:p-8">
            <div
              aria-hidden="true"
              className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-[#F9D9E0]"
            />
            <div className="relative z-10 max-w-lg">
              <h1 className="flex flex-wrap items-baseline gap-x-2 font-display text-4xl font-bold text-[#171923] sm:text-5xl">
                {selected ? `${selected.category}’` : "Our"}
                <span className="font-['Great_Vibes',cursive] text-5xl font-normal text-[#9F2343] sm:text-6xl">
                  {selected ? selected.item : "Services"}
                </span>
              </h1>
              <p className="mt-2 text-sm text-[#71717D]">
                Expert care for every style, every you.
              </p>

              {chips && (
                <ul className="mt-5 flex flex-wrap gap-2">
                  {chips.map(({ label, icon }) => (
                    <li
                      key={label}
                      className="flex items-center gap-2 rounded-xl bg-white/80 px-3 py-2 text-xs font-medium"
                    >
                      <span className="text-[#9F2343]">
                        <I icon={icon} size={18} />
                      </span>
                      {label}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>

          {/* Services */}
          <section className="rounded-2xl border border-[#F0E7E1] bg-white p-5 shadow-sm">
            {entry?.data ? (
              <ServiceList
                key={panelKey}
                scope={panelKey}
                title={`Our ${selected.item} Services`}
                subtitle={`Professional ${selected.item.toLowerCase()} care and styling for every occasion.`}
                data={entry.data}
                fallbackIcon={entry.icon}
              />
            ) : (
              <div className="grid place-items-center gap-2 py-16 text-center text-[#71717D]">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-[#FBE7EA] text-[#9F2343]">
                  <I icon={Sparkles} size={24} />
                </span>
                <p className="font-semibold text-[#171923]">Coming soon</p>
                <p className="text-sm">This service list has not been added yet.</p>
              </div>
            )}
          </section>
        </div>

        {/* ---------------- Right: offers (only what is switched on) ---------------- */}
        {showOffers && (
          <aside className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold text-[#79172F]">
                Offers and Packages
              </h2>
              <Link
                to="/events"
                className="inline-flex items-center gap-1 text-sm font-medium text-[#79172F] hover:underline"
              >
                View All <I icon={ArrowRight} size={16} />
              </Link>
            </div>

            {activeAds.length > 0 && (
              <div className="aspect-[4/5] overflow-hidden rounded-2xl border border-[#F0E7E1] bg-white shadow-sm">
                <AdSlider ads={activeAds} />
              </div>
            )}

            {activePackages.map((p) => (
              <button
              key={p.id}
              type="button"
              onClick={() => bookPackage({key: `PKG_${p.id}`, name: p.title, priceLabel: `From ₹${p.price}` })}
              className="flex w-full items-center gap-4 rounded-2xl border border-[#F0E7E1] bg-white p-3 text-left shadow-sm transition-shadow hover:shadow-md"
            >
                {p.image ? (
                  <img src={p.image} alt="" className="h-24 w-24 shrink-0 rounded-xl object-cover" />
                ) : (
                  <div className="grid h-24 w-24 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[#FBE7EA] to-[#F9D9E0] text-[#9F2343]">
                    <I icon={Sparkles} size={28} />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-[#171923]">{p.title}</h3>
                  <p className="text-xs text-[#71717D]">{p.subtitle}</p>
                  <p className="mt-2 text-xs text-[#71717D]">Starting from</p>
                  <p className="text-lg font-bold text-[#C96A00]">₹{p.price}/-</p>
                </div>
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#9F2343] text-white">
                  <I icon={ChevronRight} size={18} />
                </span>
              </button>
            ))}
          </aside>
        )}
      </div>
    </main>
  );
};

export default Services;