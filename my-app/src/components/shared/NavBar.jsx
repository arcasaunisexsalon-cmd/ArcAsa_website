import { useState, useEffect, useMemo, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { CalendarDays, Search, X, Menu } from "lucide-react";
import { FaInstagram, FaFacebook, FaWhatsapp } from "react-icons/fa";
import { useBooking } from "../../context/BookingContext";

import logo from "../../assets/images/logo.svg";

// Same data files the Services page uses (they power the search)
import { gentsHair } from "../../constants/services/ghair";
import { gntBeard } from "../../constants/services/gbeard";
import { gMakeup } from "../../constants/services/gmakeup";
import { ladiesHair } from "../../constants/services/lhair";
import { lMakeup } from "../../constants/services/makeup";
import { masSage } from "../../constants/services/massage";

/* ------------------------------------------------------------------ */
/* Content: edit these, no need to touch the markup below             */
/* ------------------------------------------------------------------ */

const SALON_NAME = "ArcAsa Unisex Salon";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Services", to: "/services" },
  { label: "Events", to: "/events" },
  { label: "About Us", to: "/about" },
  { label: "Contact Us", to: "/contact" },
  { label: "Products", to: "/products" },
  { label: "Blogs", to: "/blogs" },
  { label: "Appointments", to: "/appointments" },
];

const socials = [
  { label: "Instagram", href: "https://www.instagram.com/arcasa_unisex_salon", icon: FaInstagram, color: "#E4405F" },
  { label: "Facebook", href: "https://www.facebook.com/profile.php?id=61590559291603", icon: FaFacebook, color: "#1877F2" },
  { label: "WhatsApp", href: "https://wa.me/918093077919", icon: FaWhatsapp, color: "#25D366" },
];

// Which data file belongs to which sidebar item on the Services page
const sources = [
  { category: "Gents", item: "Hair", data: gentsHair },
  { category: "Gents", item: "Beard", data: gntBeard },
  { category: "Gents", item: "Makeup", data: gMakeup },
  { category: "Ladies", item: "Hair", data: ladiesHair },
  { category: "Ladies", item: "Makeup", data: lMakeup },
  { category: "Gents", item: "Massage", data: masSage },
];

/* ------------------------------------------------------------------ */
/* Search index (built once)                                           */
/* ------------------------------------------------------------------ */

// Turns nested services (with children) into one flat list
const flatten = (list, parent = "") =>
  list.flatMap((s) => [
    { name: s.serviceName, price: s.price, parent },
    ...(s.children ? flatten(s.children, s.serviceName) : []),
  ]);

const searchIndex = [
  ...navLinks.map((l) => ({
    id: `page-${l.to}`,
    kind: "page",
    name: l.label,
    sub: "Page",
    to: l.to,
    haystack: `${l.label} page`.toLowerCase(),
  })),
  ...sources.flatMap(({ category, item, data }) =>
    flatten(data).map((s, i) => ({
      id: `svc-${category}-${item}-${i}`,
      kind: "service",
      name: s.name,
      price: typeof s.price === "number" ? s.price : null,
      sub: [category, item, s.parent].filter(Boolean).join(" · "),
      category,
      item,
      haystack: `${s.name} ${s.parent} ${category} ${item}`.toLowerCase(),
    }))
  ),
];

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

const linkClass = ({ isActive }) =>
  `whitespace-nowrap rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
    isActive ? "bg-[#FFD166] text-[#171923]" : "text-[#171923] hover:bg-[#FBE7EA]"
  }`;

const NavBar = () => {
  const navigate = useNavigate();
  const { count } = useBooking();

  const [menuOpen, setMenuOpen] = useState(false);
  const [open, setOpen] = useState(false); // search panel
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0); // highlighted result

  const boxRef = useRef(null);
  const inputRef = useRef(null);

  const results = useMemo(() => {
    const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    if (words.length === 0) return [];
    return searchIndex.filter((r) => words.every((w) => r.haystack.includes(w))).slice(0, 8);
  }, [query]);

  const closeSearch = () => {
    setOpen(false);
    setQuery("");
    setActive(0);
  };

  const go = (r) => {
    if (r.kind === "page") navigate(r.to);
    else navigate("/services", { state: { category: r.category, item: r.item } });
    closeSearch();
    setMenuOpen(false);
  };

  // Focus the box when the panel opens
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Click outside closes the panel
  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (!boxRef.current?.contains(e.target)) {
        setOpen(false);
        setQuery("");
        setActive(0);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  const onKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && results[active]) {
      go(results[active]);
    } else if (e.key === "Escape") {
      closeSearch();
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[#F0E7E1] bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-4 py-3 lg:px-6">
        {/* Brand */}
        <Link to="/" aria-label={`${SALON_NAME} home`} className="flex shrink-0 items-center gap-3">
          <img src={logo} alt="" className="h-14 w-14 rounded-full bg-black object-contain p-1" />
          <span className="hidden leading-tight sm:block">
            <span className="block font-display text-lg font-semibold tracking-[0.2em] text-[#171923]">
              UNISEX SALON
            </span>
            <span className="block text-xs text-[#71717D]">Adore yourself with confidence</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Main" className="hidden items-center gap-1 xl:flex">
          {navLinks.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.to === "/"} className={linkClass}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-3 2xl:flex">
            {socials.map(({ label, href, icon: Icon, color }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                style={{ color }}
                className="transition-transform hover:scale-110"
              >
                <Icon size={20} />
              </a>
            ))}
          </div>

          {/* Search */}
          <div ref={boxRef} className="relative">
            <button
              type="button"
              onClick={() => (open ? closeSearch() : setOpen(true))}
              aria-label="Search"
              aria-expanded={open}
              className="grid h-11 w-11 place-items-center rounded-full border border-[#F0E7E1] bg-white text-[#171923] transition-colors hover:bg-[#FBE7EA]"
            >
              <Search size={20} strokeWidth={1.8} />
            </button>

            {open && (
              <div className="absolute right-0 top-full z-50 mt-3 w-[min(92vw,26rem)] overflow-hidden rounded-2xl border border-[#F0E7E1] bg-white shadow-xl">
                <div className="flex items-center gap-3 border-b border-[#F0E7E1] px-4 py-3">
                  <Search size={18} strokeWidth={1.8} className="shrink-0 text-[#9F2343]" />
                  <input
                    ref={inputRef}
                    type="text"
                    role="combobox"
                    aria-expanded="true"
                    aria-controls="site-search-results"
                    aria-activedescendant={results[active] ? `opt-${results[active].id}` : undefined}
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setActive(0);
                    }}
                    onKeyDown={onKeyDown}
                    placeholder="Search services and pages"
                    className="w-full bg-transparent text-sm text-[#171923] outline-none placeholder:text-[#71717D]"
                  />
                  {query && (
                    <button
                      type="button"
                      onClick={() => {
                        setQuery("");
                        inputRef.current?.focus();
                      }}
                      aria-label="Clear search"
                      className="shrink-0 text-[#71717D] hover:text-[#171923]"
                    >
                      <X size={16} strokeWidth={1.8} />
                    </button>
                  )}
                </div>

                <ul
                  id="site-search-results"
                  role="listbox"
                  aria-label="Search results"
                  className="max-h-80 overflow-y-auto p-2"
                >
                  {query.trim() === "" && (
                    <li className="px-3 py-6 text-center text-sm text-[#71717D]">
                      Type to find a haircut, massage, makeup or any page.
                    </li>
                  )}

                  {query.trim() !== "" && results.length === 0 && (
                    <li className="px-3 py-6 text-center text-sm text-[#71717D]">
                      No matches for “{query.trim()}”.
                    </li>
                  )}

                  {results.map((r, i) => (
                    <li
                      key={r.id}
                      id={`opt-${r.id}`}
                      role="option"
                      aria-selected={i === active}
                      onMouseEnter={() => setActive(i)}
                      onClick={() => go(r)}
                      className={`flex cursor-pointer items-center justify-between gap-3 rounded-xl px-3 py-2.5 ${
                        i === active ? "bg-[#FBE7EA]" : ""
                      }`}
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-semibold text-[#171923]">
                          {r.name}
                        </span>
                        <span className="block truncate text-xs text-[#71717D]">{r.sub}</span>
                      </span>
                      {r.price !== null && (
                        <span className="shrink-0 text-sm font-bold text-[#C96A00]">₹{r.price}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Book Appointment */}
          <Link
            to="/appointments"
            className="hidden items-center gap-2 whitespace-nowrap rounded-xl bg-[#171923] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#79172F] md:inline-flex"
          >
            <CalendarDays size={18} strokeWidth={1.8} className="text-[#FFD166]" />
            Book Appointment
            {count > 0 && (
              <span
                aria-label={`${count} services selected`}
                className="grid h-5 min-w-5 place-items-center rounded-full bg-[#FFD166] px-1 text-xs font-bold text-[#171923]"
              >
                {count}
              </span>
            )}
          </Link>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="grid h-11 w-11 place-items-center rounded-full border border-[#F0E7E1] bg-white text-[#171923] xl:hidden"
          >
            {menuOpen ? <X size={20} strokeWidth={1.8} /> : <Menu size={20} strokeWidth={1.8} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav aria-label="Mobile" className="border-t border-[#F0E7E1] bg-white px-4 py-4 xl:hidden">
          <div className="flex flex-wrap gap-2">
            {navLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                onClick={() => setMenuOpen(false)}
                className={linkClass}
              >
                {l.label}
              </NavLink>
            ))}
          </div>
          <Link
            to="/appointments"
            onClick={() => setMenuOpen(false)}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#171923] px-5 py-3 text-sm font-semibold text-white"
          >
            <CalendarDays size={18} strokeWidth={1.8} className="text-[#FFD166]" />
            Book Appointment
          </Link>
        </nav>
      )}
    </header>
  );
};

export default NavBar;